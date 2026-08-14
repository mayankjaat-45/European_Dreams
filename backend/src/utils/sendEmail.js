import nodemailer from "nodemailer";

let transporter;

const createTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const requiredVariables = [
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];

  const missingVariables = requiredVariables.filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missingVariables.length > 0) {
    throw new Error(`Missing email variables: ${missingVariables.join(", ")}`);
  }

  const port = Number(process.env.EMAIL_PORT);

  if (!Number.isInteger(port)) {
    throw new Error("EMAIL_PORT must be a valid number");
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST.trim(),
    port,
    secure: port === 465,

    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });

  return transporter;
};

export const verifyEmailConnection = async () => {
  const mailTransporter = createTransporter();
  await mailTransporter.verify();

  console.log("Email server connection verified");
};

export default createTransporter;
