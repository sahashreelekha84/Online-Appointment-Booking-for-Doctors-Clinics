const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true
    },
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability", 
      required: true
    },
    date: {
      type: Date,
      required: true
    },
   timeSlot:{type: String,required:true},
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
