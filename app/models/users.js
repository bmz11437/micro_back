const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  dir: {
    type: [
      {
        name: { type: String, require: true },
        children: { type: [{ type: Schema.Types.ObjectId, ref: "Image" }] },
      },
    ],
    required: false,
  },
});

module.exports = model("User", userSchema);
