// models/Analytics.js
import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'page_view', 'cta_click', 'project_click'
  page: { type: String },
  ctaType: { type: String },
  projectId: { type: String },
  userAgent: { type: String },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);