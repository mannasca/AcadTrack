import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI from ENV:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
