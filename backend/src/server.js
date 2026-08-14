import dns from "node:dns";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const { default: validateEnv } = await import("./config/validateEnv.js");

const { default: app } = await import("./app.js");

const { default: connectDb } = await import("./config/db.js");

const { default: configureCloudinary } = await import("./config/cloudinary.js");

const { default: mongoose } = await import("mongoose");

const PORT = Number(process.env.PORT) || 5000;

let server;
let isShuttingDown = false;

const startServer = async () => {
  try {
    validateEnv();

    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      configureCloudinary();

      console.log("✅ Cloudinary configured");
    } else {
      console.warn(
        "⚠️ Cloudinary credentials are missing. Upload APIs may not work.",
      );
    }

    await connectDb();

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed");
    console.error(error);

    process.exit(1);
  }
};

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down...`);

  const forceShutdownTimer = setTimeout(() => {
    console.error("❌ Forced shutdown because graceful shutdown timed out");

    process.exit(1);
  }, 10000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      console.log("✅ HTTP server closed");
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();

      console.log("✅ MongoDB connection closed");
    }

    clearTimeout(forceShutdownTimer);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown");
    console.error(error);

    clearTimeout(forceShutdownTimer);

    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled promise rejection");
  console.error(error);

  shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception");
  console.error(error);

  shutdown("UNCAUGHT_EXCEPTION");
});

await startServer();
