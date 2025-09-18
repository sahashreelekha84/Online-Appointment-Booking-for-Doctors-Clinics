const Availability = require("../../model/availibility");
const { doctorModel } = require('../../model/doctormodel')
const generateSlots = require("../../utils/slotGenerator");
class AvailabilityController {
  async renderCreateForm(req, res) {
    const doctors = await doctorModel.find({}, "_id name email");
    res.render("availability/create", {
      title: "Create Availability",
      doctors, data: req.user
    });
  }
  // async createAvailability(req, res) {
  //   try {
  //     const { doctorId, weekday, startHour, startMinute, endHour, endMinute, duration } = req.body;
  //     console.log(req.body);

  //     const doctor = await doctorModel.findById(doctorId);

  //     if (!doctor) {
  //       return res.render("availability/error", {
  //         title: "Error",
  //         message: "Doctor not found"
  //       });
  //     }

  //     const slots = generateSlots(startHour, startMinute, endHour, endMinute, duration);
  //     if (!slots.length) {
  //       return res.render("availability/error", {
  //         title: "Error",
  //         message: "No slots generated. Check input values."
  //       });
  //     }
  //     const availability = new Availability({
  //       doctorId: doctor._id,
  //       weekday,
  //       timeSlots: slots
  //     });

  //     const data = await availability.save();
  //     console.log('data', data);

  //     // Redirect to list page
  //     res.redirect("/availability/list"); // No data can be sent here

  //   } catch (error) {
  //     res.render("availability/error", {
  //       title: "Error",
  //       message: "Error creating availability",
  //       error: error.message
  //     });
  //   }
  // };
  async createAvailability(req, res) {
    try {
      const { doctorId, weekday, startHour, startMinute, endHour, endMinute, duration } = req.body;

      // 1️⃣ Check if doctor exists
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return res.render("availability/error", {
          title: "Error",
          message: "Doctor not found"
        });
      }

     
      const existing = await Availability.findOne({ doctorId, weekday });
      if (existing) {
        return res.render("availability/error", {
          title: "Error",
          message: "Availability for this doctor on this weekday already exists"
        });
      }

      
      let slots = generateSlots(startHour, startMinute, endHour, endMinute, duration);

     
      slots = slots.slice(0, 5);

      if (!slots.length) {
        return res.render("availability/error", {
          title: "Error",
          message: "No slots generated. Check input values."
        });
      }

   
      const availability = new Availability({
        doctorId: doctor._id,
        weekday,
        timeSlots: slots
      });

      const data = await availability.save();
      console.log('data', data);

      
      res.redirect("/availability/list");

    } catch (error) {
      res.render("availability/error", {
        title: "Error",
        message: "Error creating availability",
        error: error.message,
        slotError: `Duplicate slot(s): ${duplicateSlots.join(", ")}`,

        data: req.user
      });
      res.redirect('/availability/create')
    }

  };



  async getAvailabilityByDoctor(req, res) {
    try {
      const availability = await Availability.find({ doctorId: req.params.doctorId });

      res.render("availability/list", {
        title: "Doctor Availability",
        availability
      });
    } catch (error) {
      res.render("availability/error", {
        title: "Error",
        message: "Error fetching availability",
        slotError: `Duplicate slot(s): ${duplicateSlots.join(", ")}`,
        error: error.message
      });
    }
  };

  async renderDayOffPage(req, res) {
    try {
      const { doctorId } = req.params;
      const availability = await Availability.find({ doctorId });

      if (!availability || availability.length === 0) {
        return res.render("availability/error", {
          title: "Not Found",
          message: "No availability found for this doctor"
        });
      }

      res.render("availability/dayoff", {
        title: "Set Day Off",
        availability,
        doctorId,
        data:req.user
      });
    } catch (error) {
      res.render("availability/error", {
        title: "Error",
        message: "Error fetching availability",
        error: error.message
      });
    }
  }

 async setDayOff(req, res) {
  try {
    const { weekday, isDayOff } = req.body;
    const doctorId = req.params.doctorId;

    // Convert string to Boolean if needed
    const dayOffValue = isDayOff === "true" || isDayOff === true;

    const availability = await Availability.findOneAndUpdate(
      { doctorId, weekday },
      { isDayOff: dayOffValue },
      { new: true }
    );

    if (!availability) {
      return res.render("availability/error", {
        title: "Not Found",
        message: "Availability not found for this doctor and weekday"
      });
    }

    // Redirect to list page instead of rendering create page
    res.redirect("/availability/list");

  } catch (error) {
    res.render("availability/error", {
      title: "Error",
      message: "Error updating day off",
      error: error.message
    });
  }
};


  async getAllAvailability(req, res) {
    try {
      // Fetch all availability records and populate doctor details
      const availability = await Availability.find().populate("doctorId", "name email specialization");

      // Render the list.ejs page and pass the data
      res.render("availability/list", {
        title: "All Doctors Availability",
        message: null,
        availability,
        data: req.user
      });
    } catch (error) {
      console.log(error);

    }
  };
// Render Special Day Off page
async renderSpecialDayOffPage(req, res) {
  try {
    const { doctorId } = req.params;
    const doctors = await doctorModel.find({}, "_id name email");
    const availability = await Availability.find({ doctorId });

    if (!availability || availability.length === 0) {
      return res.render("availability/error", {
        title: "Not Found",
        message: "No availability found for this doctor"
      });
    }

    res.render("availability/specialDayOff", {
      title: "Special Day Off Management",
      availability,
      doctorId,
      doctors,
      data: req.user
    });
  } catch (error) {
    res.render("availability/error", {
      title: "Error",
      message: "Error fetching availability",
      error: error.message
    });
  }
}

// Add Special Day Off
async addSpecialDayOff(req, res) {
  try {
    const { weekday, specialDay } = req.body;

    // Convert input to Date for comparison
    const selectedDate = new Date(specialDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time part

    if (selectedDate < today) {
      return res.render("availability/error", {
        title: "Invalid Date",
        message: "Cannot add a past date as special day off"
      });
    }

    // Add special day off using $addToSet to prevent duplicates
    const availability = await Availability.findOneAndUpdate(
      { doctorId: req.params.doctorId, weekday },
      { $addToSet: { specialDayOffs: specialDay } },
      { new: true }
    );

    if (!availability) {
      return res.render("availability/error", {
        title: "Not Found",
        message: "Availability not found"
      });
    }

    res.redirect(`/availability/list`);
  } catch (error) {
    res.render("availability/error", {
      title: "Error",
      message: "Error adding special day off",
      error: error.message
    });
  }
}


// Delete Special Day Off
async deleteSpecialDayOff(req, res) {
  try {
    const { weekday, specialDay } = req.body;

    const availability = await Availability.findOneAndUpdate(
      { doctorId: req.params.doctorId, weekday },
      { $pull: { specialDayOffs: specialDay } },
      { new: true }
    );

    if (!availability) {
      return res.render("availability/error", {
        title: "Not Found",
        message: "Availability not found"
      });
    }

    res.redirect(`/availability/list`);
  } catch (error) {
    res.render("availability/error", {
      title: "Error",
      message: "Error deleting special day off",
      error: error.message
    });
  }
}


}

module.exports = new AvailabilityController()