import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/ecommerce"
    );
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error Mongo:", error);
  }
};