const path = require('path');
const fs = require('fs');
const dns = require('dns');
const nodemailer = require('nodemailer');
const ClubMember = require('../models/ClubMember');
const UnderScreeningMember = require('../models/UnderScreeningMember');

async function callVercelRelay(type, member) {
  const relayUrl = process.env.EMAIL_RELAY_URL || 'https://techversectu.vercel.app/api/send-email';
  console.log(`📡 Attempting email dispatch via Vercel relay (${type}) to ${member?.email}...`);
  try {
    if (typeof fetch === 'function') {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(relayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, member }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        console.log(`✅ Email dispatched successfully via Vercel relay! Message ID:`, json.messageId || 'ok');
        return true;
      }
      const errTxt = await res.text().catch(() => '');
      console.warn(`⚠️ Vercel relay HTTP ${res.status}: ${errTxt}`);
      return false;
    }
  } catch (err) {
    console.warn(`⚠️ Vercel relay attempt error:`, err.message);
  }
  return false;
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

function getTransporter() {
  const emailPass = process.env.EMAIL_PASS ? String(process.env.EMAIL_PASS).replace(/\s+/g, '').trim() : '';
  const emailUser = (process.env.EMAIL_USER ? String(process.env.EMAIL_USER).trim() : '') || 'techverse@ctuniversity.in';

  if (!emailPass) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      // Socket-level DNS resolver enforcing IPv4 resolution on Render cloud containers
      lookup: (hostname, options, callback) => {
        return dns.lookup(hostname, Object.assign({}, options, { family: 4 }), callback);
      },
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    }),
    emailUser,
    emailPass,
  };
}

/**
 * Stage 1: Send Screening Process Acknowledgment Email
 * Triggered automatically when student submits the New Member Application.
 */
async function sendScreeningEmail(member) {
  // First attempt: Vercel serverless relay over HTTPS (works without SMTP port block)
  try {
    const relayOk = await callVercelRelay('screening', member);
    if (relayOk) return true;
  } catch (relayErr) {
    console.warn('Screening relay attempt failed:', relayErr.message);
  }

  const transportConfig = getTransporter();
  if (!transportConfig) {
    console.log(`ℹ️ EMAIL_PASS not set. Screening email queued for ${member.email}`);
    return false;
  }

  const { transporter, emailUser, emailPass } = transportConfig;
  const recipientEmail = String(member.email).trim().toLowerCase();

  const departmentDisplay = member.department === 'btech'
    ? 'B.Tech (School of Engineering & Technology)'
    : (member.department === 'bca' ? 'BCA (School of Engineering & Technology)' : String(member.department).toUpperCase());
  const interestsList = Array.isArray(member.interests) ? member.interests.join(', ') : (member.interests || 'Technology & Innovation');

  // Prepare attachments for the 3 logos
  const attachments = [];
  const assetsDir = path.join(__dirname, '../assets');
  const univLogoPath = path.join(assetsDir, 'univeee-logo.png');
  const techverseLogoPath = path.join(assetsDir, 'techverse-logo.jpg');
  const soetLogoPath = path.join(assetsDir, 'soet-logo.png');

  if (fs.existsSync(univLogoPath)) attachments.push({ filename: 'univeee-logo.png', path: univLogoPath, cid: 'univLogo' });
  if (fs.existsSync(techverseLogoPath)) attachments.push({ filename: 'techverse-logo.jpg', path: techverseLogoPath, cid: 'techverseLogo' });
  if (fs.existsSync(soetLogoPath)) attachments.push({ filename: 'soet-logo.png', path: soetLogoPath, cid: 'soetLogo' });

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
              <img src="cid:univLogo" alt="CT University" style="max-height: 48px; max-width: 80px; object-fit: contain;" />
            </td>
            <td align="center" width="40%" style="vertical-align: middle;">
              <img src="cid:techverseLogo" alt="TechVerse Club" style="max-height: 55px; max-width: 55px; border-radius: 50%; border: 2px solid #2563eb; object-fit: cover;" />
            </td>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="cid:soetLogo" alt="SOET" style="max-height: 48px; max-width: 80px; object-fit: contain;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding: 28px 24px;">
        <p style="font-size: 15px; margin: 0 0 16px 0; color: #0f172a; line-height: 1.6;">
          Dear <strong>${escapeHtml(member.name)}</strong>,
        </p>

        <p style="font-size: 14px; margin: 0 0 16px 0; color: #334155; line-height: 1.6;">
          Thank you for showing interest in joining <strong>TechVerse Club</strong>! Your membership application has been registered successfully and is currently under our official <strong>Screening & Audition Process</strong>.
        </p>

        <!-- APPLICATION SUMMARY CARD -->
        <div style="background: #f1f5f9; border-radius: 12px; border: 1px solid #cbd5e1; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; font-weight: 800;">
            📋 Application Summary
          </h3>
          <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13px;">
            <tr>
              <td width="42%" style="color: #64748b; font-weight: 600;">Application / Member ID:</td>
              <td style="color: #0f172a; font-weight: 800; font-family: monospace;">${escapeHtml(member.memberId)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">MongoDB Serial No.:</td>
              <td style="color: #1e40af; font-weight: 800; font-family: monospace;">#${member.serialNumber || '1'}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Registration No.:</td>
              <td style="color: #0f172a; font-weight: 700; font-family: monospace;">${escapeHtml(member.regNumber)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Department & Batch:</td>
              <td style="color: #0f172a;">${escapeHtml(departmentDisplay)} (${escapeHtml(member.batch)})</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Residence Type:</td>
              <td style="color: #0f172a;">${escapeHtml(member.residenceType || 'Day Scholar')}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Domains / Interests:</td>
              <td style="color: #2563eb; font-weight: 600;">${escapeHtml(interestsList)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Current Status:</td>
              <td>
                <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
                  ⏳ Under Screening Process
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- WHAT HAPPENS NEXT -->
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 14px 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #1e40af; font-weight: 700;">🔍 What Happens Next?</h4>
          <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
            The <strong>President & Vice President</strong> along with the core technical panel of TechVerse are reviewing applicant profiles. You will soon be assigned your official <strong>Club Designation</strong> and <strong>Role Assignee</strong>.
          </p>
        </div>

        <!-- MEMBER CARD PROMISE -->
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 10px 10px 0; padding: 14px 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #15803d; font-weight: 700;">🪪 Official Membership Card Dispatch</h4>
          <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
            As soon as your club designation is assigned by the administration in the portal, your official verified <strong>TechVerse Club Membership Card</strong> will be automatically generated and delivered directly to this email address.
          </p>
        </div>

        <p style="font-size: 14px; margin: 24px 0 4px 0; color: #334155; line-height: 1.6;">
          Warm regards,<br />
          <strong>President & Vice President</strong><br />
          TechVerse Club • School of Engineering & Technology<br />
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

  const mailOptions = {
    from: `"TechVerse Club • CT University" <${emailUser}>`,
    to: recipientEmail,
    replyTo: emailUser,
    subject: `🚀 TechVerse Club Application Received - Welcome to Screening, ${member.name}! (App #${member.serialNumber || '1'})`,
    html: htmlContent,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Screening acknowledgment email dispatched to ${recipientEmail}`);
    return true;
  } catch (err) {
    console.error('Primary transporter error (port 465):', err.message);
    // Fallback to Port 587 IPv4
    try {
      console.log('🔄 Attempting fallback transporter via service: gmail...');
      const fallbackTransporter = nodemailer.createTransport({
        service: 'gmail',
        lookup: (hostname, options, callback) => {
          return dns.lookup(hostname, Object.assign({}, options, { family: 4 }), callback);
        },
        auth: { user: emailUser, pass: emailPass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
      });
      await fallbackTransporter.sendMail(mailOptions);
      console.log(`✅ Screening email dispatched via port 587 fallback to ${recipientEmail}`);
      return true;
    } catch (fallbackErr) {
      console.error('❌ Fallback transporter also failed:', fallbackErr.message);
      throw fallbackErr;
    }
  }
}

/**
 * Stage 2: Send Official Verified Membership Card Email
 * Triggered ONLY when Admin/President/VP sets the designation from the /admin portal.
 */
async function sendMembershipCardEmail(member) {
  // First attempt: Vercel serverless relay over HTTPS (works without SMTP port block)
  try {
    const relayOk = await callVercelRelay('card', member);
    if (relayOk) return true;
  } catch (relayErr) {
    console.warn('Membership card relay attempt failed:', relayErr.message);
  }

  const transportConfig = getTransporter();
  if (!transportConfig) {
    console.log(`ℹ️ EMAIL_PASS not set. Membership Card email queued for ${member.email}`);
    return false;
  }

  const { transporter, emailUser, emailPass } = transportConfig;
  const recipientEmail = String(member.email).trim().toLowerCase();

  const departmentDisplay = member.department === 'btech'
    ? 'B.Tech (School of Engineering & Technology)'
    : (member.department === 'bca' ? 'BCA (School of Engineering & Technology)' : String(member.department).toUpperCase());
  const interestsList = Array.isArray(member.interests) ? member.interests.join(', ') : (member.interests || 'Technology & Innovation');

  // Prepare attachments for the 3 logos
  const attachments = [];
  const assetsDir = path.join(__dirname, '../assets');
  const univLogoPath = path.join(assetsDir, 'univeee-logo.png');
  const techverseLogoPath = path.join(assetsDir, 'techverse-logo.jpg');
  const soetLogoPath = path.join(assetsDir, 'soet-logo.png');

  if (fs.existsSync(univLogoPath)) attachments.push({ filename: 'univeee-logo.png', path: univLogoPath, cid: 'univLogo' });
  if (fs.existsSync(techverseLogoPath)) attachments.push({ filename: 'techverse-logo.jpg', path: techverseLogoPath, cid: 'techverseLogo' });
  if (fs.existsSync(soetLogoPath)) attachments.push({ filename: 'soet-logo.png', path: soetLogoPath, cid: 'soetLogo' });

  // Photo attachment handling
  let photoHtml = '';
  let hasPhotoAttachment = false;

  if (member.photo && typeof member.photo === 'string') {
    if (member.photo.startsWith('data:image/')) {
      const matches = member.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        attachments.push({
          filename: 'member-photo.jpg',
          content: buffer,
          cid: 'memberPhoto',
          contentType: mimeType,
        });
        photoHtml = `<img src="cid:memberPhoto" alt="${escapeHtml(member.name)}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 12px; border: 2px solid #2563eb; display: block; margin: auto;" />`;
        hasPhotoAttachment = true;
      }
    } else if (member.photo.startsWith('http://') || member.photo.startsWith('https://')) {
      photoHtml = `<img src="${member.photo}" alt="${escapeHtml(member.name)}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 12px; border: 2px solid #2563eb; display: block; margin: auto;" />`;
      hasPhotoAttachment = true;
    }
  }

  if (!hasPhotoAttachment) {
    const initial = (member.name && member.name.trim().length > 0) ? escapeHtml(member.name.trim().charAt(0).toUpperCase()) : 'M';
    photoHtml = `<div style="width: 110px; height: 130px; border-radius: 12px; background: #e0e7ff; border: 2px dashed #3b82f6; display: flex; align-items: center; justify-content: center; text-align: center; margin: auto;"><span style="font-size: 32px; color: #1e40af; font-weight: bold; line-height: 130px;">${initial}</span></div>`;
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Official TechVerse Club Membership Card</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 2px solid #3b82f6;">
    
    <!-- CONGRATULATIONS HERO BANNER -->
    <tr>
      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 26px 24px; text-align: center; color: #ffffff;">
        <span style="display: inline-block; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Selection Confirmed • Screening Approved</span>
        <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(member.name)}, You're Selected! 🎉</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your screening is complete. The President &amp; Vice President have confirmed your official designation as <strong>${escapeHtml(member.designation)}</strong> (${escapeHtml(member.roleAssignee || 'Core Team Member')}). Welcome to the TechVerse family!</p>
      </td>
    </tr>

    <!-- CARD HEADER: 3 LOGOS -->
    <tr>
      <td style="background: #f8fafc; padding: 18px 20px 14px 20px; border-bottom: 2px solid #e2e8f0;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="cid:univLogo" alt="CT University" style="max-height: 55px; max-width: 90px; object-fit: contain;" />
            </td>
            <td align="center" width="40%" style="vertical-align: middle;">
              <img src="cid:techverseLogo" alt="TechVerse Club" style="max-height: 65px; max-width: 65px; border-radius: 50%; border: 2px solid #2563eb; object-fit: cover;" />
            </td>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="cid:soetLogo" alt="School of Engineering & Technology" style="max-height: 55px; max-width: 90px; object-fit: contain;" />
            </td>
          </tr>
        </table>

        <!-- DIAMOND CONNECTOR RIBBON -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 12px;">
          <tr>
            <td align="center" style="font-size: 10px; font-weight: 800; color: #047857; letter-spacing: 2px; text-transform: uppercase;">
              ◆ ◆ &nbsp;&nbsp; TECHVERSE CLUB • CT UNIVERSITY &nbsp;&nbsp; ◆ ◆
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase; padding-top: 2px;">
              School of Engineering & Technology
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CARD CONTENT BODY -->
    <tr>
      <td style="padding: 24px;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <!-- PHOTO COLUMN -->
            <td width="35%" style="vertical-align: top; padding-right: 18px; text-align: center;">
              ${photoHtml}
              <div style="margin-top: 10px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 4px;">
                <span style="display: block; font-size: 9px; font-weight: bold; color: #1e40af; text-transform: uppercase; letter-spacing: 1px;">Member ID</span>
                <span style="font-size: 12px; font-weight: 800; color: #0f172a; font-family: monospace;">${escapeHtml(member.memberId)}</span>
                <span style="display: block; font-size: 10px; font-weight: 700; color: #2563eb; font-family: monospace; margin-top: 2px;">Serial #${member.serialNumber || '1'}</span>
              </div>
              <div style="margin-top: 6px;">
                <span style="display: inline-block; font-size: 10px; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 6px;">Verified Member</span>
              </div>
            </td>

            <!-- DETAILS COLUMN -->
            <td width="65%" style="vertical-align: top;">
              <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 12px;">
                <tr>
                  <td width="38%" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Full Name:</td>
                  <td style="color: #0f172a; font-weight: 800; font-size: 14px;">${escapeHtml(member.name)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Reg. Number:</td>
                  <td style="color: #1e40af; font-weight: 700; font-family: monospace;">${escapeHtml(member.regNumber)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Department:</td>
                  <td style="color: #0f172a; font-weight: 600;">${escapeHtml(departmentDisplay)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Batch:</td>
                  <td style="color: #0f172a; font-weight: 600;">${escapeHtml(member.batch)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Residence:</td>
                  <td style="color: #0f172a; font-weight: 600;">
                    <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${escapeHtml(member.residenceType || 'Day Scholar')}</span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Contact No.:</td>
                  <td style="color: #0f172a; font-weight: 600; font-family: monospace;">${escapeHtml(member.contact)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Club Designation:</td>
                  <td>
                    <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 4px;">
                      ${escapeHtml(member.designation) || 'Active Member'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Role Assignee:</td>
                  <td>
                    <span style="background: #dbeafe; color: #1e3a8a; border: 1px solid #bfdbfe; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 4px;">
                      ${escapeHtml(member.roleAssignee) || 'Core Team'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- INTERESTS & NOTE -->
        <div style="margin-top: 18px; padding: 12px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 11px;">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #334155;">Interests & Domains: <span style="color: #2563eb; font-weight: 600;">${escapeHtml(interestsList)}</span></p>
          <p style="margin: 0; color: #64748b; font-size: 10px; line-height: 1.4;">
            ℹ️ <strong>Club Protocol:</strong> Your official Designation and Role Assignee have been assigned and approved by the President and Vice President. Please save this digital membership card for all university technical hackathons, workshops, and exclusive club events.
          </p>
        </div>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background: #f1f5f9; padding: 14px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">TechVerse Club • School of Engineering & Technology</p>
        <p style="margin: 0; font-size: 10px;">CT University, Ferozepur Road, Ludhiana, Punjab</p>
        <p style="margin: 6px 0 0 0; font-size: 10px; color: #94a3b8;">Email: <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a> • Official Membership Credential</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const mailOptions = {
    from: `"TechVerse Club • CT University" <${emailUser}>`,
    to: recipientEmail,
    replyTo: emailUser,
    subject: `🎉 Official TechVerse Club Membership Card Issued - ${member.name} (${member.designation || 'Active Member'})`,
    html: emailHtml,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Official Membership Card email dispatched successfully to ${recipientEmail}`);
    return true;
  } catch (err) {
    console.error('Primary card sendMail error (port 465):', err.message);
    try {
      console.log('🔄 Attempting fallback card email transporter via service: gmail...');
      const fallbackTransporter = nodemailer.createTransport({
        service: 'gmail',
        lookup: (hostname, options, callback) => {
          return dns.lookup(hostname, Object.assign({}, options, { family: 4 }), callback);
        },
        auth: { user: emailUser, pass: emailPass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
      });
      await fallbackTransporter.sendMail(mailOptions);
      console.log(`✅ Official Membership Card dispatched via port 587 fallback to ${recipientEmail}`);
      return true;
    } catch (fallbackErr) {
      console.error('❌ Fallback card transporter failed:', fallbackErr.message);
      throw fallbackErr;
    }
  }
}

/**
 * Stage 3: Send Curated Leadership Promotion Email
 * Triggered when Admin promotes an official club member to an elevated role/designation.
 */
async function sendPromotionEmail(member, previousDesignation) {
  const memberData = member.toObject ? member.toObject() : Object.assign({}, member);
  memberData.previousDesignation = previousDesignation || 'Active Member';

  // First attempt: Vercel serverless relay over HTTPS
  try {
    const relayOk = await callVercelRelay('promotion', memberData);
    if (relayOk) return true;
  } catch (relayErr) {
    console.warn('Promotion relay attempt failed:', relayErr.message);
  }

  // Fallback: sendMembershipCardEmail with updated data
  return await sendMembershipCardEmail(memberData);
}

// Auto-migration helper to separate legacy records into 2 collections in MongoDB Atlas
let hasMigrated = false;
async function autoMigrateCollections() {
  if (hasMigrated) return;
  try {
    const unassignedInClub = await ClubMember.find({
      $or: [
        { status: 'Under Screening' },
        { designation: { $in: ['', null] } },
      ]
    });

    if (unassignedInClub.length > 0) {
      console.log(`🔄 Migrating ${unassignedInClub.length} unassigned members from 'clubmembers' to 'underscreeningmembers'...`);
      for (const item of unassignedInClub) {
        const plain = item.toObject();
        delete plain._id;
        const exists = await UnderScreeningMember.findOne({
          $or: [{ email: plain.email }, { contact: plain.contact }]
        });
        if (!exists) {
          plain.status = 'Under Screening';
          await new UnderScreeningMember(plain).save();
        }
        await ClubMember.findByIdAndDelete(item._id);
      }
      console.log(`✅ Migration complete: screening members shifted to 'underscreeningmembers' collection.`);
    }
    hasMigrated = true;
  } catch (err) {
    console.error('Migration error in ClubMemberController:', err.message);
  }
}

// GET all screening applicants from 'underscreeningmembers' collection
const getScreeningMembers = async (req, res) => {
  try {
    await autoMigrateCollections();
    const screeningMembers = await UnderScreeningMember.find().sort({ serialNumber: -1, createdAt: -1 });
    res.json(screeningMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all official confirmed club members from 'clubmembers' collection
const getClubMembers = async (req, res) => {
  try {
    await autoMigrateCollections();
    const members = await ClubMember.find().sort({ serialNumber: -1, createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST submit new member application -> saves into 'underscreeningmembers' collection
const submitClubMember = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.regNumber || !data.contact || !data.email || !data.department || !data.batch) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const cleanEmail = String(data.email || '').trim().toLowerCase();
    const cleanContact = String(data.contact || '').trim().replace(/\D/g, '');

    // Whitelist test accounts to allow repeated testing
    const isTestWhitelisted =
      cleanEmail === 'rajdeepkumar200@gmail.com' ||
      cleanEmail === 'rajdeepsinghrs200@gmail.com' ||
      cleanEmail.startsWith('rajdeep') ||
      cleanEmail === 'techverse@ctuniversity.in';

    if (!isTestWhitelisted) {
      // Check duplicate email or phone number in both collections
      const existingScreening = await UnderScreeningMember.findOne({
        $or: [{ email: cleanEmail }, { contact: cleanContact }]
      });
      const existingOfficial = await ClubMember.findOne({
        $or: [{ email: cleanEmail }, { contact: cleanContact }]
      });

      if (existingScreening || existingOfficial) {
        const existing = existingScreening || existingOfficial;
        const isEmailMatch = existing.email === cleanEmail;
        return res.status(409).json({
          success: false,
          message: isEmailMatch
            ? `An application with this email (${cleanEmail}) has already been registered with TechVerse Club.`
            : `An application with this phone number (${cleanContact}) has already been registered with TechVerse Club.`
        });
      }
    }

    data.designation = '';
    data.roleAssignee = '';
    data.status = 'Under Screening';
    if (!data.residenceType) data.residenceType = 'Day Scholar';
    if (!data.photo) data.photo = '';

    // Calculate sequential serialNumber and format memberId
    let nextSerial = 1;
    const highestScreening = await UnderScreeningMember.findOne({ serialNumber: { $exists: true, $ne: null } }).sort({ serialNumber: -1 });
    const highestOfficial = await ClubMember.findOne({ serialNumber: { $exists: true, $ne: null } }).sort({ serialNumber: -1 });

    const maxSerial = Math.max(
      (highestScreening && typeof highestScreening.serialNumber === 'number') ? highestScreening.serialNumber : 0,
      (highestOfficial && typeof highestOfficial.serialNumber === 'number') ? highestOfficial.serialNumber : 0
    );

    if (maxSerial > 0) {
      nextSerial = maxSerial + 1;
    } else {
      const count = (await UnderScreeningMember.countDocuments()) + (await ClubMember.countDocuments());
      nextSerial = count + 1;
    }

    data.serialNumber = nextSerial;
    const serialStr = String(nextSerial).padStart(4, '0');
    data.memberId = `TV-${new Date().getFullYear()}-${serialStr}`;
    data.email = cleanEmail;

    // Save exclusively into MongoDB 'underscreeningmembers' collection
    const newScreeningMember = new UnderScreeningMember(data);
    await newScreeningMember.save();

    // Send Stage 1 Screening Process Email (non-blocking)
    let screeningEmailSent = false;
    let emailError = null;

    try {
      screeningEmailSent = await sendScreeningEmail(newScreeningMember);
      if (screeningEmailSent) {
        newScreeningMember.screeningEmailSent = true;
        await newScreeningMember.save();
      }
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error('Screening Email Dispatch Warning (non-blocking):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      screeningEmailSent,
      emailError,
      message: 'Thank you for showing interest in TechVerse Club! Your application is now under screening. The President / Vice President will review and assign your club designation soon.',
      member: newScreeningMember,
    });
  } catch (err) {
    console.error('Club Member Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error registering club member' });
  }
};

// PUT / PATCH update role or designation (Stage 2: Assign Designation -> Move from underscreeningmembers to clubmembers -> Send Official Card)
const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, roleAssignee, role, status } = req.body;

    if (!designation || !designation.trim()) {
      return res.status(400).json({ success: false, message: 'Club Designation is required before assigning official membership.' });
    }

    // 1. Look for applicant in UnderScreeningMember first
    let screeningDoc = await UnderScreeningMember.findById(id);
    let officialMember = null;

    if (screeningDoc) {
      const plain = screeningDoc.toObject();
      delete plain._id;

      plain.designation = designation.trim();
      plain.roleAssignee = (roleAssignee || '').trim();
      plain.role = role || 'Member';
      plain.status = 'Official Member';
      plain.joinedAt = new Date();

      if (!plain.serialNumber) {
        const highest = await ClubMember.findOne({ serialNumber: { $exists: true, $ne: null } }).sort({ serialNumber: -1 });
        plain.serialNumber = (highest && typeof highest.serialNumber === 'number') ? highest.serialNumber + 1 : 1;
        plain.memberId = `TV-${new Date().getFullYear()}-${String(plain.serialNumber).padStart(4, '0')}`;
      }

      // Save into 'clubmembers' collection
      officialMember = new ClubMember(plain);
      await officialMember.save();

      // Delete from 'underscreeningmembers' collection (shifts applicant out of screening folder!)
      await UnderScreeningMember.findByIdAndDelete(id);
    } else {
      // 2. If not in UnderScreeningMember, check ClubMember (editing an already official member)
      officialMember = await ClubMember.findById(id);
      if (!officialMember) {
        return res.status(404).json({ success: false, message: 'Member not found in screening or official members list.' });
      }

      if (designation !== undefined) officialMember.designation = designation.trim();
      if (roleAssignee !== undefined) officialMember.roleAssignee = (roleAssignee || '').trim();
      if (role !== undefined) officialMember.role = role;
      officialMember.status = 'Official Member';
      await officialMember.save();
    }

    // Dispatch Stage 2 Official Membership Card Email!
    let cardEmailSent = false;
    let cardEmailError = null;

    try {
      cardEmailSent = await sendMembershipCardEmail(officialMember);
      if (cardEmailSent) {
        officialMember.cardSent = true;
        officialMember.cardSentAt = new Date();
        await officialMember.save();
      }
    } catch (err) {
      cardEmailError = err.message;
      console.error('Membership Card Email Dispatch Warning (non-blocking):', err.message);
    }

    res.json({
      success: true,
      cardEmailSent,
      cardEmailError,
      message: cardEmailSent
        ? `Designation assigned to ${officialMember.name}! Official Club Membership Card dispatched to ${officialMember.email}, and shifted to Official Club Members folder in MongoDB Atlas.`
        : `Member details updated and saved in Official Club Members folder in MongoDB Atlas.`,
      member: officialMember,
    });
  } catch (err) {
    console.error('updateMemberRole error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE screening member application from 'underscreeningmembers'
const deleteScreeningMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UnderScreeningMember.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Screening applicant not found' });
    }
    return res.status(200).json({ success: true, message: 'Screening application deleted successfully', id });
  } catch (err) {
    console.error('Delete screening member error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete screening member' });
  }
};

// DELETE club member from 'clubmembers' (or fallback underscreeningmembers)
const deleteClubMember = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await ClubMember.findByIdAndDelete(id);
    if (!deleted) {
      deleted = await UnderScreeningMember.findByIdAndDelete(id);
    }
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    return res.status(200).json({ success: true, message: 'Member deleted successfully from MongoDB Atlas', id });
  } catch (err) {
    console.error('Delete member error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete member' });
  }
};

// POST / PATCH promote club member to a higher designation & dispatch promotion email
const promoteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, roleAssignee, role } = req.body;

    if (!designation || !designation.trim()) {
      return res.status(400).json({ success: false, message: 'New Club Designation is required for promotion.' });
    }

    let member = await ClubMember.findById(id);
    if (!member) {
      member = await UnderScreeningMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Official member not found.' });
      }
    }

    const previousDesignation = member.designation || 'Active Member';
    member.designation = designation.trim();
    if (roleAssignee !== undefined) member.roleAssignee = (roleAssignee || '').trim();
    if (role !== undefined) member.role = role;
    member.status = 'Official Member';
    member.promotedAt = new Date();
    await member.save();

    let promoEmailSent = false;
    let promoEmailError = null;

    try {
      promoEmailSent = await sendPromotionEmail(member, previousDesignation);
      if (promoEmailSent) {
        member.cardSent = true;
        member.cardSentAt = new Date();
        await member.save();
      }
    } catch (err) {
      promoEmailError = err.message;
      console.error('Promotion Email Dispatch Warning:', err.message);
    }

    res.json({
      success: true,
      cardEmailSent: promoEmailSent,
      promoEmailSent,
      promoEmailError,
      previousDesignation,
      newDesignation: member.designation,
      message: promoEmailSent
        ? `🎉 ${member.name} promoted to ${member.designation}! Updated Leadership ID Card sent to ${member.email}.`
        : `Member promoted to ${member.designation} in MongoDB Atlas.`,
      member,
    });
  } catch (err) {
    console.error('promoteMember error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getClubMembers,
  getScreeningMembers,
  submitClubMember,
  updateMemberRole,
  promoteMember,
  deleteClubMember,
  deleteScreeningMember,
};


