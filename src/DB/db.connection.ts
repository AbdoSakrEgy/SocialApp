import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/SocialApp")
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
