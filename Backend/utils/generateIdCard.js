const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

function getMimeType(buf) {
  if (!buf || buf.length < 4) return 'image/png';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf[0] === 0x3c) return 'image/svg+xml';
  return 'image/png';
}

function getBase64Image(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      const mime = getMimeType(buf);
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  } catch (e) {
    console.error('Error reading file:', filePath, e.message);
  }
  return '';
}

function generateIdCardSvg(m, options = {}) {
  const isPromotion = Boolean(options.isPromotion);
  const univLogoBase64 = options.univLogoBase64 || getBase64Image(path.join(__dirname, '../../Frontend/public/univeee-logo.png'));
  const techverseLogoBase64 = options.techverseLogoBase64 || getBase64Image(path.join(__dirname, '../../Frontend/public/techverse-logo.jpg'));
  const soetLogoBase64 = options.soetLogoBase64 || getBase64Image(path.join(__dirname, '../../Frontend/public/soet-logo.png'));
  const photoBase64 = options.photoBase64 || (m.photo && m.photo.startsWith('data:') ? m.photo : null);

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
    photoElement = `<image href="${photoBase64}" x="50" y="240" width="200" height="280" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>`;
  } else {
    const initial = name.charAt(0) || 'M';
    photoElement = `
      <rect x="50" y="240" width="200" height="280" rx="20" fill="#1e293b" stroke="${borderColor}" stroke-width="2"/>
      <circle cx="150" cy="370" r="70" fill="${isPromotion ? '#312e81' : '#1e3a8a'}" opacity="0.6"/>
      <text x="150" y="405" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="85" font-weight="900" fill="${borderColor}" text-anchor="middle">${initial}</text>
    `;
  }

  let barcodeLines = '';
  const seedString = `${regNumber}TECHVERSE`;
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

    <text x="350" y="156" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">CT UNIVERSITY</text>
    <text x="350" y="176" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="800" fill="#cbd5e1" text-anchor="middle" letter-spacing="2">SCHOOL OF ENGINEERING &amp; TECHNOLOGY • TECHVERSE CLUB</text>

    <rect x="40" y="202" width="620" height="28" rx="8" fill="${isPromotion ? '#fef3c7' : '#eff6ff'}" stroke="${borderColor}" stroke-width="1.5"/>
    <text x="350" y="221" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="900" fill="${isPromotion ? '#92400e' : '#1e40af'}" text-anchor="middle" letter-spacing="2">${badgeTitle}</text>

    <!-- PHOTO BOX (Balanced & Clean) -->
    <rect x="48" y="238" width="204" height="284" rx="22" fill="none" stroke="${borderColor}" stroke-width="4"/>
    ${photoElement}

    <!-- Security Chip / Official Authenticity Seal Under Photo -->
    <g transform="translate(48, 542)">
      <rect x="0" y="0" width="204" height="66" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <circle cx="28" cy="33" r="16" fill="${isPromotion ? '#fef3c7' : '#eff6ff'}" stroke="${borderColor}" stroke-width="2"/>
      <text x="28" y="38" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="900" fill="${borderColor}" text-anchor="middle">★</text>
      <text x="56" y="28" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="900" fill="#0f172a" letter-spacing="1">AUTHENTIC CREDENTIAL</text>
      <text x="56" y="45" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b">CT UNIVERSITY • SOET</text>
    </g>

    <!-- RIGHT SIDE MEMBER DETAILS -->
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

    <!-- CLEAN BARCODE SECTION (Without MemberId / Serial) -->
    <g transform="translate(45, 730)">
      <rect x="0" y="0" width="610" height="92" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      ${barcodeLines}
      <text x="305" y="78" font-family="monospace, 'Courier New'" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="4">* REG-${regNumber} • TECHVERSE • CT UNIVERSITY *</text>
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

function generateIdCardPng(m, options = {}) {
  try {
    const svg = generateIdCardSvg(m, options);
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1400 } });
    const pngData = resvg.render();
    return pngData.asPng();
  } catch (err) {
    console.error('generateIdCardPng error:', err);
    return null;
  }
}

module.exports = {
  generateIdCardSvg,
  generateIdCardPng,
};
