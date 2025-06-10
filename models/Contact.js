// models/Contact.js
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  projectType: { type: String, required: true },
  budget: { type: String },
  message: { type: String },
  preferredCallTime: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);