const validateEnv = () => {
  const requiredVariables = ["MONGO_URI", "JWT_SECRET", "FRONTEND_URL"];

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]?.trim(),
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(", ")}`,
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.JWT_SECRET.includes("change_this")
  ) {
    throw new Error(
      "Replace the default JWT_SECRET before production deployment",
    );
  }
};

export default validateEnv;
