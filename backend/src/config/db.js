import mongoose from "mongoose";

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  mongoose.set("strictQuery", true);
  mongoose.set("sanitizeFilter", false);

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database : ${connection.connection.name}`);
    console.log(`🌐 Host     : ${connection.connection.host}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return connection;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    throw error;
  }
};

export default connectDb;
