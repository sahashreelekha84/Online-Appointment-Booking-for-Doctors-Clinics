const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  name: { type: String, required: true }, 
  description: String,
  permissions: [String] 
}, { timestamps: true });

module.exports = model("Role", roleSchema);
