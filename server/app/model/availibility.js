const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const availabilitySchema = new Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
  weekday: { type: String, required: true }, // e.g., "Monday"
  timeSlots: [{ type: String }], // ["09:00 - 09:30", ...]
  isDayOff: { type: Boolean, default: false }, // Weekly day off (recurring)
  specialDayOffs: [String] // e.g., ["2025-09-20", "2025-10-05"]
});

module.exports = mongoose.model("Availability", availabilitySchema);
