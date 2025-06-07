import mongoose, { Schema } from "mongoose";

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model("User", User);

export default UserModel;
