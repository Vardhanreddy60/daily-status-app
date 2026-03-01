const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// GET all logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create log
router.post("/", async (req, res) => {
  try {
    const { date, selected, mood, sleepH, note } = req.body;
    if (!date) return res.status(400).json({ success: false, message: "date is required" });
    const log = await Log.create({ date, selected, mood, sleepH, note });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE log
router.delete("/:id", async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update log
router.put("/:id", async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!log) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
