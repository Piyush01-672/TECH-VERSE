const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const ClubMember = require('../models/ClubMember');

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

  if (process.env.EMAIL_HOST) {
    return {
      transporter: nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      }),
      emailUser,
    };
  }

  return {
    transporter: nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    }),
    emailUser,
  };
}

/**
 * Stage 1: Send Screening Process Acknowledgment Email
 * Triggered automatically when student submits the New Member Application.
 */
async function sendScreeningEmail(member) {
  const transportConfig = getTransporter();
  if (!transportConfig) {
    console.log(`ℹ️ EMAIL_PASS not set. Screening email queued for ${member.email}`);
    return false;
  }

  const { transporter, emailUser } = transportConfig;
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
          Thank you for showing interest in joining <strong>TechVerse Club</strong>! Your membership application has been received successfully and is currently under our official <strong>Screening & Audition Process</strong>.
        </p>

        <!-- APPLICATION SUMMARY CARD -->
        <div style="background: #f1f5f9; border-radius: 12px; border: 1px solid #cbd5e1; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; font-weight: 800;">
            📋 Application Summary
          </h3>
          <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13px;">
            <tr>
              <td width="40%" style="color: #64748b; font-weight: 600;">Application ID:</td>
              <td style="color: #0f172a; font-weight: 800; font-family: monospace;">${escapeHtml(member.memberId)}</td>
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
            The <strong>President & Vice President</strong> along with the core technical panel of TechVerse will review your skills and preferences. You will soon be assigned your official <strong>Club Designation</strong> and <strong>Role Assignee</strong>.
          </p>
        </div>

        <!-- MEMBER CARD PROMISE -->
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 10px 10px 0; padding: 14px 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #15803d; font-weight: 700;">🪪 Official Membership Card Dispatch</h4>
          <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
            As soon as your club designation is assigned by the administration, your official verified <strong>TechVerse Club Membership Card</strong> will be generated and delivered directly to this email address.
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

  await transporter.sendMail({
    from: `"TechVerse Club • CT University" <${emailUser}>`,
    to: recipientEmail,
    replyTo: emailUser,
    subject: `🚀 TechVerse Club Application Received - Welcome to Screening, ${member.name}!`,
    html: htmlContent,
    attachments,
  });

  console.log(`✅ Screening acknowledgment email dispatched to ${recipientEmail}`);
  return true;
}

/**
 * Stage 2: Send Official Verified Membership Card Email
 * Triggered ONLY when Admin/President/VP sets the designation from the /admin portal.
 */
async function sendMembershipCardEmail(member) {
  const transportConfig = getTransporter();
  if (!transportConfig) {
    console.log(`ℹ️ EMAIL_PASS not set. Membership Card email queued for ${member.email}`);
    return false;
  }

  const { transporter, emailUser } = transportConfig;
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
        <span style="display: inline-block; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Designation Approved • Screening Completed</span>
        <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Welcome to the TechVerse Core Family! 🎉</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your screening is complete. The President & Vice President have confirmed your official designation below.</p>
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

  await transporter.sendMail({
    from: `"TechVerse Club • CT University" <${emailUser}>`,
    to: recipientEmail,
    replyTo: emailUser,
    subject: `🎉 Official TechVerse Club Membership Card Issued - ${member.name} (${member.designation || 'Active Member'})`,
    html: emailHtml,
    attachments,
  });

  console.log(`✅ Official Membership Card email dispatched successfully to ${recipientEmail}`);
  return true;
}

// GET all club members
const getClubMembers = async (req, res) => {
  try {
    const members = await ClubMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST submit new member application (Stage 1: Under Screening + Screening Email)
const submitClubMember = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.regNumber || !data.contact || !data.email || !data.department || !data.batch) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Default designation and roleAssignee to empty strings (to be assigned by President/VP)
    data.designation = '';
    data.roleAssignee = '';
    data.status = 'Under Screening';
    if (!data.residenceType) data.residenceType = 'Day Scholar';
    if (!data.photo) data.photo = '';
    if (!data.memberId) {
      data.memberId = `TV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const recipientEmail = String(data.email).trim().toLowerCase();
    data.email = recipientEmail;

    // Save exclusively into MongoDB 'clubmembers' collection
    const newMember = new ClubMember(data);
    await newMember.save();

    // Send Stage 1 Screening Process Email (non-blocking)
    let screeningEmailSent = false;
    let emailError = null;

    try {
      screeningEmailSent = await sendScreeningEmail(newMember);
      if (screeningEmailSent) {
        newMember.screeningEmailSent = true;
        await newMember.save();
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
      member: newMember,
    });
  } catch (err) {
    console.error('Club Member Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error registering club member' });
  }
};

// PUT / PATCH update role or designation (Stage 2: Assign Designation -> Send Official Membership Card)
const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, roleAssignee, role, status } = req.body;

    const member = await ClubMember.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (designation !== undefined) member.designation = designation;
    if (roleAssignee !== undefined) member.roleAssignee = roleAssignee;
    if (role !== undefined) member.role = role;

    const hasDesignationAssigned = member.designation && member.designation.trim().length > 0;
    if (status !== undefined) {
      member.status = status;
    } else if (hasDesignationAssigned) {
      member.status = 'Active';
    }

    await member.save();

    // If designation is assigned, dispatch the official Membership Card email!
    let cardEmailSent = false;
    let cardEmailError = null;

    if (hasDesignationAssigned) {
      try {
        cardEmailSent = await sendMembershipCardEmail(member);
        if (cardEmailSent) {
          member.cardSent = true;
          member.cardSentAt = new Date();
          await member.save();
        }
      } catch (err) {
        cardEmailError = err.message;
        console.error('Membership Card Email Dispatch Warning (non-blocking):', err.message);
      }
    }

    res.json({
      success: true,
      cardEmailSent,
      cardEmailError,
      message: cardEmailSent
        ? `Designation assigned to ${member.name}! Official Club Membership Card dispatched to ${member.email}.`
        : `Member details updated successfully in MongoDB Atlas.`,
      member,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClubMembers,
  submitClubMember,
  updateMemberRole,
};
