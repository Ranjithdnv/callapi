const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema(
  {
    name: { type: String },
    phonenumber: { type: String },
    class: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Call", CallSchema);
