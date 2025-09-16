const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Role = require("../model/role");
const { userModel } = require("../model/usermodel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.my_email || "shreelekhasaha2000@gmail.com",
    pass: process.env.my_password || "cvmgyapcgnbtnkrz",
  },
});

const seedAdmin = async () => {
  try {
    const email = "sourao113@yopmail.com";

    // Generate random one-time password
    const password = Math.random().toString(36).slice(-8);
    const hashedpassword = await bcrypt.hash(password, 10);

    // find admin role
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      console.log("⚠️ Admin role not found. Run role seeding first.");
      return;
    }

    // check if admin already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      console.log("Admin already exists:", exists.email);
      return;
    }

   
    await userModel.create({
      name: "Shreelekha Saha", 
      email,
      password: hashedpassword,
      firstLogin: true,
      roleId: adminRole._id,
    });

    // send password email
    await transporter.sendMail({
      from: process.env.my_email || "shreelekhasaha2000@gmail.com",
      to: email,
      subject: "Your Admin One-Time Password",
      text: `Hello Super Admin,\n\nYour one-time password for first login is: ${password}\n\nPlease change it after logging in.`,
    });

    console.log(`Admin created with email: ${email}, OTP sent.`);
  } catch (err) {
    console.error("Admin seeding failed:", err.message);
  }
};

module.exports = seedAdmin;
