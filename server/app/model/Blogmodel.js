const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",

    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    comment:[String],
    isApproved: { type: Boolean, default: false }
},

    { timestamps: true, })





const BlogModel = mongoose.model("Blog", BlogSchema);
module.exports = BlogModel;