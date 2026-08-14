const getAllowedOrigins = () => {
  return [
    process.env.FRONTEND_URL,
    process.env.ADMIN_FRONTEND_URL,
    process.env.PRODUCTION_FRONTEND_URL,
    process.env.PRODUCTION_ADMIN_URL,
  ].filter(Boolean);
};

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests without Origin:
    // Postman, server-to-server calls and health checks.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error(`CORS blocked request from origin: ${origin}`);

    error.statusCode = 403;

    return callback(error);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "Accept"],

  exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],

  optionsSuccessStatus: 204,
};

export default corsOptions;
