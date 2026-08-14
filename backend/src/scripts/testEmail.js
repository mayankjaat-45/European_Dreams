import dotenv from "dotenv";

dotenv.config();

const { default: sendEmail } =
  await import("../utils/sendEmail.js");

try {
  const result = await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "European Dreams SMTP Test",
    text: "SMTP configuration is working.",
    html: `
      <h2>European Dreams SMTP Test</h2>
      <p>Your backend email configuration is working successfully.</p>
    `,
  });

  console.log("✅ Test email sent successfully");
  console.log(`Message ID: ${result.messageId}`);

  process.exit(0);
} catch (error) {
  console.error("❌ Test email failed");
  console.error(error);

  process.exit(1);
}