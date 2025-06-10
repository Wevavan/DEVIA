// models/Consultation.js
import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  // Informations personnelles
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  
  // Informations du projet
  projectType: { 
    type: String, 
    required: true,
    enum: [
      'site-web-vitrine',
      'site-web-ecommerce', 
      'application-web',
      'integration-ia',
      'chatbot-ia',
      'automatisation',
      'optimisation-seo',
      'refonte-site',
      'maintenance',
      'autre'
    ]
  },
  projectName: { type: String, trim: true },
  projectDescription: { type: String, trim: true },
  budget: { 
    type: String, 
    required: true,
    enum: [
      'moins-2k',
      '2k-5k',
      '5k-10k',
      '10k-20k',
      '20k-50k',
      'plus-50k',
      'a-discuter'
    ]
  },
  timeline: { 
    type: String, 
    required: true,
    enum: [
      'urgent-1mois',
      '1-3mois',
      '3-6mois',
      '6mois-plus',
      'pas-de-rush'
    ]
  },
  
  // Informations de rendez-vous
  consultationDate: { type: Date, required: true },
  consultationTime: { 
    type: String, 
    required: true,
    enum: [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ]
  },
  consultationType: { 
    type: String, 
    required: true,
    enum: ['telephone', 'visio-zoom', 'entretien-physique']
  },
  
  // Métadonnées
  source: { type: String, default: 'website' }, // D'où vient la demande
  sourceSection: { type: String }, // Section spécifique (header, hero, services, etc.)
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Analytics et scoring
  qualificationScore: { type: Number, default: 0, min: 0, max: 100 },
  conversionProbability: { type: Number, default: 0, min: 0, max: 100 },
  
  // Notes admin
  adminNotes: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  contactedAt: { type: Date },
  scheduledAt: { type: Date }
});

// Index pour optimiser les requêtes
ConsultationSchema.index({ email: 1 });
ConsultationSchema.index({ status: 1 });
ConsultationSchema.index({ consultationDate: 1 });
ConsultationSchema.index({ priority: 1 });
ConsultationSchema.index({ createdAt: -1 });

// Middleware pour calculer le score de qualification
ConsultationSchema.pre('save', function(next) {
  if (this.isNew || this.isModified(['budget', 'timeline', 'projectType'])) {
    this.qualificationScore = this.calculateQualificationScore();
    this.conversionProbability = this.calculateConversionProbability();
  }
  this.updatedAt = new Date();
  next();
});

// Méthode pour calculer le score de qualification
ConsultationSchema.methods.calculateQualificationScore = function() {
  let score = 0;
  
  // Score basé sur le budget (40 points max)
  const budgetScores = {
    'moins-2k': 10,
    '2k-5k': 20,
    '5k-10k': 30,
    '10k-20k': 35,
    '20k-50k': 40,
    'plus-50k': 40,
    'a-discuter': 25
  };
  score += budgetScores[this.budget] || 0;
  
  // Score basé sur le timeline (30 points max)
  const timelineScores = {
    'urgent-1mois': 30,
    '1-3mois': 25,
    '3-6mois': 20,
    '6mois-plus': 15,
    'pas-de-rush': 10
  };
  score += timelineScores[this.timeline] || 0;
  
  // Score basé sur le type de projet (30 points max)
  const projectScores = {
    'site-web-ecommerce': 30,
    'application-web': 28,
    'integration-ia': 30,
    'chatbot-ia': 25,
    'site-web-vitrine': 20,
    'automatisation': 25,
    'optimisation-seo': 18,
    'refonte-site': 22,
    'maintenance': 15,
    'autre': 10
  };
  score += projectScores[this.projectType] || 0;
  
  return Math.min(score, 100);
};

// Méthode pour calculer la probabilité de conversion
ConsultationSchema.methods.calculateConversionProbability = function() {
  let probability = this.qualificationScore;
  
  // Bonus pour les informations complètes
  if (this.company) probability += 5;
  if (this.projectName) probability += 5;
  if (this.projectDescription && this.projectDescription.length > 50) probability += 10;
  
  // Bonus pour le type de consultation
  if (this.consultationType === 'entretien-physique') probability += 15;
  else if (this.consultationType === 'visio-zoom') probability += 10;
  else probability += 5;
  
  return Math.min(probability, 100);
};

// Méthode statique pour obtenir les statistiques
ConsultationSchema.statics.getStats = async function() {
  const totalConsultations = await this.countDocuments();
  const pendingConsultations = await this.countDocuments({ status: 'pending' });
  const completedConsultations = await this.countDocuments({ status: 'completed' });
  
  const avgScore = await this.aggregate([
    { $group: { _id: null, avgScore: { $avg: '$qualificationScore' } } }
  ]);
  
  const avgConversion = await this.aggregate([
    { $group: { _id: null, avgConversion: { $avg: '$conversionProbability' } } }
  ]);
  
  const statusBreakdown = await this.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const recentConsultations = await this.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName email projectType status createdAt');
  
  return {
    totalConsultations,
    pendingConsultations,
    completedConsultations,
    avgQualificationScore: Math.round(avgScore[0]?.avgScore || 0),
    avgConversionProbability: Math.round(avgConversion[0]?.avgConversion || 0),
    statusBreakdown: statusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentConsultations
  };
};

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);