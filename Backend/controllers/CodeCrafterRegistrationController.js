const CodeCrafterRegistration = require('../models/CodeCrafterRegistration');
const nodemailer = require('nodemailer');

const registerCodeCrafterTeam = async (req, res) => {
  try {
    const {
      teamName,
      hackathonExperience,
      teamSize,
      contactNumber,
      selectedEvent,
      selectedTheme,
      transactionId,
      accommodationRequired,
      accommodationDetails,
      extraGaming,
      participants
    } = req.body;

    let parsedAccommodationDetails = accommodationDetails;
    let parsedParticipants = participants;

    try {
      if (typeof accommodationDetails === 'string') {
        parsedAccommodationDetails = JSON.parse(accommodationDetails);
      }
      if (typeof participants === 'string') {
        parsedParticipants = JSON.parse(participants);
      }
    } catch (parseError) {
      console.error("JSON parsing error for FormData:", parseError);
    }

    let transactionImage = '';
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const mimeType = req.file.mimetype;
      transactionImage = `data:${mimeType};base64,${b64}`;
    }

    const newRegistration = new CodeCrafterRegistration({
      teamName,
      hackathonExperience,
      teamSize,
      contactNumber,
      selectedEvent,
      selectedTheme,
      transactionId,
      transactionImage,
      accommodationRequired,
      accommodationDetails: parsedAccommodationDetails,
      extraGaming: extraGaming || "None",
      participants: parsedParticipants,
    });

    await newRegistration.save();

    try {
      if (participants && participants.length > 0) {
        const teamLeader = participants[0];
        if (teamLeader.email) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
          
          const totalMembersHtml = participants.map((p, idx) => `<li><strong>Operator ${idx + 1}:</strong> ${p.name} - ${p.college}</li>`).join('');

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: teamLeader.email,
            subject: `${selectedEvent} - Registration Successful`,
            html: `
              <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: auto; padding: 20px; background-color: #060a12; color: #00F0FF; border: 2px solid #1A5BFF;">
                <h2 style="color: #FFD54F; text-transform: uppercase;">Thank you for completing registration!</h2>
                <p>Hello <strong>${teamLeader.name}</strong>,</p>
                <p>Your team <strong style="color: #fff; font-size: 1.1em;">${teamName}</strong> has successfully initialized the registration sequence for <strong>${selectedEvent}</strong>.</p>
                
                <h3 style="color: #1A5BFF; border-bottom: 1px solid #00F0FF; padding-bottom: 5px;">Team Protocol Details:</h3>
                <ul>
                  <li><strong>Alliance Name:</strong> ${teamName}</li>
                  <li><strong>Selected Event:</strong> ${selectedEvent}</li>
                  ${selectedTheme ? `<li><strong>Selected Theme:</strong> ${selectedTheme}</li>` : ''}
                  <li><strong>Total Units:</strong> ${participants.length}</li>
                </ul>
                
                <h3 style="color: #1A5BFF; border-bottom: 1px solid #00F0FF; padding-bottom: 5px;">Operator Register:</h3>
                <ul style="color: #ffffff;">
                  ${totalMembersHtml}
                </ul>
                
                <br />
                <p style="color: #00FF66; font-weight: bold;">[ SYSTEM STATUS: ENROLLED ]</p>
                <p style="color: #00F0FF; font-size: 0.8em;">Prepare your engines.</p>
                <p style="opacity: 0.5;">TechVerse 2026 Admin</p>
              </div>
            `,
          };

          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent to ${teamLeader.email}`);
          } else {
            console.log("Email env variables not set. Skipping registration email.");
          }
        }
      }
    } catch (emailError) {
      console.error("Failed to send CodeCrafter confirmation email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "CodeCrafter Team registered successfully!",
    });
  } catch (error) {
    console.error("CodeCrafter Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the CodeCrafter team.",
    });
  }
};

module.exports = { registerCodeCrafterTeam };
