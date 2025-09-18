const Appointment = require("../../model/appointmentmodel");
const Availability = require('../../model/availibility');
const Report = require("../../model/report");
const SystemSettings=require('../../model/systemsettingmodel')
class BookingController {
    // async bookAppointment(req, res) {
    //     try {
    //         const patientId = req.user._id;
    //         const { doctorId, date, timeSlot } = req.body;

    //         //  Only patients can book
    //         if (req.user.role !== "patient") {
    //             return res.status(403).json({ message: "Only patients can book appointments" });
    //         }

    //         const today = new Date();
    //         today.setHours(0, 0, 0, 0); // reset to midnight

    //         const bookingDate = new Date(date);
    //         bookingDate.setHours(0, 0, 0, 0);

    //         if (bookingDate < today) {
    //             return res.status(400).json({ message: "Cannot book for past dates" });
    //         }

    //         //  Get weekday name (e.g., "Monday")
    //         const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

    //         //  Find doctor's availability for that weekday
    //         const dayAvailability = await Availability.findOne({
    //             doctorId,
    //             weekday: dayName
    //         });

    //         if (!dayAvailability || dayAvailability.isDayOff) {
    //             return res.status(400).json({ message: `Doctor is off on ${dayName}` });
    //         }

    //         // Check special day offs
    //         if (dayAvailability.specialDayOffs.includes(date)) {
    //             return res.status(400).json({ message: "Doctor is unavailable on this special day" });
    //         }

    //         //  Validate requested time slot
    //         if (!dayAvailability.timeSlots.includes(timeSlot)) {
    //             return res.status(400).json({ message: "Invalid time slot for this doctor" });
    //         }

    //         //  Prevent multiple active bookings by the same patient
    //         const existingPatientBooking = await Appointment.findOne({
    //             patientId,
    //             doctorId,
    //             status: "booked"
    //         });

    //         if (existingPatientBooking) {
    //             return res.status(400).json({
    //                 message: "You already have an active booking with this doctor. Please edit or cancel it."
    //             });
    //         }

    //         //  Check if time slot already booked
    //         const existingAppointment = await Appointment.findOne({
    //             doctorId,
    //             date,
    //             timeSlot,
    //             status: "booked"
    //         });

    //         if (existingAppointment) {
    //             return res.status(400).json({ message: "This time slot is already booked" });
    //         }

    //         //  Create new appointment
    //         const appointment = new Appointment({
    //             patientId,
    //             doctorId,
    //             availabilityId: dayAvailability._id,
    //             date,
    //             timeSlot,
    //             status: "booked"
    //         });

    //         await appointment.save();

    //         return res.status(201).json({
    //             message: "Appointment booked successfully",
    //             appointment
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({
    //             message: "Error booking appointment",
    //             error: error.message
    //         });
    //     }
    // }
async  bookAppointment(req, res) {
  try {
    const patientId = req.user._id;
    const { doctorId, availabilityId, date, timeSlot } = req.body;

    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    //  Load system settings (Admin rules)
    const settings = await SystemSettings.findOne({});
    if (!settings) {
      return res.status(500).json({ message: "System settings not configured by admin" });
    }

    // Prevent booking for past dates
  
            const today = new Date();
            today.setHours(0, 0, 0, 0); // reset to midnight

            const bookingDate = new Date(date);
            bookingDate.setHours(0, 0, 0, 0);

            if (bookingDate < today) {
                return res.status(400).json({ message: "Cannot book for past dates" });
            }

    //  Prevent booking on admin-declared holidays
    if (settings.holidays.includes(date)) {
      return res.status(400).json({ message: "No bookings allowed on holidays" });
    }

    //  Find doctor availability
    const availability = await Availability.findOne({ _id: availabilityId, doctorId });
    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    //  Check weekday off
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    if (availability.isDayOff && availability.weekday === dayName) {
      return res.status(400).json({ message: "Doctor is off on this weekday" });
    }

    //  Check special day off
    if (availability.specialDayOffs.includes(date)) {
      return res.status(400).json({ message: "Doctor is unavailable on this special day" });
    }

    //  Validate slot
    if (!availability.timeSlots.includes(timeSlot)) {
      return res.status(400).json({ message: "Invalid time slot for this doctor" });
    }

    //  Rule 1: Max booking per slot
    const slotBookings = await Appointment.countDocuments({
      doctorId,
      availabilityId,
      date,
      timeSlot,
      status: "booked"
    });
    if (slotBookings >= settings.maxBookingPerSlot) {
      return res.status(400).json({ message: "This slot has reached max booking limit" });
    }

    //  Rule 2: Max booking per hour
    const [start] = timeSlot.split(" - "); // e.g. "12:00"
    const hour = start.split(":")[0]; // "12"
    const hourBookings = await Appointment.countDocuments({
      doctorId,
      date,
      timeSlot: new RegExp(`^${hour}`), // matches same hour
      status: "booked"
    });
    if (hourBookings >= settings.maxBookingPerHour) {
      return res.status(400).json({ message: "Max bookings per hour reached" });
    }

    //  Rule 3: Max daily appointments
    const dailyBookings = await Appointment.countDocuments({
      doctorId,
      date,
      status: "booked"
    });
    if (dailyBookings >= settings.maxDailyAppointments) {
      return res.status(400).json({ message: "Doctor has reached max appointments for today" });
    }

    // Save appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      availabilityId,
      date,
      timeSlot,
      status: "booked"
    });
    await appointment.save();

    return res.status(201).json({ message: "Appointment booked successfully", appointment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
}
// Reschedule Appointment
  async rescheduleAppointment(req, res) {
    try {
      const { date, timeSlot } = req.body;
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.patientId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });

      // Prevent past date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      if (newDate < today) return res.status(400).json({ message: "Cannot select past date" });

      // Check doctor availability
      const availability = await Availability.findById(appointment.availabilityId);
      if (!availability) return res.status(404).json({ message: "Availability not found" });

      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
      if ((availability.isDayOff && availability.weekday === dayName) || availability.specialDayOffs.includes(date))
        return res.status(400).json({ message: "Doctor unavailable on this day" });

      if (!availability.timeSlots.includes(timeSlot))
        return res.status(400).json({ message: "Invalid time slot" });

      appointment.date = date;
      appointment.timeSlot = timeSlot;
      appointment.status = "booked";
      await appointment.save();

      res.status(200).json({ message: "Appointment rescheduled", appointment });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Cancel Appointment (patient)
  async cancelAppointment(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.patientId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });

      appointment.status = "cancelled";
      await appointment.save();
      res.status(200).json({ message: "Appointment cancelled", appointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

    async getMyAppointments(req, res) {
        try {
            if (req.user.role !== "patient") {
                return res.status(403).json({ message: "Only patients can view their appointments" });
            }

            const appointments = await Appointment.find({ patientId: req.user._id })
                .populate("doctorId", "name email specialization")
                .populate("availabilityId", "weekday timeSlots")
                .sort({ date: 1 });

            res.json({ message: "Your appointments", appointments });
        } catch (error) {
            res.status(500).json({ message: "Error fetching appointments", error: error.message });
        }
    };
    async getDoctorAppointments(req, res) {
        try {
            if (req.user.roleName !== "doctor") {
                return res.status(403).json({ message: "Only doctors can view their appointments" });
            }

            const appointments = await Appointment.find({ doctorId: req.user.id })
                .populate("patientId", "name email")
                .populate("availabilityId", "weekday timeSlots")
                .sort({ date: 1 });

            res.json({ message: "Your patients' appointments", appointments });
        } catch (error) {
            res.status(500).json({ message: "Error fetching appointments", error: error.message });
        }
    };
     // Doctor: Confirm Appointment
  async confirmAppointment(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.doctorId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });

      appointment.status = "confirmed";
      await appointment.save();
      res.status(200).json({ message: "Appointment confirmed", appointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Doctor: Cancel Appointment
  async doctorCancelAppointment(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.doctorId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });

      appointment.status = "cancelled";
      await appointment.save();
      res.status(200).json({ message: "Appointment cancelled by doctor", appointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Doctor: Complete appointment + report
async completeAppointment(req, res) {
  try {
    const { reportReason } = req.body; // rename for clarity
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.doctorId!== req.user._id)
      return res.status(403).json({ message: "Not authorized" });

    // Mark appointment as completed
    appointment.status = "completed";
    await appointment.save();

    // Create a report if reason is provided
    let report = null;
    if (reportReason) {
      report = await Report.create({
        reportedBy: req.user.id,  // doctor completing the appointment
        type: "doctor",
        targetId: appointment._id, // link to appointment
        reason: reportReason,
        status: "open"
      });
    }

    res.status(200).json({
      message: "Appointment completed" + (report ? " & report saved" : ""),
      appointment,
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
}
module.exports = new BookingController()