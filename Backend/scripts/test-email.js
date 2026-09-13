require('@dotenvx/dotenvx').config({ path: require('path').join(__dirname, '../.env'), silent: true });
const nodemailer = require('nodemailer');

const recipient = process.argv[2] || process.env.EMAIL_USER;

if (!process.env.EMAIL_PASS) {
  console.error("❌ ERROR: EMAIL_PASS is not defined in your Backend/.env file!");
  console.log("👉 Please add EMAIL_PASS=<your-16-character-app-password> to Backend/.env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'techverse@ctuniversity.in',
    pass: process.env.EMAIL_PASS,
  },
});

console.log(`📡 Testing SMTP connection for ${process.env.EMAIL_USER || 'techverse@ctuniversity.in'}...`);

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Failed:", error.message);
    console.log("\nCommon causes:");
    console.log("1. 2-Step Verification is not enabled on techverse@ctuniversity.in.");
    console.log("2. You used the account's normal password instead of a Google App Password.");
    console.log("3. Generate an App Password at: https://myaccount.google.com/apppasswords");
  } else {
    console.log("✅ SMTP Server is ready to send messages!");
    console.log(`📤 Sending test email to ${recipient}...`);

    transporter.sendMail({
      from: `"TechVerse CT University" <${process.env.EMAIL_USER || 'techverse@ctuniversity.in'}>`,
      to: recipient,
      subject: "Test Email from TechVerse",
      html: "<h3>Success!</h3><p>Your email service is configured correctly and ready to send member ID cards.</p>",
    }, (err, info) => {
      if (err) {
        console.error("❌ Failed to send email:", err.message);
      } else {
        console.log(`🎉 Test email sent successfully! Message ID: ${info.messageId}`);
      }
    });
  }
});
