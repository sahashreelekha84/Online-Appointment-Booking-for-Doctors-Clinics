const mongoose=require('mongoose')
const Schema=mongoose.Schema
const reportSchema = new Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true }, 
  type: { type: String, enum: ['doctor', 'system'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  reason: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
