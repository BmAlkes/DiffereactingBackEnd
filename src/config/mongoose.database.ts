import mongoose from "mongoose";
import colors from "colors";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb+srv://bmalkes:${process.env.DB_PASSWORD}@cluster0.u6sbs0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0,
      `);
    console.log(colors.yellow("Connect DB"));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
