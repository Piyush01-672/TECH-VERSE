const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const ClubMember = require('../models/ClubMember');

const getClubMembers = async (req, res) => {
  try {
    const members = await ClubMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitClubMember = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.regNumber || !data.contact || !data.email || !data.department || !data.batch) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Default designation and roleAssignee to empty strings so admin can fill in MongoDB
    if (!data.designation) {
      data.designation = '';
    }
    if (!data.roleAssignee) {
      data.roleAssignee = '';
    }
    if (!data.residenceType) {
      data.residenceType = 'Day Scholar';
    }
    if (!data.photo) {
      data.photo = '';
    }
    if (!data.memberId) {
      data.memberId = `TV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Save exclusively into MongoDB 'clubmembers' collection (No enquiry mirroring)
    const newMember = new ClubMember(data);
    await newMember.save();

    // Send official Club Membership Card to the member's email from techverse@ctuniversity.in
    try {
        const emailPass = process.env.EMAIL_PASS ? String(process.env.EMAIL_PASS).replace(/\s+/g, '').trim() : '';
        const emailUser = (process.env.EMAIL_USER ? String(process.env.EMAIL_USER).trim() : '') || 'techverse@ctuniversity.in';

        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        // Prepare attachments for the 3 logos
        const attachments = [];
        const assetsDir = path.join(__dirname, '../assets');

        const univLogoPath = path.join(assetsDir, 'univeee-logo.png');
        const techverseLogoPath = path.join(assetsDir, 'techverse-logo.jpg');
        const soetLogoPath = path.join(assetsDir, 'soet-logo.png');

        if (fs.existsSync(univLogoPath)) {
          attachments.push({
            filename: 'univeee-logo.png',
            path: univLogoPath,
            cid: 'univLogo',
          });
        }

        if (fs.existsSync(techverseLogoPath)) {
          attachments.push({
            filename: 'techverse-logo.jpg',
            path: techverseLogoPath,
            cid: 'techverseLogo',
          });
        }

        if (fs.existsSync(soetLogoPath)) {
          attachments.push({
            filename: 'soet-logo.png',
            path: soetLogoPath,
            cid: 'soetLogo',
          });
        }

        // Embed student photo if available
        let hasPhotoAttachment = false;
        if (data.photo && typeof data.photo === 'string' && data.photo.startsWith('data:image/')) {
          const matches = data.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            attachments.push({
              filename: 'member-photo.jpg',
              content: buffer,
              cid: 'memberPhoto',
              contentType: mimeType,
            });
            hasPhotoAttachment = true;
          }
        }

        const departmentDisplay = data.department === 'btech' ? 'B.Tech (School of Engineering & Technology)' : (data.department === 'bca' ? 'BCA (School of Engineering & Technology)' : String(data.department).toUpperCase());
        const interestsList = Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || 'Technology & Innovation');

        const photoHtml = hasPhotoAttachment
          ? `<img src="cid:memberPhoto" alt="${data.name}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 12px; border: 2px solid #2563eb; display: block; margin: auto;" />`
          : `<div style="width: 110px; height: 130px; border-radius: 12px; background: #e0e7ff; border: 2px dashed #3b82f6; display: flex; align-items: center; justify-content: center; text-align: center; margin: auto;"><span style="font-size: 32px; color: #1e40af; font-weight: bold; line-height: 130px;">${data.name.charAt(0).toUpperCase()}</span></div>`;

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Official TechVerse Club Membership Card</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 2px solid #3b82f6;">
    
    <!-- GREETING BANNER -->
    <tr>
      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 24px 24px; text-align: center; color: #ffffff;">
        <span style="display: inline-block; background: rgba(59,130,246,0.2); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Membership Issued</span>
        <h1 style="margin: 6px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Welcome to TechVerse Club! 🎉</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Your official membership application has been accepted. Below is your generated Club ID Card.</p>
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
                <span style="font-size: 12px; font-weight: 800; color: #0f172a; font-family: monospace;">${data.memberId}</span>
              </div>
              <div style="margin-top: 6px;">
                <span style="display: inline-block; font-size: 10px; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 6px;">Active Member</span>
              </div>
            </td>

            <!-- DETAILS COLUMN -->
            <td width="65%" style="vertical-align: top;">
              <table width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 12px;">
                <tr>
                  <td width="38%" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Full Name:</td>
                  <td style="color: #0f172a; font-weight: 800; font-size: 14px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Reg. Number:</td>
                  <td style="color: #1e40af; font-weight: 700; font-family: monospace;">${data.regNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Department:</td>
                  <td style="color: #0f172a; font-weight: 600;">${departmentDisplay}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Batch:</td>
                  <td style="color: #0f172a; font-weight: 600;">${data.batch}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Residence:</td>
                  <td style="color: #0f172a; font-weight: 600;">
                    <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${data.residenceType}</span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Contact No.:</td>
                  <td style="color: #0f172a; font-weight: 600; font-family: monospace;">${data.contact}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Club Designation:</td>
                  <td>
                    <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 700; font-size: 10px; padding: 2px 8px; border-radius: 4px;">
                      ${data.designation || 'Pending Admin Assignment'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px;">Role Assignee:</td>
                  <td>
                    <span style="background: #dbeafe; color: #1e3a8a; border: 1px solid #bfdbfe; font-weight: 700; font-size: 10px; padding: 2px 8px; border-radius: 4px;">
                      ${data.roleAssignee || 'Pending Admin Assignment'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- INTERESTS & NOTE -->
        <div style="margin-top: 18px; padding: 12px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 11px;">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #334155;">Interests & Domains: <span style="color: #2563eb; font-weight: 600;">${interestsList}</span></p>
          <p style="margin: 0; color: #64748b; font-size: 10px; line-height: 1.4;">
            ℹ️ <strong>Club Protocol:</strong> Stored in MongoDB <code>clubmembers</code> collection. Your official Designation and Role Assignee will be reviewed and assigned by club administrators based on auditions and team selections.
          </p>
        </div>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background: #f1f5f9; padding: 14px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">TechVerse Club • School of Engineering & Technology</p>
        <p style="margin: 0; font-size: 10px;">CT University, Ferozepur Road, Ludhiana, Punjab</p>
        <p style="margin: 6px 0 0 0; font-size: 10px; color: #94a3b8;">Email: <a href="mailto:techverse@ctuniversity.in" style="color: #2563eb; text-decoration: none;">techverse@ctuniversity.in</a> • Official Membership Notification</p>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        const mailOptions = {
          from: `"TechVerse Club • CT University" <techverse@ctuniversity.in>`,
          to: data.email,
          replyTo: 'techverse@ctuniversity.in',
          subject: `🎓 TechVerse Club Membership Card - ${data.name} (${data.memberId})`,
          html: emailHtml,
          attachments,
        };

        if (emailPass) {
          await transporter.sendMail(mailOptions);
          console.log(`✅ Membership Card email sent successfully to ${data.email} from techverse@ctuniversity.in`);
        } else {
          console.log(`ℹ️ EMAIL_PASS not set in environment. Registered in MongoDB 'clubmembers'. Ready to email to ${data.email} once credentials are set.`);
        }
      }
    } catch (emailErr) {
      console.error('Email Dispatch Warning (non-blocking):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Club member registered successfully! Your Club ID card has been issued.',
      member: newMember,
    });
  } catch (err) {
    console.error('Club Member Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error registering club member' });
  }
};

// Admin route to update role or designation directly
const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, roleAssignee, role, status } = req.body;

    const updatedMember = await ClubMember.findByIdAndUpdate(
      id,
      {
        ...(designation !== undefined && { designation }),
        ...(roleAssignee !== undefined && { roleAssignee }),
        ...(role !== undefined && { role }),
        ...(status !== undefined && { status }),
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member updated successfully', member: updatedMember });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClubMembers,
  submitClubMember,
  updateMemberRole,
};
