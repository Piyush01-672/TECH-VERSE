const path = require('path');
const fs = require('fs');
const dns = require('dns');
const nodemailer = require('nodemailer');
const ClubMember = require('../models/ClubMember');
const UnderScreeningMember = require('../models/UnderScreeningMember');
const { generateIdCardPng } = require('../utils/generateIdCard');

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

  const isPromotion = Boolean(member.isPromotion);
  const cleanReg = String(member.regNumber || member.memberId || 'Member').replace(/[^a-zA-Z0-9_-]/g, '');
  const cardFilename = `TechVerse-Official-ID-Card-${cleanReg}.png`;

  let cardPngBuffer = null;
  try {
    cardPngBuffer = generateIdCardPng(member, { isPromotion });
  } catch (cardErr) {
    console.warn('Backend generateIdCardPng fallback error:', cardErr.message);
  }

  const attachments = [];
  if (cardPngBuffer) {
    // Inline image for the dedicated card frame
    attachments.push({
      filename: cardFilename,
      content: cardPngBuffer,
      cid: 'idCardInline',
      contentType: 'image/png',
    });
    // Explicit attachment for download
    attachments.push({
      filename: cardFilename,
      content: cardPngBuffer,
      contentType: 'image/png',
      contentDisposition: 'attachment',
    });
  }

  const heroBannerHtml = isPromotion ? `
  <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
    <span style="display: inline-block; background: rgba(250,204,21,0.25); border: 1px solid #facc15; color: #fef08a; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">🎖️ Official Leadership Promotion • Career Elevation</span>
    <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(member.name)}, You've Been Promoted! 🚀</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0e7ff; line-height: 1.5;">
      In recognition of your outstanding leadership and contributions to TechVerse, you have officially been elevated to <strong>${escapeHtml(member.designation || 'Club Leader')}</strong> (${escapeHtml(member.roleAssignee || 'Executive Board')}).
    </p>
  </div>
  ` : `
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
    <span style="display: inline-block; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Selection Confirmed • Screening Approved</span>
    <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(member.name)}, You're Selected! 🎉</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your screening is complete. The President &amp; Vice President have confirmed your official designation as <strong>${escapeHtml(member.designation)}</strong> (${escapeHtml(member.roleAssignee || 'Core Team Member')}). Welcome to the TechVerse family!</p>
  </div>
  `;

  const letterBodyHtml = isPromotion ? `
  <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border-left: 4px solid #eab308; border-radius: 0 12px 12px 0; padding: 18px; margin: 0 0 24px 0;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #854d0e; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
      🌟 Executive Leadership Citation &amp; Promotion Announcement
    </h4>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: #713f12; line-height: 1.6;">
      Dear <strong>${escapeHtml(member.name)}</strong>, on behalf of the President, Vice President, and Faculty Advisors of <strong>TechVerse Club • School of Engineering &amp; Technology, CT University</strong>, we proudly commend your exemplary dedication and technical excellence.
    </p>
    <div style="background: #ffffff; border-radius: 8px; padding: 10px 14px; border: 1px solid #fde047; font-size: 12px; color: #713f12;">
      <span style="color: #64748b;">Previous Designation:</span> <strong style="text-decoration: line-through; color: #64748b;">${escapeHtml(member.previousDesignation || 'Member')}</strong> &nbsp;&nbsp;➔&nbsp;&nbsp; 
      <span style="color: #b45309; font-weight: bold;">New Elevated Designation:</span> <span style="background: #fef08a; color: #854d0e; font-weight: 800; padding: 2px 8px; border-radius: 4px;">🎖️ ${escapeHtml(member.designation)}</span>
    </div>
    <p style="margin: 12px 0 0 0; font-size: 12px; color: #854d0e; line-height: 1.5;">
      Your official <strong>TechVerse Leadership &amp; Membership Card</strong> has been generated below as a standalone printable badge. A print-ready, high-resolution PNG file (<code style="color: #854d0e;">${cardFilename}</code>) is also attached to this email for physical lanyard printing.
    </p>
  </div>
  ` : `
  <div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 12px 12px 0; padding: 18px; margin: 0 0 24px 0;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1e40af; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
      🎉 Welcome to TechVerse Club, CT University!
    </h4>
    <p style="margin: 0 0 10px 0; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
      Dear <strong>${escapeHtml(member.name)}</strong>, the screening committee has approved your application. You have officially been appointed as <strong>${escapeHtml(member.designation || 'Active Member')}</strong> (${escapeHtml(member.roleAssignee || 'Core Team')}).
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

  const subjectTitle = isPromotion
    ? `🎖️ Official Promotion Announced - Congratulations ${member.name} on Becoming ${member.designation || 'Club Leader'}! | TechVerse Club`
    : `🎉 Official TechVerse Club Membership Card Issued - ${member.name} (${member.designation || 'Active Member'})`;

  const mailOptions = {
    from: `"TechVerse Club • CT University" <${emailUser}>`,
    to: recipientEmail,
    replyTo: emailUser,
    subject: subjectTitle,
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

/**
 * Dispatch Resignation Acceptance Email (Curated, Warm & Soft-Toned)
 */
async function sendResignationEmail(member, remarks) {
  try {
    const payload = member.toObject ? member.toObject() : { ...member };
    payload.resignationRemarks = remarks || 'Voluntary departure on academic and personal grounds.';
    const relayOk = await callVercelRelay('resignation', payload);
    if (relayOk) return true;
  } catch (relayErr) {
    console.warn('Resignation relay attempt failed:', relayErr.message);
  }

  const transportConfig = getTransporter();
  if (!transportConfig) return false;
  const { transporter, emailUser } = transportConfig;

  const univLogoUrl = 'https://techversectu.vercel.app/univeee-logo.png';
  const techverseLogoUrl = 'https://techversectu.vercel.app/techverse-logo.jpg';
  const soetLogoUrl = 'https://techversectu.vercel.app/soet-logo.png';
  const desig = member.designation || 'Club Member';
  const roleAssignee = member.roleAssignee || 'Core Team';
  const exitRemarks = remarks || member.resignationRemarks || 'Voluntary departure on academic and personal grounds.';

  const resignationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Acceptance of Resignation &amp; Best Wishes - TechVerse Club</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="640" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 32px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #2563eb 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.4); color: #fde68a; font-size: 11px; font-weight: 800; padding: 5px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">Appreciation &amp; Farewell Message 🌟</span>
              <h1 style="margin: 4px 0 8px 0; font-size: 23px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">Thank You for Being Part of TechVerse</h1>
              <p style="margin: 0; font-size: 13px; color: #cbd5e1;">School of Engineering &amp; Technology • CT University</p>
            </td>
          </tr>
          <tr>
            <td style="background: #ffffff; padding: 14px 24px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" width="30%" style="vertical-align: middle;">
                    <img src="${univLogoUrl}" alt="CT University" style="max-height: 46px; max-width: 85px; object-fit: contain;" />
                  </td>
                  <td align="center" width="40%" style="vertical-align: middle;">
                    <img src="${techverseLogoUrl}" alt="TechVerse Club" style="max-height: 52px; max-width: 52px; border-radius: 50%; border: 2px solid #3b82f6; object-fit: cover;" />
                  </td>
                  <td align="center" width="30%" style="vertical-align: middle;">
                    <img src="${soetLogoUrl}" alt="SOET" style="max-height: 46px; max-width: 85px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; color: #334155; font-size: 14px; line-height: 1.7;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a;">
                Dear <strong>${escapeHtml(member.name)}</strong> (Reg No: <strong>${escapeHtml(member.regNumber)}</strong>),
              </p>
              <p style="margin: 0 0 16px 0;">
                We are writing to warmly acknowledge and confirm that the Executive Board and Faculty Advisors of <strong>TechVerse Club (SOET, CT University)</strong> have received and accepted your formal resignation from your active role as <strong>${escapeHtml(desig)}</strong> (${escapeHtml(roleAssignee)}).
              </p>
              <p style="margin: 0 0 18px 0;">
                University life comes with changing schedules, demanding coursework, and new personal journeys. We completely understand and respect your decision to step back at this time to focus on your studies and personal commitments.
              </p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #22c55e; padding: 18px 20px; border-radius: 0 14px 14px 0; margin: 22px 0;">
                <h4 style="margin: 0 0 6px 0; font-size: 14px; color: #15803d; font-weight: 800;">
                  🌟 Heartfelt Gratitude for Your Contributions
                </h4>
                <p style="margin: 0; color: #166534; font-size: 13.5px; line-height: 1.6;">
                  Thank you sincerely for the passion, creative ideas, and time you dedicated to TechVerse Club during your tenure. Your enthusiasm and collaboration helped enrich our community and made our club events and initiatives truly special. Your official record has been respectfully archived as <strong>Resigned in Good Standing</strong>.
                </p>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 12px 12px 0; margin: 20px 0; font-size: 13px;">
                <span style="display: block; color: #92400e; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; margin-bottom: 4px;">Leadership Note &amp; Remarks</span>
                <span style="color: #475569; font-style: italic;">"${escapeHtml(exitRemarks)}"</span>
              </div>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 18px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #1e40af;">
                <p style="margin: 0 0 6px 0; font-weight: 800;">🤝 You Are Always Part of the TechVerse Family</p>
                <p style="margin: 0; line-height: 1.6;">
                  Please remember that concluding an official administrative post does not mean goodbye. Our doors are always open to you! You are warmly invited to join all open TechVerse workshops, hackathons, seminars, and community meetups as an alumnus of the club.
                </p>
              </div>
              <p style="margin: 20px 0 0 0; color: #334155;">
                We wish you boundless happiness, academic excellence, and great success in all your future endeavors. Keep innovating, building, and shining bright!
              </p>
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; line-height: 1.6;">
                Warmest regards and best wishes,<br/>
                <strong style="color: #0f172a;">Executive Board &amp; Faculty Advisors</strong><br/>
                TechVerse Club • School of Engineering &amp; Technology<br/>
                CT University, Ludhiana, Punjab
              </div>
            </td>
          </tr>
          <tr>
            <td style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0 0 4px 0;">Official Administrative Communication • TechVerse Club</p>
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

  try {
    await transporter.sendMail({
      from: `"TechVerse Club • CT University" <${emailUser}>`,
      to: member.email,
      replyTo: emailUser,
      subject: `With Sincere Gratitude & Best Wishes • TechVerse Club, CT University`,
      html: resignationHtml,
    });
    return true;
  } catch (err) {
    console.error('Local resignation email fallback error:', err.message);
    return false;
  }
}

/**
 * Dispatch Membership Conclusion Notice Email (Curated, Dignified & Soft-Toned)
 */
async function sendTerminationEmail(member, reason, remarks, fineAmount) {
  try {
    const payload = member.toObject ? member.toObject() : { ...member };
    payload.terminationReason = reason;
    payload.terminationRemarks = remarks;
    payload.fineAmount = fineAmount || 1000;
    const relayOk = await callVercelRelay('termination', payload);
    if (relayOk) return true;
  } catch (relayErr) {
    console.warn('Termination relay attempt failed:', relayErr.message);
  }

  const transportConfig = getTransporter();
  if (!transportConfig) return false;
  const { transporter, emailUser } = transportConfig;

  const univLogoUrl = 'https://techversectu.vercel.app/univeee-logo.png';
  const techverseLogoUrl = 'https://techversectu.vercel.app/techverse-logo.jpg';
  const soetLogoUrl = 'https://techversectu.vercel.app/soet-logo.png';
  const desig = member.designation || 'Club Member';
  const roleAssignee = member.roleAssignee || 'Core Team';
  const termReason = reason || member.terminationReason || 'Non-alignment with Club Code of Conduct & commitments';
  const termRemarks = remarks || member.terminationRemarks || 'Administrative review conducted by faculty advisory committee.';
  const fine = fineAmount || member.fineAmount || 1000;

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
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background: rgba(199,210,254,0.18); border: 1px solid rgba(199,210,254,0.35); color: #e0e7ff; font-size: 11px; font-weight: 800; padding: 5px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">Membership Status Update</span>
              <h1 style="margin: 4px 0 8px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">Important Update Regarding Your TechVerse Membership</h1>
              <p style="margin: 0; font-size: 13px; color: #cbd5e1;">School of Engineering &amp; Technology • CT University</p>
            </td>
          </tr>
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
          <tr>
            <td style="padding: 32px 28px; color: #334155; font-size: 14px; line-height: 1.7;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a;">
                Dear <strong>${escapeHtml(member.name)}</strong> (Reg No: <strong>${escapeHtml(member.regNumber)}</strong>),
              </p>
              <p style="margin: 0 0 16px 0;">
                We hope this message finds you well with your academic studies. We are writing to share an important administrative update regarding your official role as <strong>${escapeHtml(desig)}</strong> (${escapeHtml(roleAssignee)}) in <strong>TechVerse Club</strong>.
              </p>
              <p style="margin: 0 0 18px 0;">
                TechVerse was created to foster an environment where all members actively support one another, deliver on shared commitments, and adhere to community guidelines. During recent reviews by the faculty advisory committee and student leads, it was noted that certain core expectations could unfortunately not be maintained.
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #6366f1; padding: 18px 20px; border-radius: 0 14px 14px 0; margin: 22px 0;">
                <h4 style="margin: 0 0 12px 0; color: #1e1b4b; font-size: 13.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;">
                  📋 Review Summary &amp; Details
                </h4>
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #334155;">
                  <tr>
                    <td width="35%" style="font-weight: 700; color: #475569; vertical-align: top;">Observed Reason:</td>
                    <td style="color: #1e293b; font-weight: 600;">${escapeHtml(termReason)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700; color: #475569; vertical-align: top;">Faculty Remarks:</td>
                    <td style="color: #475569;">${escapeHtml(termRemarks)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700; color: #475569; vertical-align: top;">Administrative Clearance:</td>
                    <td style="color: #b45309; font-weight: 700;">
                      ₹${fine} (per agreed onboarding guidelines to conclude exit documentation)
                    </td>
                  </tr>
                </table>
              </div>
              <p style="margin: 0 0 16px 0;">
                We genuinely understand that balancing college courses, exam preparations, and various personal responsibilities can be challenging. However, to remain fair to all peers who are actively executing upcoming initiatives, the executive leadership and faculty advisors have concluded your official active appointment with TechVerse Club, effective today.
              </p>
              <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 16px 18px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #334155;">
                <p style="margin: 0 0 6px 0; font-weight: 800; color: #1e293b;">ℹ️ Membership Records &amp; Clearance Information</p>
                <p style="margin: 0; line-height: 1.6;">
                  In line with this update, your active club digital ID card and official portal access have been deactivated in the club registry. Should you wish to discuss this update, request clarification, or complete the clearance formalities (₹${fine}), you are warmly welcome to visit the SOET Department Office during academic working hours—our faculty coordinators will be pleased to assist you.
                </p>
              </div>
              <p style="margin: 18px 0 0 0; color: #334155; line-height: 1.7;">
                Every phase of university life offers an opportunity for self-reflection, learning, and growth. We sincerely thank you for the time you spent with us and wish you the very best in your academic studies, personal development, and future endeavors.
              </p>
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; line-height: 1.6;">
                With sincere regards and best wishes,<br/>
                <strong style="color: #0f172a;">Faculty Advisory Committee &amp; Executive Board</strong><br/>
                TechVerse Club • School of Engineering &amp; Technology<br/>
                CT University, Ludhiana, Punjab
              </div>
            </td>
          </tr>
          <tr>
            <td style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0 0 4px 0;">Official Administrative Communication • TechVerse Club</p>
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

  try {
    await transporter.sendMail({
      from: `"TechVerse Club • CT University" <${emailUser}>`,
      to: member.email,
      replyTo: emailUser,
      subject: `Important Update Regarding Your TechVerse Club Membership • CT University`,
      html: terminationHtml,
    });
    return true;
  } catch (err) {
    console.error('Local termination email fallback error:', err.message);
    return false;
  }
}

// PATCH / POST accept resignation
const acceptResignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, sendEmail = true } = req.body || {};

    let member = await ClubMember.findById(id);
    if (!member) {
      member = await UnderScreeningMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Official member not found.' });
      }
    }

    member.status = 'Resigned';
    member.resignedAt = new Date();
    member.resignationRemarks = (remarks || '').trim() || 'Voluntary resignation accepted on personal/academic grounds.';
    await member.save();

    let emailSent = false;
    if (sendEmail) {
      try {
        emailSent = await sendResignationEmail(member, member.resignationRemarks);
      } catch (emailErr) {
        console.warn('Resignation email warning:', emailErr.message);
      }
    }

    res.json({
      success: true,
      emailSent,
      message: `Formal resignation accepted for ${member.name}. Status updated to Resigned.`,
      member,
    });
  } catch (err) {
    console.error('acceptResignation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH / POST terminate member on disciplinary grounds
const terminateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, remarks, fineAmount = 1000, sendEmail = true } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Disciplinary termination reason is required.' });
    }

    let member = await ClubMember.findById(id);
    if (!member) {
      member = await UnderScreeningMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Official member not found.' });
      }
    }

    member.status = 'Terminated';
    member.terminatedAt = new Date();
    member.terminationReason = reason.trim();
    member.terminationRemarks = (remarks || '').trim() || 'Disciplinary action taken by SOET Department.';
    member.fineAmount = Number(fineAmount) || 1000;
    await member.save();

    let emailSent = false;
    if (sendEmail) {
      try {
        emailSent = await sendTerminationEmail(member, member.terminationReason, member.terminationRemarks, member.fineAmount);
      } catch (emailErr) {
        console.warn('Termination email warning:', emailErr.message);
      }
    }

    res.json({
      success: true,
      emailSent,
      message: `Member ${member.name} has been terminated on disciplinary grounds. ID credentials revoked.`,
      member,
    });
  } catch (err) {
    console.error('terminateMember error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getClubMembers,
  getScreeningMembers,
  submitClubMember,
  updateMemberRole,
  promoteMember,
  acceptResignation,
  terminateMember,
  deleteClubMember,
  deleteScreeningMember,
};


