const Availability = require("../../model/availibility");
const { doctorModel } = require('../../model/doctormodel');
const generateSlots = require("../../utils/slotGenerator");

class AvailabilityController {

  //  Create Availability
  async createAvailability(req, res) {
    try {
      const { doctorId, weekday, startHour, startMinute, endHour, endMinute, duration } = req.body;

      // Check if doctor exists
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      if (req.user.roleName !== "doctor") {
        return res.status(403).json({ message: "Only doctors can schedule the timeslots" });
      }
      //  Prevent duplicate availability
      const existing = await Availability.findOne({ doctorId, weekday });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Availability for this doctor on this weekday already exists"
        });
      }

      //  Generate slots
      let slots = generateSlots(startHour, startMinute, endHour, endMinute, duration);
      slots = slots.slice(0, 5);

      if (!slots.length) {
        return res.status(400).json({
          success: false,
          message: "No slots generated. Check input values."
        });
      }

      //  Save availability
      const availability = new Availability({
        doctorId: doctor._id,
        weekday,
        timeSlots: slots
      });

      const data = await availability.save();
      return res.status(201).json({ success: true, message: "Availability created", data });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error creating availability",
        error: error.message
      });
    }
  }

  //  Get Availability by Doctor
  async getAvailabilityByDoctor(req, res) {
    try {
      const availability = await Availability.find({ doctorId: req.params.doctorId });

      if (!availability.length) {
        return res.status(404).json({ success: false, message: "No availability found for this doctor" });
      }

      return res.status(200).json({ success: true, data: availability });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching availability",
        error: error.message
      });
    }
  }

  // Set Day Off
  async setDayOff(req, res) {
    try {
      const { weekday, isDayOff } = req.body;
      const doctorId = req.params.doctorId;

      const dayOffValue = isDayOff === "true" || isDayOff === true;

      const availability = await Availability.findOneAndUpdate(
        { doctorId, weekday },
        { isDayOff: dayOffValue },
        { new: true }
      );

      if (!availability) {
        return res.status(404).json({ success: false, message: "Availability not found" });
      }

      return res.status(200).json({ success: true, message: "Day off updated", data: availability });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating day off",
        error: error.message
      });
    }
  }

  //  Get All Availability
  async getAllAvailability(req, res) {
    try {
      const availability = await Availability.find().populate("doctorId", "name email specialization");

      return res.status(200).json({
        success: true,
        message: "All doctors availability fetched",
        data: availability
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching availability",
        error: error.message
      });
    }
  }

  //  Add Special Day Off
  async addSpecialDayOff(req, res) {
    try {
      const { weekday, specialDay } = req.body;
      const doctorId = req.params.doctorId;

      const selectedDate = new Date(specialDay);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({ success: false, message: "Cannot add a past date as special day off" });
      }

      const availability = await Availability.findOneAndUpdate(
        { doctorId, weekday },
        { $addToSet: { specialDayOffs: specialDay } },
        { new: true }
      );

      if (!availability) {
        return res.status(404).json({ success: false, message: "Availability not found" });
      }

      return res.status(200).json({ success: true, message: "Special day off added", data: availability });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error adding special day off",
        error: error.message
      });
    }
  }

  //  Delete Special Day Off
  async deleteSpecialDayOff(req, res) {
    try {
      const { weekday, specialDay } = req.body;
      const doctorId = req.params.doctorId;

      const availability = await Availability.findOneAndUpdate(
        { doctorId, weekday },
        { $pull: { specialDayOffs: specialDay } },
        { new: true }
      );

      if (!availability) {
        return res.status(404).json({ success: false, message: "Availability not found" });
      }

      return res.status(200).json({ success: true, message: "Special day off deleted", data: availability });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting special day off",
        error: error.message
      });
    }
  }
}

module.exports = new AvailabilityController();
