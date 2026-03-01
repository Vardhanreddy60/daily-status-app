const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  date:     { type: String, required: true },
  selected: { type: [String], default: [] },
  mood:     { type: Number, default: null },
  sleepH:   { type: Number, min: 0, max: 12, default: 7 },
  note:     { type: String, default: "", trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);
