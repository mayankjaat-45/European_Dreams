import nodemailer from "nodemailer";

const createTransporter = () => {
  const requiredVariables = [
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];

  const missingVariables = requiredVariables.filter((key) => !process.env[key]);

  if (missingVariables.length) {
    throw new Error(`Missing email variables: ${missingVariables.join(", ")}`);
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export default createTransporter;
