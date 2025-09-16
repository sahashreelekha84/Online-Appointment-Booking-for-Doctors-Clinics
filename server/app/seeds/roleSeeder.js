// utils/seedRoles.js
const Role = require("../model/role");

const createRoles = async () => {
  const roles = [
    {
      name: "patient",
      permissions: ["view-appointments", "book-appointment", "message-doctor"],
    },
    {
      name: "doctor",
      permissions: [
        "manage-appointments",
        "view-patients",
        "write-prescriptions",
        "message-patient",
      ],
    },
    {
      name: "admin",
      permissions: [
        "create-doctor",
        "create-patient",
        "view-all-users",
        "manage-subscriptions",
        "manage-resources",
        "view-analytics",
      ],
    },
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ name: role.name });
    if (!exists) {
      await Role.create(role);
      console.log(`Role ${role.name} created`);
    } else {
      console.log(`Role ${role.name} already exists`);
    }
  }

  //console.log("All roles seeded successfully!");
};

module.exports = createRoles;
