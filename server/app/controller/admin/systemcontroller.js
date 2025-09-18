const SystemSettings = require("../../model/systemsettingmodel");
class systemcontroller{
  async getSettings(req, res) {
    try {
      let settings = await SystemSettings.findOne();
      if (!settings) {
        settings = await SystemSettings.create({}); // default
      }
      res.render("admin/settings", {
        title: "System Settings",
        settings,
        data:req.user
      });
    } catch (err) {
      console.error(err);
      res.render("error", { message: "Failed to load settings" });
    }
  }

  async updateSettings(req, res) {
    try {
      const { maxBookingPerSlot, maxBookingPerHour, maxDailyAppointments, holidays } = req.body;

      await SystemSettings.findOneAndUpdate(
        {},
        {
          maxBookingPerSlot,
          maxBookingPerHour,
          maxDailyAppointments,
          holidays: holidays ? holidays.split(",").map(d => d.trim()) : []
        },
        { upsert: true, new: true }
      );

      res.redirect("/admin/settings");
    } catch (err) {
      console.error(err);
      res.render("error", { message: "Failed to update settings" });
    }
  }


}
module.exports=new systemcontroller()