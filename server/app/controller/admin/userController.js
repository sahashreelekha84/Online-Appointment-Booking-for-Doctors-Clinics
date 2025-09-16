const { userModel } = require("../../model/usermodel");

class userController {
    async userlist(req, res) {
        try {
            const data = await userModel.find({role:'patient'})
            res.render("user/list", { title: "patient List", data,  user: req.user });
        }
        catch (err) {

        }
    }
}
module.exports = new userController()