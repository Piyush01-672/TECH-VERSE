import nodemailer from 'nodemailer';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

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
    if (fs.existsSync(p)) {
      try {
        const buf = fs.readFileSync(p);
        const mime = getMimeType(buf);
        return `data:${mime};base64,${buf.toString('base64')}`;
      } catch (_) {}
    }
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

function generateIdCardSvg(m, options = {}) {
  const isPromotion = Boolean(options.isPromotion);
  const univLogoBase64 = options.univLogoBase64 || '';
  const techverseLogoBase64 = options.techverseLogoBase64 || '';
  const soetLogoBase64 = options.soetLogoBase64 || '';
  const photoBase64 = options.photoBase64 || null;

  const name = (m.name || 'Club Member').toUpperCase();
  const regNumber = m.regNumber || 'N/A';
  const memberId = m.memberId || `TV-${new Date().getFullYear()}-${String(m.serialNumber || '1').padStart(4, '0')}`;
  const serial = `#${m.serialNumber || '1'}`;
  const department = (m.department === 'btech' ? 'B.Tech (SOET)' : (m.department === 'bca' ? 'BCA (SOET)' : String(m.department || 'B.Tech').toUpperCase()));
  const batch = m.batch || '2024-2028';
  const designation = m.designation || (isPromotion ? 'Club Leader' : 'Active Member');
  const roleAssignee = m.roleAssignee || (isPromotion ? 'Executive Board' : 'Core Team Member');
  const residence = m.residenceType || 'Day Scholar';
  const contact = m.contact || 'N/A';

  const borderColor = isPromotion ? '#f59e0b' : '#3b82f6';
  const accentGradientStart = isPromotion ? '#1e1b4b' : '#0f172a';
  const accentGradientMid = isPromotion ? '#312e81' : '#1e3a8a';
  const accentGradientEnd = isPromotion ? '#1e3a8a' : '#0284c7';
  const badgeTitle = isPromotion ? 'EXECUTIVE LEADERSHIP CREDENTIAL' : 'OFFICIAL CLUB IDENTITY CARD';
  const badgeSubtitle = isPromotion ? '🎖️ PROMOTED LEADER' : 'VERIFIED CLUB MEMBER';

  let photoElement = '';
  if (photoBase64) {
    photoElement = `<image href="${photoBase64}" x="50" y="240" width="200" height="240" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>`;
  } else {
    const initial = name.charAt(0) || 'M';
    photoElement = `
      <rect x="50" y="240" width="200" height="240" rx="20" fill="#1e293b" stroke="${borderColor}" stroke-width="2"/>
      <circle cx="150" cy="340" r="60" fill="${isPromotion ? '#312e81' : '#1e3a8a'}" opacity="0.6"/>
      <text x="150" y="375" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="75" font-weight="900" fill="${borderColor}" text-anchor="middle">${initial}</text>
    `;
  }

  let barcodeLines = '';
  const seedString = `${regNumber}${memberId}TECHVERSE`;
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
      <rect x="50" y="240" width="200" height="240" rx="20" />
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

    <text x="350" y="156" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">CT UNIVERSITY</text>
    <text x="350" y="176" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="800" fill="#cbd5e1" text-anchor="middle" letter-spacing="2">SCHOOL OF ENGINEERING &amp; TECHNOLOGY • TECHVERSE CLUB</text>

    <rect x="40" y="202" width="620" height="28" rx="8" fill="${isPromotion ? '#fef3c7' : '#eff6ff'}" stroke="${borderColor}" stroke-width="1.5"/>
    <text x="350" y="221" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="900" fill="${isPromotion ? '#92400e' : '#1e40af'}" text-anchor="middle" letter-spacing="2">${badgeTitle}</text>

    <rect x="48" y="238" width="204" height="244" rx="22" fill="none" stroke="${borderColor}" stroke-width="4"/>
    ${photoElement}

    <rect x="48" y="492" width="204" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="150" y="510" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="800" fill="#64748b" text-anchor="middle" letter-spacing="1">MEMBER ID</text>
    <text x="150" y="531" font-family="monospace, 'Courier New'" font-size="14" font-weight="900" fill="#0f172a" text-anchor="middle">${memberId}</text>

    <rect x="48" y="550" width="204" height="30" rx="8" fill="${isPromotion ? '#fef9c3' : '#ecfdf5'}" stroke="${isPromotion ? '#fde047' : '#a7f3d0'}" stroke-width="1.5"/>
    <text x="150" y="570" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="900" fill="${isPromotion ? '#854d0e' : '#059669'}" text-anchor="middle">${badgeSubtitle}</text>
    <text x="150" y="602" font-family="monospace, 'Courier New'" font-size="12" font-weight="700" fill="#2563eb" text-anchor="middle">Official Serial ${serial}</text>

    <g transform="translate(280, 238)">
      <text x="0" y="18" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1.5">FULL NAME</text>
      <text x="0" y="46" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="23" font-weight="900" fill="#0f172a">${name}</text>
      <line x1="0" y1="58" x2="375" y2="58" stroke="#e2e8f0" stroke-width="1.5"/>

      <text x="0" y="80" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">REGISTRATION NO.</text>
      <text x="0" y="103" font-family="monospace, 'Courier New'" font-size="18" font-weight="900" fill="#1e40af">${regNumber}</text>

      <text x="0" y="130" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">DEPARTMENT &amp; BATCH</text>
      <text x="0" y="150" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#1e293b">${department} • ${batch}</text>

      <text x="0" y="180" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">OFFICIAL CLUB DESIGNATION</text>
      <rect x="0" y="188" width="375" height="34" rx="8" fill="${isPromotion ? '#fef3c7' : '#f0fdf4'}" stroke="${borderColor}" stroke-width="2"/>
      <text x="14" y="211" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="900" fill="${isPromotion ? '#92400e' : '#166534'}">${isPromotion ? '🎖️ ' : ''}${designation}${isPromotion ? ' (PROMOTED)' : ''}</text>

      <text x="0" y="246" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">ROLE ASSIGNEE / DIVISION</text>
      <rect x="0" y="254" width="375" height="28" rx="6" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="14" y="273" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="800" fill="#1e40af">${roleAssignee}</text>

      <text x="0" y="304" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">RESIDENCE TYPE</text>
      <text x="0" y="322" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#334155">${residence}</text>

      <text x="190" y="304" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="800" fill="#64748b" letter-spacing="1">CONTACT NUMBER</text>
      <text x="190" y="322" font-family="monospace, 'Courier New'" font-size="13" font-weight="700" fill="#334155">${contact}</text>
    </g>

    <line x1="45" y1="630" x2="655" y2="630" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6,4"/>

    <g transform="translate(48, 646)">
      <rect x="0" y="0" width="375" height="64" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="16" y="22" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="900" fill="#0f172a" letter-spacing="1">VERIFIED UNIVERSITY CREDENTIAL</text>
      <text x="16" y="38" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" fill="#64748b">Recognized for University Symposiums, Hackathons &amp; Events</text>
      <text x="16" y="52" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="700" fill="#059669">✓ Cryptographically Logged • Academic Session ${batch}</text>

      <g transform="translate(415, -2)">
        <text x="95" y="40" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-size="25" fill="#1e3a8a" text-anchor="middle">TechVerse CTU</text>
        <line x1="0" y1="48" x2="190" y2="48" stroke="#0f172a" stroke-width="1.5"/>
        <text x="95" y="62" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="800" fill="#475569" text-anchor="middle" letter-spacing="0.5">AUTHORIZED SIGNATORY</text>
      </g>
    </g>

    <g transform="translate(45, 730)">
      <rect x="0" y="0" width="610" height="92" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      ${barcodeLines}
      <text x="305" y="78" font-family="monospace, 'Courier New'" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="4">* ${memberId} • REG-${regNumber} *</text>
    </g>

    <rect x="0" y="850" width="700" height="210" fill="#0f172a"/>
    <line x1="0" y1="850" x2="700" y2="850" stroke="${borderColor}" stroke-width="3"/>

    <text x="350" y="885" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="800" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">TECHVERSE CLUB • SCHOOL OF ENGINEERING &amp; TECHNOLOGY</text>
    <text x="350" y="906" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">CT University, Ferozepur Road, Ludhiana, Punjab - 142024</text>
    <text x="350" y="927" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Inquiries: techverse@ctuniversity.in • https://techversectu.vercel.app</text>
    <text x="350" y="952" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="700" fill="${borderColor}" text-anchor="middle" letter-spacing="1">PROPERTY OF TECHVERSE CLUB • IF FOUND, PLEASE RETURN TO SOET OFFICE</text>
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

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TechVerse Club Application Received</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 2px solid #3b82f6;">
    
    <!-- HEADER BRANDING -->
    <tr>
      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 24px 20px; text-align: center; color: #ffffff;">
        <span style="display: inline-block; background: rgba(56,189,248,0.15); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">Application Acknowledgment</span>
        <h1 style="margin: 4px 0 8px 0; font-size: 22px; font-weight: 800; color: #ffffff;">Application Received! Welcome to Screening 🚀</h1>
        <p style="margin: 0; font-size: 13px; color: #94a3b8;">TechVerse Club • School of Engineering & Technology, CT University</p>
      </td>
    </tr>

    <!-- LOGOS RIBBON -->
    <tr>
      <td style="background: #f8fafc; padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="${univLogoUrl}" alt="CT University" style="max-height: 48px; max-width: 80px; object-fit: contain;" />
            </td>
            <td align="center" width="40%" style="vertical-align: middle;">
              <img src="${techverseLogoUrl}" alt="TechVerse Club" style="max-height: 55px; max-width: 55px; border-radius: 50%; border: 2px solid #2563eb; object-fit: cover;" />
            </td>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="${soetLogoUrl}" alt="SOET" style="max-height: 48px; max-width: 80px; object-fit: contain;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding: 28px 24px;">
        <p style="font-size: 15px; margin: 0 0 16px 0; color: #0f172a; line-height: 1.6;">
          Dear <strong>${escapeHtml(m.name)}</strong>,
        </p>

        <p style="font-size: 14px; margin: 0 0 16px 0; color: #334155; line-height: 1.6;">
          Thank you for showing interest in joining <strong>TechVerse Club</strong>! Your membership application has been registered successfully and is currently under our official <strong>Screening &amp; Audition Process</strong>.
        </p>

        <!-- APPLICATION SUMMARY CARD -->
        <div style="background: #f1f5f9; border-radius: 12px; border: 1px solid #cbd5e1; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; font-weight: 800;">
            📋 Application Summary
          </h3>
          <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13px;">
            <tr>
              <td width="42%" style="color: #64748b; font-weight: 600;">Application / Member ID:</td>
              <td style="color: #0f172a; font-weight: 800; font-family: monospace;">${escapeHtml(m.memberId || '')}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Application Serial No.:</td>
              <td style="color: #1e40af; font-weight: 800; font-family: monospace;">#${m.serialNumber || '1'}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Registration No.:</td>
              <td style="color: #0f172a; font-weight: 700; font-family: monospace;">${escapeHtml(m.regNumber || '')}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Department &amp; Batch:</td>
              <td style="color: #0f172a;">${escapeHtml(departmentDisplay)} (${escapeHtml(m.batch || '')})</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Primary Interests:</td>
              <td style="color: #2563eb; font-weight: 600;">${escapeHtml(interestsList)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Current Status:</td>
              <td>
                <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px;">
                  ⏳ Under Screening Process
                </span>
              </td>
            </tr>
          </table>
        </div>

        <h4 style="font-size: 14px; margin: 20px 0 8px 0; color: #0f172a;">What happens next?</h4>
        <ul style="font-size: 13px; color: #475569; padding-left: 20px; line-height: 1.7; margin: 0 0 20px 0;">
          <li>The <strong>President</strong> and <strong>Vice President</strong> of TechVerse Club will review your academic discipline, technical interests, and project ambitions.</li>
          <li>Once evaluated, an official club designation (e.g. <em>Web Architect, AI/ML Lead, Event Coordinator, Core Member</em>) will be assigned to your profile in the Admin Portal.</li>
          <li>Upon role assignment, your verified <strong>TechVerse Club Membership ID Card</strong> will be issued and emailed to you automatically!</li>
        </ul>

        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 10px 10px 0; padding: 14px 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #15803d; font-weight: 700;">🪪 Official Membership Card Dispatch</h4>
          <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
            As soon as your club designation is assigned by the administration in the portal, your official verified <strong>TechVerse Club Membership Card</strong> will be automatically generated and delivered directly to this email address.
          </p>
        </div>

        <p style="font-size: 14px; margin: 24px 0 4px 0; color: #334155; line-height: 1.6;">
          Warm regards,<br />
          <strong>President &amp; Vice President</strong><br />
          TechVerse Club • School of Engineering &amp; Technology<br />
          CT University, Ludhiana, Punjab
        </p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background: #f8fafc; padding: 14px 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
        <p style="margin: 0 0 4px 0;">Official Screening Notification • TechVerse Club</p>
        <p style="margin: 0;">Email: <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a></p>
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
        subject: `🚀 TechVerse Club Application Received - Welcome to Screening, ${m.name}! (App #${m.serialNumber || '1'})`,
        html: htmlContent,
      });

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
        message: `Screening email sent to ${cleanRecipient}`,
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
      const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1400 } });
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
      <span style="display: inline-block; background: rgba(250,204,21,0.25); border: 1px solid #facc15; color: #fef08a; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">🎖️ Official Leadership Promotion • Career Elevation</span>
      <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(m.name)}, You've Been Promoted! 🚀</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0e7ff; line-height: 1.5;">
        In recognition of your outstanding leadership and contributions to TechVerse, you have officially been elevated to <strong>${escapeHtml(m.designation || 'Club Leader')}</strong> (${escapeHtml(m.roleAssignee || 'Executive Board')}).
      </p>
    </div>
    ` : `
    <!-- CONGRATULATIONS HERO BANNER -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
      <span style="display: inline-block; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Selection Confirmed • Screening Approved</span>
      <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(m.name)}, You're Selected! 🎉</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your screening is complete. The President &amp; Vice President have confirmed your official designation as <strong>${escapeHtml(m.designation || 'Club Member')}</strong> (${escapeHtml(m.roleAssignee || 'Core Team Member')}). Welcome to the TechVerse family!</p>
    </div>
    `;

    const letterBodyHtml = isPromotion ? `
    <!-- CURATED PROMOTION CITATION -->
    <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border-left: 4px solid #eab308; border-radius: 0 12px 12px 0; padding: 18px; margin: 0 0 24px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #854d0e; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        🌟 Executive Leadership Citation &amp; Promotion Announcement
      </h4>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #713f12; line-height: 1.6;">
        Dear <strong>${escapeHtml(m.name)}</strong>, on behalf of the President, Vice President, and Faculty Advisors of <strong>TechVerse Club • School of Engineering &amp; Technology, CT University</strong>, we proudly commend your exemplary dedication and technical excellence. You have consistently demonstrated outstanding drive, teamwork, and leadership.
      </p>
      <div style="background: #ffffff; border-radius: 8px; padding: 10px 14px; border: 1px solid #fde047; font-size: 12px; color: #713f12;">
        <span style="color: #64748b;">Previous Designation:</span> <strong style="text-decoration: line-through; color: #64748b;">${escapeHtml(m.previousDesignation || 'Member')}</strong> &nbsp;&nbsp;➔&nbsp;&nbsp; 
        <span style="color: #b45309; font-weight: bold;">New Elevated Designation:</span> <span style="background: #fef08a; color: #854d0e; font-weight: 800; padding: 2px 8px; border-radius: 4px;">🎖️ ${escapeHtml(m.designation)}</span>
      </div>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #854d0e; line-height: 1.5;">
        Your official <strong>TechVerse Leadership &amp; Membership Card</strong> has been generated below as a standalone printable badge. A print-ready, high-resolution PNG file (<code style="color: #854d0e;">${cardFilename}</code>) is also attached to this email for physical lanyard printing.
      </p>
    </div>
    ` : `
    <!-- WELCOME LETTER -->
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 12px 12px 0; padding: 18px; margin: 0 0 24px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1e40af; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        🎉 Welcome to TechVerse Club, CT University!
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
          🪪 OFFICIAL DIGITAL IDENTITY CARD (STANDALONE BADGE)
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
            📥 Print-Ready ID Card File Attached (.PNG)
          </div>
          <div style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
            The original high-resolution card (<strong style="color: ${isPromotion ? '#fbbf24' : '#38bdf8'};">${cardFilename}</strong>) is attached below.<br/>
            You can download it directly from this email to print on PVC ID card material or 300 GSM photo paper.
          </div>
        </div>
      </div>

      <div style="margin-top: 24px; padding: 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
        ℹ️ <strong>University Protocol:</strong> This credential certifies active club membership &amp; leadership in the School of Engineering &amp; Technology, CT University. For inquiries or replacement, email <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a>.
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">TechVerse Club • School of Engineering &amp; Technology</p>
      <p style="margin: 0; font-size: 10px;">CT University, Ferozepur Road, Ludhiana, Punjab - 142024</p>
      <p style="margin: 6px 0 0 0; font-size: 10px; color: #94a3b8;">Email: <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a> • Official Membership Credential</p>
    </div>
  </div>
</body>
</html>
    `;

    const emailSubject = isPromotion
      ? `🎖️ Official Promotion Announced - Congratulations ${m.name} on Becoming ${m.designation || 'Club Leader'}! | TechVerse Club`
      : `🎉 Official TechVerse Club Membership Card Issued - ${m.name} (${m.designation || 'Active Member'})`;

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
