const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    //document structure & rules
    lastName: { type: String, required: true },
    firstName: { type: String },
    age: { type: Number, required: true, min: 17, max: 99 },
    sexe: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
      default: "Male"
    },
    job: {
      type: String,
      required: true,
      enum: ["Employed", "Unemployed", "Student", "Retired", "Other"],
      default: "Employed"
    },
    presentation: { type: String },
    avatar: { type: String, default: "/images/avatar.png" },
    budget: { type: Number },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    phone: {
      type: String,
      required: true,
      match: /^(?:(?:\+|00)33|0)\s*[6-7](?:[\s.-]*\d{2}){4}$/
    },
    encryptedPassword: { type: String },
    role: { type: String, enum: ["owner", "normal"], required: true }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
