class availabilityController{
async getAllAvailability(req, res) {
  try {
    const availability = await Availability.find().populate(
      "doctorId",
      "name email specialization"
    );

    if (!availability || availability.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No availability found",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability fetched successfully",
      data: availability
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching availability",
      error: error.message
    });
  }
};

}
module.exports=new availabilityController()