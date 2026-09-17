import nodemailer from 'nodemailer';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

  // Public asset URLs hosted on Vercel
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
              <td style="color: #64748b; font-weight: 600;">Department & Batch:</td>
              <td style="color: #0f172a;">${escapeHtml(departmentDisplay)} (${escapeHtml(m.batch || '')})</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Residence Type:</td>
              <td style="color: #0f172a;">${escapeHtml(m.residenceType || 'Day Scholar')}</td>
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
            The <strong>President &amp; Vice President</strong> along with the core technical panel of TechVerse are reviewing applicant profiles. You will soon be assigned your official <strong>Club Designation</strong> and <strong>Role Assignee</strong>.
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
          <strong>President &amp; Vice President</strong><br />
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

    // Default: Official Membership Card (type === 'card' or type === 'promotion')
    const isPromotion = type === 'promotion';
    const m = member || {};
    const departmentDisplay = m.department === 'btech'
      ? 'B.Tech (School of Engineering & Technology)'
      : (m.department === 'bca' ? 'BCA (School of Engineering & Technology)' : String(m.department || '').toUpperCase());
    const interestsList = Array.isArray(m.interests) ? m.interests.join(', ') : (m.interests || 'Technology & Innovation');

    const attachments = [];
    let photoHtml = '';

    if (m.photo && typeof m.photo === 'string') {
      if (m.photo.startsWith('data:image/')) {
        const matches = m.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          attachments.push({
            filename: 'member-photo.jpg',
            content: buffer,
            cid: 'memberPhoto',
            contentType: mimeType,
          });
          photoHtml = `<img src="cid:memberPhoto" alt="${escapeHtml(m.name)}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 12px; border: 2px solid ${isPromotion ? '#eab308' : '#2563eb'}; display: block; margin: auto;" />`;
        }
      } else if (m.photo.startsWith('http://') || m.photo.startsWith('https://')) {
        photoHtml = `<img src="${m.photo}" alt="${escapeHtml(m.name)}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 12px; border: 2px solid ${isPromotion ? '#eab308' : '#2563eb'}; display: block; margin: auto;" />`;
      }
    }

    if (!photoHtml) {
      const initial = (m.name && m.name.trim().length > 0) ? escapeHtml(m.name.trim().charAt(0).toUpperCase()) : 'M';
      photoHtml = `<div style="width: 110px; height: 130px; border-radius: 12px; background: ${isPromotion ? '#fef3c7' : '#e0e7ff'}; border: 2px dashed ${isPromotion ? '#eab308' : '#3b82f6'}; display: flex; align-items: center; justify-content: center; text-align: center; margin: auto;"><span style="font-size: 32px; color: ${isPromotion ? '#854d0e' : '#1e40af'}; font-weight: bold; line-height: 130px;">${initial}</span></div>`;
    }

    const heroBannerHtml = isPromotion ? `
    <!-- PROMOTION HERO BANNER -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e3a8a 100%); padding: 26px 24px; text-align: center; color: #ffffff;">
        <span style="display: inline-block; background: rgba(250,204,21,0.25); border: 1px solid #facc15; color: #fef08a; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">🎖️ Official Leadership Promotion • Career Elevation</span>
        <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(m.name)}, You've Been Promoted! 🚀</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0e7ff; line-height: 1.5;">
          In recognition of your outstanding leadership and contributions to TechVerse, you have officially been elevated to <strong>${escapeHtml(m.designation || 'Club Leader')}</strong> (${escapeHtml(m.roleAssignee || 'Executive Board')}).
        </p>
      </td>
    </tr>
    ` : `
    <!-- CONGRATULATIONS HERO BANNER -->
    <tr>
      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 26px 24px; text-align: center; color: #ffffff;">
        <span style="display: inline-block; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Selection Confirmed • Screening Approved</span>
        <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Congratulations ${escapeHtml(m.name)}, You're Selected! 🎉</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your screening is complete. The President &amp; Vice President have confirmed your official designation as <strong>${escapeHtml(m.designation || 'Club Member')}</strong> (${escapeHtml(m.roleAssignee || 'Core Team Member')}). Welcome to the TechVerse family!</p>
      </td>
    </tr>
    `;

    const curatedCitationHtml = isPromotion ? `
    <!-- CURATED PROMOTION CITATION -->
    <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border-left: 4px solid #eab308; border-radius: 0 12px 12px 0; padding: 16px; margin: 0 0 20px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #854d0e; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        🌟 Executive Leadership Citation &amp; Promotion Announcement
      </h4>
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #713f12; line-height: 1.6;">
        Dear <strong>${escapeHtml(m.name)}</strong>, on behalf of the President, Vice President, and Faculty Advisors of <strong>TechVerse Club • School of Engineering &amp; Technology, CT University</strong>, we proudly commend your exemplary dedication and technical excellence. You have consistently demonstrated outstanding drive, teamwork, and leadership.
      </p>
      <div style="background: #ffffff; border-radius: 8px; padding: 10px 14px; border: 1px solid #fde047; font-size: 12px; color: #713f12;">
        <span style="color: #64748b;">Previous Designation:</span> <strong style="text-decoration: line-through; color: #64748b;">${escapeHtml(m.previousDesignation || 'Member')}</strong> &nbsp;&nbsp;➔&nbsp;&nbsp; 
        <span style="color: #b45309; font-weight: bold;">New Elevated Designation:</span> <span style="background: #fef08a; color: #854d0e; font-weight: 800; padding: 2px 8px; border-radius: 4px;">🎖️ ${escapeHtml(m.designation)}</span>
      </div>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #854d0e; line-height: 1.5;">
        Your updated official <strong>TechVerse Leadership &amp; Membership Card</strong> has been generated and validated below. Please save this credential for all official university events and technical symposiums.
      </p>
    </div>
    ` : '';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isPromotion ? 'Official Leadership Promotion - TechVerse Club' : 'Official TechVerse Club Membership Card'}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 2px solid ${isPromotion ? '#eab308' : '#3b82f6'};">
    
    ${heroBannerHtml}

    <!-- CARD HEADER: 3 LOGOS -->
    <tr>
      <td style="background: #f8fafc; padding: 18px 20px 14px 20px; border-bottom: 2px solid #e2e8f0;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="${univLogoUrl}" alt="CT University" style="max-height: 55px; max-width: 90px; object-fit: contain;" />
            </td>
            <td align="center" width="40%" style="vertical-align: middle;">
              <img src="${techverseLogoUrl}" alt="TechVerse Club" style="max-height: 65px; max-width: 65px; border-radius: 50%; border: 2px solid #2563eb; object-fit: cover;" />
            </td>
            <td align="center" width="30%" style="vertical-align: middle;">
              <img src="${soetLogoUrl}" alt="School of Engineering & Technology" style="max-height: 55px; max-width: 90px; object-fit: contain;" />
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
        ${curatedCitationHtml}

        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <!-- PHOTO COLUMN -->
            <td width="35%" style="vertical-align: top; padding-right: 18px; text-align: center;">
              ${photoHtml}
              <div style="margin-top: 10px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 4px;">
                <span style="display: block; font-size: 9px; font-weight: bold; color: #1e40af; text-transform: uppercase; letter-spacing: 1px;">Member ID</span>
                <span style="font-size: 12px; font-weight: 800; color: #0f172a; font-family: monospace;">${escapeHtml(m.memberId || '')}</span>
                <span style="display: block; font-size: 10px; font-weight: 700; color: #2563eb; font-family: monospace; margin-top: 2px;">Serial #${m.serialNumber || '1'}</span>
              </div>
              <div style="margin-top: 6px;">
                ${isPromotion
                  ? `<span style="display: inline-block; font-size: 10px; font-weight: 700; color: #854d0e; background: #fef9c3; border: 1px solid #fde047; padding: 2px 8px; border-radius: 6px;">🎖️ Promoted Leader</span>`
                  : `<span style="display: inline-block; font-size: 10px; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 6px;">Verified Member</span>`
                }
              </div>
            </td>

            <!-- DETAILS COLUMN -->
            <td width="65%" style="vertical-align: top;">
              <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 12px;">
                <tr>
                  <td width="38%" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Full Name:</td>
                  <td style="color: #0f172a; font-weight: 800; font-size: 14px;">${escapeHtml(m.name)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Reg. Number:</td>
                  <td style="color: #1e40af; font-weight: 700; font-family: monospace;">${escapeHtml(m.regNumber)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Department:</td>
                  <td style="color: #0f172a; font-weight: 600;">${escapeHtml(departmentDisplay)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Batch:</td>
                  <td style="color: #0f172a; font-weight: 600;">${escapeHtml(m.batch)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Residence:</td>
                  <td style="color: #0f172a; font-weight: 600;">
                    <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${escapeHtml(m.residenceType || 'Day Scholar')}</span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Contact No.:</td>
                  <td style="color: #0f172a; font-weight: 600; font-family: monospace;">${escapeHtml(m.contact)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Club Designation:</td>
                  <td>
                    <span style="background: ${isPromotion ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#fef3c7'}; color: #92400e; border: 1px solid #fde68a; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 4px;">
                      ${isPromotion ? '🎖️ ' : ''}${escapeHtml(m.designation) || 'Active Member'}${isPromotion ? ' (PROMOTED)' : ''}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Role Assignee:</td>
                  <td>
                    <span style="background: #dbeafe; color: #1e3a8a; border: 1px solid #bfdbfe; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 4px;">
                      ${escapeHtml(m.roleAssignee) || 'Core Team'}
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
      message: isPromotion
        ? `Official Promotion Announcement & ID Card dispatched to ${cleanRecipient}`
        : `Official ID Card dispatched to ${cleanRecipient}`,
    });
  } catch (err) {
    console.error('Relay error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch email',
    });
  }
}
