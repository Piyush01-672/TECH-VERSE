import nodemailer from 'nodemailer';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getMimeType(buf) {
  if (!buf || buf.length < 4) return 'image/png';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf[0] === 0x3c) return 'image/svg+xml';
  return 'image/png';
}

async function getLogoBase64(filename, fallbackUrl) {
  const possiblePaths = [
    path.join(process.cwd(), 'public', filename),
    path.join(process.cwd(), 'Frontend', 'public', filename),
    path.join(process.cwd(), 'dist', filename),
    path.join(process.cwd(), 'dist', 'assets', filename),
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        const mime = getMimeType(buf);
        return `data:${mime};base64,${buf.toString('base64')}`;
      }
    } catch (_) {}
  }

  // Fallback: fetch over HTTP
  if (fallbackUrl) {
    try {
      const resp = await fetch(fallbackUrl);
      if (resp.ok) {
        const arr = await resp.arrayBuffer();
        const buf = Buffer.from(arr);
        const mime = getMimeType(buf);
        return `data:${mime};base64,${buf.toString('base64')}`;
      }
    } catch (e) {
      console.warn(`Logo fetch fallback failed for ${filename}:`, e.message);
    }
  }

  return '';
}

let cachedFontBuffers = null;

async function getFontBuffers() {
  if (cachedFontBuffers && cachedFontBuffers.length >= 2) {
    return cachedFontBuffers;
  }

  const possibleDirs = [
    path.join(__dirname, 'fonts'),
    path.join(process.cwd(), 'api', 'fonts'),
    path.join(process.cwd(), 'Frontend', 'api', 'fonts'),
    path.join(process.cwd(), 'Backend', 'assets', 'fonts'),
    path.join(__dirname, '../assets/fonts'),
  ];

  let boldBuf = null;
  let regBuf = null;

  for (const dir of possibleDirs) {
    try {
      const boldPath = path.join(dir, 'Roboto-Bold.ttf');
      const regPath = path.join(dir, 'Roboto-Regular.ttf');
      if (!boldBuf && fs.existsSync(boldPath)) {
        boldBuf = fs.readFileSync(boldPath);
      }
      if (!regBuf && fs.existsSync(regPath)) {
        regBuf = fs.readFileSync(regPath);
      }
    } catch (_) {}
  }

  // Windows system font fallback if local files weren't read
  if (process.platform === 'win32') {
    try {
      if (!boldBuf && fs.existsSync('C:/Windows/Fonts/segoeuib.ttf')) boldBuf = fs.readFileSync('C:/Windows/Fonts/segoeuib.ttf');
      if (!regBuf && fs.existsSync('C:/Windows/Fonts/segoeui.ttf')) regBuf = fs.readFileSync('C:/Windows/Fonts/segoeui.ttf');
    } catch (_) {}
  }

  // Remote CDN fallback (fetch into memory buffer if missing)
  if (!boldBuf || !regBuf) {
    try {
      if (!boldBuf) {
        const resp = await fetch('https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Bold.ttf');
        if (resp.ok) boldBuf = Buffer.from(await resp.arrayBuffer());
      }
      if (!regBuf) {
        const resp = await fetch('https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Regular.ttf');
        if (resp.ok) regBuf = Buffer.from(await resp.arrayBuffer());
      }
    } catch (err) {
      console.warn('Could not fetch fallback font buffers:', err.message);
    }
  }

  const buffers = [];
  if (boldBuf) buffers.push(boldBuf);
  if (regBuf) buffers.push(regBuf);

  if (buffers.length > 0) {
    cachedFontBuffers = buffers;
  }
  return buffers;
}

async function ensureFontFiles() {
  const possibleDirs = [
    path.join(__dirname, 'fonts'),
    path.join(process.cwd(), 'api', 'fonts'),
    path.join(process.cwd(), 'Frontend', 'api', 'fonts'),
    path.join(process.cwd(), 'Backend', 'assets', 'fonts'),
    path.join(__dirname, '../assets/fonts'),
  ];

  const boldCandidates = possibleDirs.map(d => path.join(d, 'Roboto-Bold.ttf'));
  const regCandidates = possibleDirs.map(d => path.join(d, 'Roboto-Regular.ttf'));

  const foundBold = boldCandidates.find(p => { try { return fs.existsSync(p); } catch { return false; } });
  const foundReg = regCandidates.find(p => { try { return fs.existsSync(p); } catch { return false; } });

  const fontFiles = [];
  if (foundBold) fontFiles.push(foundBold);
  if (foundReg) fontFiles.push(foundReg);

  if (fontFiles.length >= 2) return fontFiles;

  // Local Windows system font fallback
  if (process.platform === 'win32') {
    if (fs.existsSync('C:/Windows/Fonts/segoeuib.ttf')) fontFiles.push('C:/Windows/Fonts/segoeuib.ttf');
    if (fs.existsSync('C:/Windows/Fonts/segoeui.ttf')) fontFiles.push('C:/Windows/Fonts/segoeui.ttf');
    if (fontFiles.length >= 2) return fontFiles;
  }

  // Cloud serverless / AWS Lambda fallback: download once into /tmp
  try {
    const tmpDir = os.tmpdir();
    const tmpBold = path.join(tmpDir, 'Roboto-Bold.ttf');
    const tmpReg = path.join(tmpDir, 'Roboto-Regular.ttf');

    if (!fs.existsSync(tmpBold)) {
      const resp = await fetch('https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Bold.ttf');
      if (resp.ok) {
        fs.writeFileSync(tmpBold, Buffer.from(await resp.arrayBuffer()));
      }
    }
    if (!fs.existsSync(tmpReg)) {
      const resp = await fetch('https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Regular.ttf');
      if (resp.ok) {
        fs.writeFileSync(tmpReg, Buffer.from(await resp.arrayBuffer()));
      }
    }
    if (fs.existsSync(tmpBold) && !fontFiles.includes(tmpBold)) fontFiles.push(tmpBold);
    if (fs.existsSync(tmpReg) && !fontFiles.includes(tmpReg)) fontFiles.push(tmpReg);
  } catch (err) {
    console.warn('Could not download fallback fonts:', err.message);
  }

  return fontFiles;
}

function generateIdCardSvg(m, options = {}) {
  const isPromotion = Boolean(options.isPromotion);
  const univLogoBase64 = options.univLogoBase64 || '';
  const techverseLogoBase64 = options.techverseLogoBase64 || '';
  const soetLogoBase64 = options.soetLogoBase64 || '';
  const photoBase64 = options.photoBase64 || null;

  const rawName = (m.name || 'Club Member').toUpperCase();
  const name = escapeXml(rawName);
  const regNumber = escapeXml(m.regNumber || 'N/A');
  const department = escapeXml(m.department === 'btech' ? 'B.Tech (SOET)' : (m.department === 'bca' ? 'BCA (SOET)' : String(m.department || 'B.Tech').toUpperCase()));
  const batch = escapeXml(m.batch || '2024-2028');
  const designation = escapeXml(m.designation || (isPromotion ? 'Club Leader' : 'Active Member'));
  const roleAssignee = escapeXml(m.roleAssignee || (isPromotion ? 'President and Committee Members of the Club' : 'Core Team Member'));
  const residence = escapeXml(m.residenceType || 'Day Scholar');
  const contact = escapeXml(m.contact || 'N/A');

  const borderColor = isPromotion ? '#f59e0b' : '#3b82f6';
  const accentGradientStart = isPromotion ? '#1e1b4b' : '#0f172a';
  const accentGradientMid = isPromotion ? '#312e81' : '#1e3a8a';
  const accentGradientEnd = isPromotion ? '#1e3a8a' : '#0284c7';
  const badgeTitle = isPromotion ? 'EXECUTIVE LEADERSHIP CREDENTIAL' : 'OFFICIAL CLUB IDENTITY CARD';
  const fontFam = "Roboto, 'Segoe UI', Arial, sans-serif";

  let photoElement = '';
  if (photoBase64) {
    photoElement = `<image href="${photoBase64}" x="50" y="240" width="200" height="280" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>`;
  } else {
    const initial = escapeXml(rawName.charAt(0) || 'M');
    photoElement = `
      <rect x="50" y="240" width="200" height="280" rx="20" fill="#1e293b" stroke="${borderColor}" stroke-width="2"/>
      <circle cx="150" cy="370" r="70" fill="${isPromotion ? '#312e81' : '#1e3a8a'}" opacity="0.6"/>
      <text x="150" y="402" font-family="${fontFam}" font-size="85" font-weight="900" fill="${borderColor}" text-anchor="middle">${initial}</text>
    `;
  }

  let barcodeLines = '';
  const seedString = `${m.regNumber || '2024'}TECHVERSE`;
  for (let i = 0; i < 58; i++) {
    const x = 70 + i * 9.6;
    const charCode = seedString.charCodeAt(i % seedString.length);
    const w = (i % 4 === 0 || charCode % 3 === 0) ? 4.5 : (i % 2 === 0 ? 2.5 : 1.5);
    barcodeLines += `<rect x="${x.toFixed(1)}" y="18" width="${w}" height="42" fill="#0f172a" />`;
  }

  return `
<svg width="700" height="1060" viewBox="0 0 700 1060" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="65%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentGradientStart}" />
      <stop offset="50%" stop-color="${accentGradientMid}" />
      <stop offset="100%" stop-color="${accentGradientEnd}" />
    </linearGradient>
    <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <clipPath id="cardClip">
      <rect x="0" y="0" width="700" height="1060" rx="36" />
    </clipPath>
    <clipPath id="photoClip">
      <rect x="50" y="240" width="200" height="280" rx="20" />
    </clipPath>
    <clipPath id="techverseClip">
      <circle cx="350" cy="98" r="36" />
    </clipPath>
  </defs>

  <g clip-path="url(#cardClip)">
    <rect x="0" y="0" width="700" height="1060" fill="url(#cardBg)"/>
    <rect x="3" y="3" width="694" height="1054" rx="33" fill="none" stroke="${borderColor}" stroke-width="6"/>
    <rect x="8" y="8" width="684" height="1044" rx="28" fill="none" stroke="${isPromotion ? '#fde047' : '#93c5fd'}" stroke-width="1.5" opacity="0.7"/>
    <rect x="305" y="14" width="90" height="14" rx="7" fill="#0f172a"/>
    <rect x="306" y="15" width="88" height="12" rx="6" fill="#1e293b"/>

    <rect x="0" y="38" width="700" height="152" fill="url(#headerGrad)"/>
    <line x1="0" y1="190" x2="700" y2="190" stroke="url(#goldRibbon)" stroke-width="4"/>

    <g transform="translate(45, 52)">
      ${univLogoBase64 ? `<image href="${univLogoBase64}" x="0" y="0" width="105" height="65" preserveAspectRatio="xMidYMid meet"/>` : ''}
    </g>
    <circle cx="350" cy="98" r="39" fill="#ffffff" stroke="${borderColor}" stroke-width="3"/>
    ${techverseLogoBase64 ? `<image href="${techverseLogoBase64}" x="313" y="61" width="74" height="74" preserveAspectRatio="xMidYMid slice" clip-path="url(#techverseClip)"/>` : ''}
    <g transform="translate(550, 52)">
      ${soetLogoBase64 ? `<image href="${soetLogoBase64}" x="0" y="0" width="105" height="65" preserveAspectRatio="xMidYMid meet"/>` : ''}
    </g>

    <text x="350" y="156" font-family="${fontFam}" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">CT UNIVERSITY</text>
    <text x="350" y="176" font-family="${fontFam}" font-size="11" font-weight="800" fill="#cbd5e1" text-anchor="middle" letter-spacing="2">SCHOOL OF ENGINEERING &amp; TECHNOLOGY • TECHVERSE CLUB</text>

    <rect x="40" y="202" width="620" height="28" rx="8" fill="${isPromotion ? '#fef3c7' : '#eff6ff'}" stroke="${borderColor}" stroke-width="1.5"/>
    <text x="350" y="221" font-family="${fontFam}" font-size="11" font-weight="900" fill="${isPromotion ? '#92400e' : '#1e40af'}" text-anchor="middle" letter-spacing="2">${badgeTitle}</text>

    <!-- PHOTO BOX -->
    <rect x="48" y="238" width="204" height="284" rx="22" fill="none" stroke="${borderColor}" stroke-width="4"/>
    ${photoElement}

    <!-- Security Chip / Official Authenticity Seal Under Photo -->
    <g transform="translate(48, 542)">
      <rect x="0" y="0" width="204" height="66" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <circle cx="28" cy="33" r="16" fill="${isPromotion ? '#fef3c7' : '#eff6ff'}" stroke="${borderColor}" stroke-width="2"/>
      <polygon points="28,24 30.5,30 37,30.5 32,34.5 34,41 28.5,37 23,41 25,34.5 20,30.5 26.5,30" fill="${borderColor}"/>
      <text x="56" y="28" font-family="${fontFam}" font-size="10" font-weight="900" fill="#0f172a" letter-spacing="1">AUTHENTIC CREDENTIAL</text>
      <text x="56" y="45" font-family="${fontFam}" font-size="9" font-weight="700" fill="#64748b">CT UNIVERSITY • SOET</text>
    </g>

    <!-- RIGHT SIDE MEMBER DETAILS -->
    <g transform="translate(280, 238)">
      <text x="0" y="18" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1.5">FULL NAME</text>
      <text x="0" y="46" font-family="${fontFam}" font-size="23" font-weight="900" fill="#0f172a">${name}</text>
      <line x1="0" y1="58" x2="375" y2="58" stroke="#e2e8f0" stroke-width="1.5"/>

      <text x="0" y="80" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">REGISTRATION NO.</text>
      <text x="0" y="103" font-family="${fontFam}" font-size="18" font-weight="900" fill="#1e40af">${regNumber}</text>

      <text x="0" y="130" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">DEPARTMENT &amp; BATCH</text>
      <text x="0" y="150" font-family="${fontFam}" font-size="14" font-weight="700" fill="#1e293b">${department} • ${batch}</text>

      <text x="0" y="180" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">OFFICIAL CLUB DESIGNATION</text>
      <rect x="0" y="188" width="375" height="34" rx="8" fill="${isPromotion ? '#fef3c7' : '#f0fdf4'}" stroke="${borderColor}" stroke-width="2"/>
      <text x="14" y="211" font-family="${fontFam}" font-size="14" font-weight="900" fill="${isPromotion ? '#92400e' : '#166534'}">${isPromotion ? 'PROMOTED • ' : ''}${designation}</text>

      <text x="0" y="246" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">ROLE ASSIGNEE / DIVISION</text>
      <rect x="0" y="254" width="375" height="28" rx="6" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="14" y="273" font-family="${fontFam}" font-size="12" font-weight="800" fill="#1e40af">${roleAssignee}</text>

      <text x="0" y="304" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">RESIDENCE TYPE</text>
      <text x="0" y="322" font-family="${fontFam}" font-size="13" font-weight="700" fill="#334155">${residence}</text>

      <text x="190" y="304" font-family="${fontFam}" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">CONTACT NUMBER</text>
      <text x="190" y="322" font-family="${fontFam}" font-size="13" font-weight="700" fill="#334155">${contact}</text>
    </g>

    <line x1="45" y1="630" x2="655" y2="630" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6,4"/>

    <g transform="translate(48, 646)">
      <rect x="0" y="0" width="375" height="64" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="16" y="22" font-family="${fontFam}" font-size="10" font-weight="900" fill="#0f172a" letter-spacing="1">VERIFIED UNIVERSITY CREDENTIAL</text>
      <text x="16" y="38" font-family="${fontFam}" font-size="9" fill="#64748b">Recognized for University Symposiums, Hackathons &amp; Events</text>
      <text x="16" y="52" font-family="${fontFam}" font-size="9" font-weight="700" fill="#059669">Log Validated • Academic Session ${batch}</text>

      <g transform="translate(415, -2)">
        <text x="95" y="40" font-family="${fontFam}" font-style="italic" font-weight="900" font-size="22" fill="#1e3a8a" text-anchor="middle">TechVerse CTU</text>
        <line x1="0" y1="48" x2="190" y2="48" stroke="#0f172a" stroke-width="1.5"/>
        <text x="95" y="62" font-family="${fontFam}" font-size="9" font-weight="800" fill="#475569" text-anchor="middle" letter-spacing="0.5">AUTHORIZED SIGNATORY</text>
      </g>
    </g>

    <!-- CLEAN BARCODE SECTION -->
    <g transform="translate(45, 730)">
      <rect x="0" y="0" width="610" height="92" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      ${barcodeLines}
      <text x="305" y="78" font-family="${fontFam}" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="4">* REG-${regNumber} • TECHVERSE • CT UNIVERSITY *</text>
    </g>

    <rect x="0" y="850" width="700" height="210" fill="#0f172a"/>
    <line x1="0" y1="850" x2="700" y2="850" stroke="${borderColor}" stroke-width="3"/>

    <text x="350" y="885" font-family="${fontFam}" font-size="12" font-weight="800" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">TECHVERSE CLUB • SCHOOL OF ENGINEERING &amp; TECHNOLOGY</text>
    <text x="350" y="906" font-family="${fontFam}" font-size="11" fill="#94a3b8" text-anchor="middle">CT University, Ferozepur Road, Ludhiana, Punjab - 142024</text>
    <text x="350" y="927" font-family="${fontFam}" font-size="10" fill="#64748b" text-anchor="middle">Inquiries: techverse@ctuniversity.in • https://techversectu.vercel.app</text>
    <text x="350" y="952" font-family="${fontFam}" font-size="9" font-weight="700" fill="${borderColor}" text-anchor="middle" letter-spacing="1">PROPERTY OF TECHVERSE CLUB • IF FOUND, PLEASE RETURN TO SOET OFFICE</text>
  </g>
</svg>
  `;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const emailUser = (process.env.EMAIL_USER ? String(process.env.EMAIL_USER).trim() : '') || 'techverse@ctuniversity.in';
  const emailPass = (process.env.EMAIL_PASS ? String(process.env.EMAIL_PASS).replace(/\s+/g, '').trim() : '') || 'nckubvncujumhgqu';

  if (!emailPass) {
    return res.status(500).json({ success: false, message: 'EMAIL_PASS is not configured' });
  }

  const { type, member, recipient } = req.body || {};

  const targetEmail = recipient || member?.email;
  if (!targetEmail) {
    return res.status(400).json({ success: false, message: 'Recipient email address is required' });
  }

  const cleanRecipient = String(targetEmail).trim().toLowerCase();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });

  const siteUrl = 'https://techversectu.vercel.app';
  const univLogoUrl = `${siteUrl}/univeee-logo.png`;
  const techverseLogoUrl = `${siteUrl}/techverse-logo.jpg`;
  const soetLogoUrl = `${siteUrl}/soet-logo.png`;

  try {
    if (type === 'test') {
      const info = await transporter.sendMail({
        from: `"TechVerse CT University" <${emailUser}>`,
        to: cleanRecipient,
        subject: "TechVerse Email Relay Smoke Test",
        html: `<p>Test successful! TechVerse email relay is operating properly on Vercel Node runtime.</p>`,
      });
      return res.status(200).json({ success: true, messageId: info.messageId });
    }

    if (type === 'screening') {
      const m = member || {};
      const departmentDisplay = m.department === 'btech'
        ? 'B.Tech (School of Engineering & Technology)'
        : (m.department === 'bca' ? 'BCA (School of Engineering & Technology)' : String(m.department || '').toUpperCase());
      const interestsList = Array.isArray(m.interests) ? m.interests.join(', ') : (m.interests || 'Technology & Innovation');

      const submittedDate = m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TechVerse Club Membership Application Acknowledgment</title>
</head>
<body style="margin: 0; padding: 36px 16px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 16px rgba(15,23,42,0.06); overflow: hidden;">
    
    <!-- INSTITUTIONAL LETTERHEAD -->
    <div style="padding: 24px 28px 20px 28px; border-bottom: 2px solid #0f172a; background: #ffffff;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td width="70%" style="vertical-align: middle;">
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.2px; text-transform: uppercase;">TechVerse Club</div>
            <div style="font-size: 13px; font-weight: 600; color: #334155; margin-top: 2px;">School of Engineering &amp; Technology</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">CT University, Ferozepur Road, Ludhiana, Punjab</div>
          </td>
          <td width="30%" align="right" style="vertical-align: middle;">
            <div style="display: inline-block; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;">Application Ref</div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a; font-family: monospace;">Ref #${m.serialNumber || '1'}</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- OFFICIAL NOTICE HEADER -->
    <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 14px 28px;">
      <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px;">Official Memorandum • Application Status</div>
      <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">Acknowledgment of Club Membership Application</div>
    </div>

    <!-- FORMAL LETTER BODY -->
    <div style="padding: 28px 28px 32px 28px; font-size: 14px; line-height: 1.7; color: #334155;">
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a;">
        Dear <strong>${escapeHtml(m.name)}</strong>,
      </p>

      <p style="margin: 0 0 16px 0;">
        Thank you for your interest in joining <strong>TechVerse Club</strong> at the School of Engineering &amp; Technology, CT University. This official memorandum confirms that your application for membership has been successfully registered and placed under active screening.
      </p>

      <!-- APPLICATION RECORD TABLE -->
      <div style="margin: 22px 0; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <div style="background: #f8fafc; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.8px;">
          Registered Application Particulars
        </div>
        <table width="100%" cellspacing="0" cellpadding="8" border="0" style="font-size: 13px; background: #ffffff;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td width="36%" style="color: #64748b; font-weight: 600; padding: 10px 16px;">Applicant Name:</td>
            <td style="color: #0f172a; font-weight: 700; padding: 10px 16px;">${escapeHtml(m.name)}</td>
          </tr>
          <tr style="background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600; padding: 10px 16px;">Registration Number:</td>
            <td style="color: #0f172a; font-weight: 700; font-family: monospace; padding: 10px 16px;">${escapeHtml(m.regNumber || 'N/A')}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600; padding: 10px 16px;">Academic Program:</td>
            <td style="color: #0f172a; padding: 10px 16px;">${escapeHtml(departmentDisplay)}</td>
          </tr>
          <tr style="background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600; padding: 10px 16px;">Academic Batch:</td>
            <td style="color: #0f172a; padding: 10px 16px;">${escapeHtml(m.batch || '2024-2028')}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600; padding: 10px 16px;">Technical Interests:</td>
            <td style="color: #0f172a; padding: 10px 16px;">${escapeHtml(interestsList)}</td>
          </tr>
          <tr style="background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600; padding: 10px 16px;">Submission Date:</td>
            <td style="color: #0f172a; padding: 10px 16px;">${submittedDate}</td>
          </tr>
          <tr style="background: #ffffff;">
            <td style="color: #64748b; font-weight: 600; padding: 10px 16px;">Current Status:</td>
            <td style="color: #0284c7; font-weight: 700; padding: 10px 16px;">Received &bull; Under Screening Review</td>
          </tr>
        </table>
      </div>

      <!-- FORMAL CLARIFICATION NOTICE -->
      <div style="background: #f8fafc; border-left: 4px solid #0f172a; padding: 14px 18px; border-radius: 0 6px 6px 0; margin: 20px 0; font-size: 12.5px; color: #475569; line-height: 1.6;">
        <strong style="color: #0f172a;">Institutional Notice:</strong> This communication is an official acknowledgment of application receipt only. It is not an ID card or formal club appointment. Official membership credentials and verified digital ID cards are issued separately following evaluation and designation confirmation.
      </div>

      <p style="margin: 18px 0 16px 0;">
        Your application is currently being evaluated by the <strong>President and Committee Members of the Club</strong>. Candidates whose profiles align with club requirements will be contacted regarding role assignments and onboarding formalities.
      </p>

      <p style="margin: 0 0 24px 0;">
        If you have any questions or require any changes to your submission details, please write to us at <a href="mailto:techverse@ctuniversity.in" style="color: #0284c7; text-decoration: none; font-weight: 600;">techverse@ctuniversity.in</a>.
      </p>

      <!-- FORMAL SIGN-OFF -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <tr>
          <td style="vertical-align: middle; font-size: 13px; color: #475569; line-height: 1.6;">
            Sincerely,<br/>
            <strong style="color: #0f172a; font-size: 14px;">President and Committee Members of the Club</strong><br/>
            TechVerse Club • School of Engineering &amp; Technology<br/>
            CT University, Ludhiana, Punjab
          </td>
          <td align="right" style="vertical-align: middle; width: 72px;">
            <img src="${techverseLogoUrl}" alt="TechVerse Club Logo" width="58" height="58" style="display: block; width: 58px; height: 58px; border-radius: 12px; border: 1.5px solid #cbd5e1; object-fit: cover; box-shadow: 0 2px 6px rgba(15,23,42,0.08);" />
          </td>
        </tr>
      </table>
    </div>

    <!-- FOOTER -->
    <div style="background: #f8fafc; padding: 14px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
      <img src="${techverseLogoUrl}" alt="TechVerse" width="18" height="18" style="vertical-align: -4px; border-radius: 50%; border: 1px solid #cbd5e1; margin-right: 6px; display: inline-block;" />
      Official Communication • TechVerse Club, SOET, CT University • Inquiries: <a href="mailto:techverse@ctuniversity.in" style="color: #0284c7; text-decoration: none;">techverse@ctuniversity.in</a>
    </div>
  </div>
</body>
</html>
      `;

      const info = await transporter.sendMail({
        from: `"TechVerse Club • CT University" <${emailUser}>`,
        to: cleanRecipient,
        replyTo: emailUser,
        subject: `TechVerse Club Membership Application Received - Ref #${m.serialNumber || '1'} (${m.name})`,
        html: htmlContent,
      });

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
        message: `Screening email sent to ${cleanRecipient}`,
      });
    }

    // =========================================================================
    // TYPE: RESIGNATION (Formal Resignation Acceptance)
    // =========================================================================
    // =========================================================================
    // TYPE: RESIGNATION (Warm, Curated & Career-Growth Relieving Notice)
    // =========================================================================
    if (type === 'resignation') {
      const m = member || {};
      const resignationRemarks = m.resignationRemarks || req.body?.remarks || 'Duty completed with excellence. Relieved in good standing to pursue career growth and higher professional aspirations.';
      const desig = m.designation || 'Club Member';
      const roleAssignee = m.roleAssignee || 'Core Team';

      const resignationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Honorable Relieving &amp; Best Wishes for Your Future Career Growth - TechVerse Club</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="640" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 32px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #0f172a 55%, #1e3a8a 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background: rgba(52,211,153,0.18); border: 1px solid rgba(52,211,153,0.4); color: #a7f3d0; font-size: 11px; font-weight: 800; padding: 5px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">Exemplary Service Recognition • Future Career Best Wishes</span>
              <h1 style="margin: 4px 0 8px 0; font-size: 23px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">Thank You for Your Outstanding Service &amp; Dedication</h1>
              <p style="margin: 0; font-size: 13px; color: #cbd5e1;">School of Engineering &amp; Technology • CT University</p>
            </td>
          </tr>

          <!-- LOGOS RIBBON -->
          <tr>
            <td style="background: #ffffff; padding: 14px 24px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" width="30%" style="vertical-align: middle;">
                    <img src="${univLogoUrl}" alt="CT University" style="max-height: 46px; max-width: 85px; object-fit: contain;" />
                  </td>
                  <td align="center" width="40%" style="vertical-align: middle;">
                    <img src="${techverseLogoUrl}" alt="TechVerse Club" style="max-height: 52px; max-width: 52px; border-radius: 50%; border: 2px solid #10b981; object-fit: cover;" />
                  </td>
                  <td align="center" width="30%" style="vertical-align: middle;">
                    <img src="${soetLogoUrl}" alt="SOET" style="max-height: 46px; max-width: 85px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 32px 28px; color: #334155; font-size: 14px; line-height: 1.7;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a;">
                Dear <strong>${escapeHtml(m.name)}</strong> (Reg No: <strong>${escapeHtml(m.regNumber)}</strong>),
              </p>
              
              <p style="margin: 0 0 16px 0;">
                On behalf of the <strong>President and Committee Members of the Club (TechVerse Club, SOET, CT University)</strong>, we are writing to warmly acknowledge and confirm that your official resignation from your active post as <strong>${escapeHtml(desig)}</strong> (${escapeHtml(roleAssignee)}) has been accepted on a truly commendable note.
              </p>

              <p style="margin: 0 0 18px 0;">
                Throughout your tenure, you performed your duties with exceptional dedication, technical excellence, and sincere commitment. As you conclude your active service with the club to focus on your graduation and embark on your <strong>future career growth, higher professional opportunities, and personal milestones</strong>, the club leadership proudly celebrates the impactful work and positive spirit you brought to our community.
              </p>

              <!-- APPRECIATION CARD -->
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #22c55e; padding: 18px 20px; border-radius: 0 14px 14px 0; margin: 22px 0;">
                <h4 style="margin: 0 0 6px 0; font-size: 14px; color: #15803d; font-weight: 800;">
                  Commendation for Duty Completed with Excellence
                </h4>
                <p style="margin: 0; color: #166534; font-size: 13.5px; line-height: 1.6;">
                  Thank you sincerely for the passion, creative leadership, and craftsmanship you dedicated to TechVerse Club. You fulfilled your responsibilities with utmost sincerity, inspiring fellow peers and elevating our club events, technical workshops, and initiatives. In honor of your stellar service, your official registry record has been proudly archived as <strong>Relieved with Honors &amp; Full Clearance (Alumnus in Good Standing)</strong>.
                </p>
              </div>

              <!-- NOTES BOX -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 12px 12px 0; margin: 20px 0; font-size: 13px;">
                <span style="display: block; color: #92400e; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; margin-bottom: 4px;">Club Committee Note &amp; Remarks</span>
                <span style="color: #475569; font-style: italic;">"${escapeHtml(resignationRemarks)}"</span>
              </div>

              <!-- OPEN DOORS & FUTURE WISHES -->
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 18px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #1e40af;">
                <p style="margin: 0 0 6px 0; font-weight: 800;">Advancing Towards Future Career Milestones</p>
                <p style="margin: 0; line-height: 1.6;">
                  Moving onward to conquer new professional horizons is a proud milestone. The skills honed, projects delivered, and teamwork fostered during your journey here will serve as strong foundations for your career ahead. You will always remain an esteemed alumnus of the TechVerse family—our doors are permanently open to welcome you back as a guest mentor, speaker, or collaborator.
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #334155; line-height: 1.6;">
                We wish you boundless success, rapid career advancement, and excellence in all your future professional endeavors. Keep innovating, building with ambition, and shining bright!
              </p>

              <!-- SIGNATURE -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <tr>
                  <td style="vertical-align: middle; font-size: 13px; color: #64748b; line-height: 1.6;">
                    Warmest regards and highest recommendations,<br/>
                    <strong style="color: #0f172a;">President and Committee Members of the Club</strong><br/>
                    TechVerse Club • School of Engineering &amp; Technology<br/>
                    CT University, Ludhiana, Punjab
                  </td>
                  <td align="right" style="vertical-align: middle; width: 72px;">
                    <img src="${techverseLogoUrl}" alt="TechVerse Club Logo" width="58" height="58" style="display: block; width: 58px; height: 58px; border-radius: 12px; border: 1.5px solid #cbd5e1; object-fit: cover; box-shadow: 0 2px 6px rgba(15,23,42,0.08);" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
              <p style="margin: 0 0 4px 0;">
                <img src="${techverseLogoUrl}" alt="TechVerse" width="18" height="18" style="vertical-align: -4px; border-radius: 50%; border: 1px solid #cbd5e1; margin-right: 6px; display: inline-block;" />
                Official Administrative Communication • TechVerse Club
              </p>
              <p style="margin: 0;">Inquiries: <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const info = await transporter.sendMail({
        from: `"TechVerse Club • CT University" <${emailUser}>`,
        to: cleanRecipient,
        replyTo: emailUser,
        subject: `With Sincere Appreciation & Best Wishes for Your Future Career Growth • TechVerse Club, CT University`,
        html: resignationHtml,
      });

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
        message: `Curated resignation appreciation email sent to ${cleanRecipient}`,
      });
    }

    // =========================================================================
    // TYPE: TERMINATION (Soft-Toned, Respectful Membership Conclusion Notice)
    // =========================================================================
    if (type === 'termination') {
      const m = member || {};
      const terminationReason = m.terminationReason || req.body?.reason || 'Non-alignment with Club Code of Conduct & commitments';
      const terminationRemarks = m.terminationRemarks || req.body?.remarks || 'Administrative review conducted by the Club Executive Committee.';
      const fineAmount = m.fineAmount || req.body?.fineAmount || 1000;
      const desig = m.designation || 'Club Member';
      const roleAssignee = m.roleAssignee || 'Core Team';

      const terminationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Important Notice Regarding Club Membership - TechVerse Club</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="640" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 32px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;">
          
          <!-- HEADER (ELEGANT DIGNIFIED SLATE-INDIGO PALETTE) -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background: rgba(199,210,254,0.18); border: 1px solid rgba(199,210,254,0.35); color: #e0e7ff; font-size: 11px; font-weight: 800; padding: 5px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">Membership Status Update</span>
              <h1 style="margin: 4px 0 8px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">Important Update Regarding Your TechVerse Membership</h1>
              <p style="margin: 0; font-size: 13px; color: #cbd5e1;">School of Engineering &amp; Technology • CT University</p>
            </td>
          </tr>

          <!-- LOGOS RIBBON -->
          <tr>
            <td style="background: #ffffff; padding: 14px 24px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" width="30%" style="vertical-align: middle;">
                    <img src="${univLogoUrl}" alt="CT University" style="max-height: 46px; max-width: 85px; object-fit: contain;" />
                  </td>
                  <td align="center" width="40%" style="vertical-align: middle;">
                    <img src="${techverseLogoUrl}" alt="TechVerse Club" style="max-height: 52px; max-width: 52px; border-radius: 50%; border: 2px solid #6366f1; object-fit: cover;" />
                  </td>
                  <td align="center" width="30%" style="vertical-align: middle;">
                    <img src="${soetLogoUrl}" alt="SOET" style="max-height: 46px; max-width: 85px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 32px 28px; color: #334155; font-size: 14px; line-height: 1.7;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a;">
                Dear <strong>${escapeHtml(m.name)}</strong> (Reg No: <strong>${escapeHtml(m.regNumber)}</strong>),
              </p>

              <p style="margin: 0 0 16px 0;">
                We hope this message finds you well with your academic studies. We are writing to share an important administrative update regarding your official role as <strong>${escapeHtml(desig)}</strong> (${escapeHtml(roleAssignee)}) in <strong>TechVerse Club</strong>.
              </p>

              <p style="margin: 0 0 18px 0;">
                TechVerse was created to foster an environment where all members actively support one another, deliver on shared commitments, and adhere to community guidelines. During recent reviews by the President and Committee Members of the Club, it was noted that certain core expectations could unfortunately not be maintained.
              </p>

              <!-- SUMMARY OF REVIEW CARD (SOFT SLATE/AMBER) -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #6366f1; padding: 18px 20px; border-radius: 0 14px 14px 0; margin: 22px 0;">
                <h4 style="margin: 0 0 12px 0; color: #1e1b4b; font-size: 13.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;">
                  Review Summary &amp; Details
                </h4>
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #334155;">
                  <tr>
                    <td width="35%" style="font-weight: 700; color: #475569; vertical-align: top;">Observed Reason:</td>
                    <td style="color: #1e293b; font-weight: 600;">${escapeHtml(terminationReason)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700; color: #475569; vertical-align: top;">Committee Remarks:</td>
                    <td style="color: #475569;">${escapeHtml(terminationRemarks)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700; color: #475569; vertical-align: top;">Administrative Clearance:</td>
                    <td style="color: #b45309; font-weight: 700;">
                      ₹${fineAmount} (per agreed onboarding guidelines to conclude exit documentation)
                    </td>
                  </tr>
                </table>
              </div>

              <!-- GENTLE TRANSITION EXPLANATION -->
              <p style="margin: 0 0 16px 0;">
                We genuinely understand that balancing college courses, exam preparations, and various personal responsibilities can be challenging. However, to remain fair to all peers who are actively executing upcoming initiatives, the President and Committee Members of the Club have concluded your official active appointment with TechVerse Club, effective today.
              </p>

              <!-- CREDENTIALS TRANSITION (RESPECTFUL & GENTLE) -->
              <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 16px 18px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #334155;">
                <p style="margin: 0 0 6px 0; font-weight: 800; color: #1e293b;">Membership Records &amp; Clearance Information</p>
                <p style="margin: 0; line-height: 1.6;">
                  In line with this update, your active club digital ID card and official portal access have been deactivated in the club registry. Should you wish to discuss this update, request clarification, or complete the clearance formalities (₹${fineAmount}), you are warmly welcome to visit the SOET Department Office during academic working hours—our club committee leads will be pleased to assist you.
                </p>
              </div>

              <!-- CONSTRUCTIVE ENCOURAGEMENT & DIGNITY -->
              <p style="margin: 18px 0 0 0; color: #334155; line-height: 1.7;">
                Every phase of university life offers an opportunity for self-reflection, learning, and growth. We sincerely thank you for the time you spent with us and wish you the very best in your academic studies, personal development, and future endeavors.
              </p>

              <!-- SIGNATURE -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <tr>
                  <td style="vertical-align: middle; font-size: 13px; color: #64748b; line-height: 1.6;">
                    With sincere regards and best wishes,<br/>
                    <strong style="color: #0f172a;">President and Committee Members of the Club</strong><br/>
                    TechVerse Club • School of Engineering &amp; Technology<br/>
                    CT University, Ludhiana, Punjab
                  </td>
                  <td align="right" style="vertical-align: middle; width: 72px;">
                    <img src="${techverseLogoUrl}" alt="TechVerse Club Logo" width="58" height="58" style="display: block; width: 58px; height: 58px; border-radius: 12px; border: 1.5px solid #cbd5e1; object-fit: cover; box-shadow: 0 2px 6px rgba(15,23,42,0.08);" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
              <p style="margin: 0 0 4px 0;">
                <img src="${techverseLogoUrl}" alt="TechVerse" width="18" height="18" style="vertical-align: -4px; border-radius: 50%; border: 1px solid #cbd5e1; margin-right: 6px; display: inline-block;" />
                Official Administrative Communication • TechVerse Club
              </p>
              <p style="margin: 0;">Department Contact: <a href="mailto:techverse@ctuniversity.in" style="color: #6366f1; text-decoration: none;">techverse@ctuniversity.in</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const info = await transporter.sendMail({
        from: `"TechVerse Club • CT University" <${emailUser}>`,
        to: cleanRecipient,
        replyTo: emailUser,
        subject: `Important Update Regarding Your TechVerse Club Membership • CT University`,
        html: terminationHtml,
      });

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
        message: `Soft-toned membership update email sent to ${cleanRecipient}`,
      });
    }

    // Default: Official Membership Card (type === 'card' or type === 'promotion' or type === 'membership')
    const isPromotion = type === 'promotion';
    const m = member || {};

    // Load Logos for high-definition SVG/PNG rendering
    const [univLogoBase64, techverseLogoBase64, soetLogoBase64] = await Promise.all([
      getLogoBase64('univeee-logo.png', univLogoUrl),
      getLogoBase64('techverse-logo.jpg', techverseLogoUrl),
      getLogoBase64('soet-logo.png', soetLogoUrl),
    ]);

    // Resolve member photo into base64 if available
    let photoBase64 = null;
    if (m.photo && typeof m.photo === 'string') {
      if (m.photo.startsWith('data:')) {
        photoBase64 = m.photo;
      } else if (m.photo.startsWith('http://') || m.photo.startsWith('https://')) {
        try {
          const resp = await fetch(m.photo);
          if (resp.ok) {
            const arr = await resp.arrayBuffer();
            const buf = Buffer.from(arr);
            const mime = getMimeType(buf);
            photoBase64 = `data:${mime};base64,${buf.toString('base64')}`;
          }
        } catch (err) {
          console.warn('Could not fetch photo URL for SVG embedding:', err.message);
        }
      }
    }

    // Generate High-Definition Standalone ID Card PNG via Resvg
    let cardPngBuffer = null;
    try {
      const svg = generateIdCardSvg(m, {
        isPromotion,
        univLogoBase64,
        techverseLogoBase64,
        soetLogoBase64,
        photoBase64,
      });
      const [fontFiles, fontBuffers] = await Promise.all([
        ensureFontFiles().catch(() => []),
        getFontBuffers().catch(() => []),
      ]);
      const resvgOpts = {
        fitTo: { mode: 'width', value: 1400 },
        shapeRendering: 2,
        textRendering: 2,
        imageRendering: 0,
      };
      const fontOpt = {
        loadSystemFonts: false,
        defaultFontFamily: 'Roboto',
        sansSerifFamily: 'Roboto',
      };
      if (fontBuffers && fontBuffers.length > 0) {
        fontOpt.fontBuffers = fontBuffers;
      }
      if (fontFiles && fontFiles.length > 0) {
        fontOpt.fontFiles = fontFiles;
      }
      if (fontOpt.fontBuffers || fontOpt.fontFiles) {
        resvgOpts.font = fontOpt;
      }
      const resvg = new Resvg(svg, resvgOpts);
      cardPngBuffer = resvg.render().asPng();
    } catch (resvgErr) {
      console.error('Resvg PNG rendering failed, attempting SVG fallback:', resvgErr);
    }

    const cleanReg = String(m.regNumber || m.memberId || 'Member').replace(/[^a-zA-Z0-9_-]/g, '');
    const cardFilename = `TechVerse-Official-ID-Card-${cleanReg}.png`;

    const attachments = [];

    if (cardPngBuffer) {
      // 1. Inline ID Card image (displays inside the separate ID Card frame)
      attachments.push({
        filename: cardFilename,
        content: cardPngBuffer,
        cid: 'idCardInline',
        contentType: 'image/png',
      });
      // 2. Explicit downloadable attachment (so email clients show the download card/button)
      attachments.push({
        filename: cardFilename,
        content: cardPngBuffer,
        contentType: 'image/png',
        contentDisposition: 'attachment',
      });
    }

    // Email Header & Letter Content
    const heroBannerHtml = isPromotion ? `
    <!-- PROMOTION HERO BANNER -->
    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
      <span style="display: inline-block; background: rgba(250,204,21,0.25); border: 1px solid #facc15; color: #fef08a; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Leadership Promotion • Career Elevation</span>
      <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(m.name)}, You Have Been Promoted</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0e7ff; line-height: 1.5;">
        In recognition of your outstanding leadership and contributions to TechVerse, you have officially been elevated to <strong>${escapeHtml(m.designation || 'Club Leader')}</strong> (${escapeHtml(m.roleAssignee || 'President and Committee Members of the Club')}).
      </p>
    </div>
    ` : `
    <!-- CONGRATULATIONS HERO BANNER -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
      <span style="display: inline-block; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Selection Confirmed • Screening Approved</span>
      <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(m.name)}, Your Appointment is Confirmed</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your screening is complete. The President and Club Committee Members have confirmed your official designation as <strong>${escapeHtml(m.designation || 'Club Member')}</strong> (${escapeHtml(m.roleAssignee || 'Core Team Member')}). Welcome to the TechVerse family.</p>
    </div>
    `;

    const letterBodyHtml = isPromotion ? `
    <!-- CURATED PROMOTION CITATION -->
    <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border-left: 4px solid #eab308; border-radius: 0 12px 12px 0; padding: 18px; margin: 0 0 24px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #854d0e; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        Executive Leadership Citation &amp; Promotion Announcement
      </h4>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #713f12; line-height: 1.6;">
        Dear <strong>${escapeHtml(m.name)}</strong>, on behalf of the President and Committee Members of the Club (<strong>TechVerse Club • School of Engineering &amp; Technology, CT University</strong>), we proudly commend your exemplary dedication and technical excellence. You have consistently demonstrated outstanding drive, teamwork, and leadership.
      </p>
      <div style="background: #ffffff; border-radius: 8px; padding: 10px 14px; border: 1px solid #fde047; font-size: 12px; color: #713f12;">
        <span style="color: #64748b;">Previous Designation:</span> <strong style="text-decoration: line-through; color: #64748b;">${escapeHtml(m.previousDesignation || 'Member')}</strong> &nbsp;&nbsp;➔&nbsp;&nbsp; 
        <span style="color: #b45309; font-weight: bold;">New Elevated Designation:</span> <span style="background: #fef08a; color: #854d0e; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${escapeHtml(m.designation)}</span>
      </div>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #854d0e; line-height: 1.5;">
        Your official <strong>TechVerse Leadership &amp; Membership Card</strong> has been generated below as a standalone printable badge. A print-ready, high-resolution PNG file (<code style="color: #854d0e;">${cardFilename}</code>) is also attached to this email for physical lanyard printing.
      </p>
    </div>
    ` : `
    <!-- WELCOME LETTER -->
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 12px 12px 0; padding: 18px; margin: 0 0 24px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1e40af; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        Welcome to TechVerse Club, CT University
      </h4>
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
        Dear <strong>${escapeHtml(m.name)}</strong>, the screening committee has approved your application. You have officially been appointed as <strong>${escapeHtml(m.designation || 'Active Member')}</strong> (${escapeHtml(m.roleAssignee || 'Core Team')}).
      </p>
      <p style="margin: 0; font-size: 12px; color: #1e40af; line-height: 1.5;">
        Your verified <strong>Digital Club Membership Card</strong> has been generated below as a standalone printable badge. A print-ready lossless PNG file (<code style="color: #1e40af;">${cardFilename}</code>) is attached below for instant download and lamination.
      </p>
    </div>
    `;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isPromotion ? 'Official Leadership Promotion - TechVerse Club' : 'Official TechVerse Club Membership Card'}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 660px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 45px rgba(0,0,0,0.45); border: 2px solid ${isPromotion ? '#f59e0b' : '#3b82f6'};">
    
    ${heroBannerHtml}

    <div style="padding: 26px 22px;">
      ${letterBodyHtml}

      <!-- SEPARATE STANDALONE ID CARD SECTION DIVIDER -->
      <div style="text-align: center; margin: 30px 0 16px 0;">
        <span style="display: inline-block; background: ${isPromotion ? 'rgba(245,158,11,0.12)' : 'rgba(37,99,235,0.1)'}; border: 1.5px solid ${isPromotion ? '#f59e0b' : '#2563eb'}; color: ${isPromotion ? '#92400e' : '#1e40af'}; font-size: 11px; font-weight: 800; padding: 6px 18px; border-radius: 24px; text-transform: uppercase; letter-spacing: 2px;">
          OFFICIAL DIGITAL IDENTITY CARD (STANDALONE BADGE)
        </span>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
          Standard CR80 / Lanyard Badge Specification • Valid University-Wide
        </p>
      </div>

      <!-- STANDALONE ID CARD CONTAINER -->
      <div style="background: #090d16; border-radius: 28px; padding: 24px 16px; margin: 12px auto; max-width: 480px; text-align: center; box-shadow: inset 0 2px 10px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #1e293b;">
        <!-- Lanyard Slot Graphical Indicator -->
        <div style="width: 70px; height: 12px; background: #1e293b; border-radius: 6px; margin: 0 auto 16px auto; border: 2px solid #334155;"></div>

        <!-- The Separate Standalone ID Card Image -->
        ${cardPngBuffer ? `
          <img src="cid:idCardInline" alt="TechVerse Official ID Card" style="width: 100%; max-width: 440px; height: auto; display: block; margin: 0 auto; border-radius: 22px; box-shadow: 0 12px 30px rgba(0,0,0,0.8); border: 2px solid ${isPromotion ? '#f59e0b' : '#38bdf8'};" />
        ` : `
          <p style="color: #94a3b8; font-size: 13px;">[ID Card Graphic Generated in Attached File]</p>
        `}

        <!-- Download Badge Notice -->
        <div style="margin-top: 18px; padding: 14px 16px; background: #111827; border-radius: 14px; border: 1px solid #374151; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #f8fafc; margin-bottom: 4px;">
            Print-Ready ID Card File Attached (.PNG)
          </div>
          <div style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
            The original high-resolution card (<strong style="color: ${isPromotion ? '#fbbf24' : '#38bdf8'};">${cardFilename}</strong>) is attached below.<br/>
            You can download it directly from this email to print on PVC ID card material or 300 GSM photo paper.
          </div>
        </div>
      </div>

      <div style="margin-top: 24px; padding: 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
        <strong>University Protocol:</strong> This credential certifies active club membership &amp; leadership in the School of Engineering &amp; Technology, CT University. For inquiries or replacement, email <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a>.
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6;">
      <div style="margin-bottom: 6px;">
        <img src="${techverseLogoUrl}" alt="TechVerse" width="22" height="22" style="vertical-align: middle; border-radius: 50%; border: 1px solid #cbd5e1; display: inline-block;" />
      </div>
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">TechVerse Club • School of Engineering &amp; Technology</p>
      <p style="margin: 0; font-size: 10px;">CT University, Ferozepur Road, Ludhiana, Punjab - 142024</p>
      <p style="margin: 6px 0 0 0; font-size: 10px; color: #94a3b8;">Email: <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a> • Official Membership Credential</p>
    </div>
  </div>
</body>
</html>
    `;

    const emailSubject = isPromotion
      ? `Official Promotion Announced - Congratulations ${m.name} on Becoming ${m.designation || 'Club Leader'} | TechVerse Club`
      : `Official TechVerse Club Membership Credential Issued - ${m.name} (${m.designation || 'Active Member'})`;

    const info = await transporter.sendMail({
      from: `"TechVerse Club • CT University" <${emailUser}>`,
      to: cleanRecipient,
      replyTo: emailUser,
      subject: emailSubject,
      html: emailHtml,
      attachments,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      cardAttached: Boolean(cardPngBuffer),
      cardFilename,
      message: isPromotion
        ? `Official Promotion Announcement & Standalone ID Card (.png) dispatched to ${cleanRecipient}`
        : `Official Standalone ID Card (.png) dispatched to ${cleanRecipient}`,
    });
  } catch (err) {
    console.error('Relay error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch email',
    });
  }
}
