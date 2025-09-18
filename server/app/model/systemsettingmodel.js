
const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema({
  maxBookingPerSlot: { type: Number, default: 1 },   // per doctor per slot
  maxBookingPerHour: { type: Number, default: 3 },   // per doctor per hour
  maxDailyAppointments: { type: Number, default: 20 }, // per doctor per day
  holidays: [String] // e.g. ["2025-12-25", "2025-01-01"]
});

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
