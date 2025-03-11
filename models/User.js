import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, // Hashed password
    role: { type: String, default: "user" }, // 'admin' or 'user'
    preferences: [String], // For recommendation engine
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
