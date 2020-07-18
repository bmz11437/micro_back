const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  src: { type: String, required: true },
  tabs: { type: String, required: false },
  info: { type: String, required: false },
  downloadTime: { type: Number, required: false, default: 0 },
  previewTime: { type: Number, required: false, default: 0 },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
});

module.exports = model("Image", userSchema);
