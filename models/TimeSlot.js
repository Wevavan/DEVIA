// models/TimeSlot.js
import mongoose from 'mongoose';

const TimeSlotSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
    index: true
  },
  time: { 
    type: String, 
    required: true,
    enum: [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ]
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  isBooked: { 
    type: Boolean, 
    default: false 
  },
  consultationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Consultation',
    default: null
  },
  reason: { 
    type: String, // Pour indiquer pourquoi le créneau n'est pas disponible
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index composé pour éviter les doublons
TimeSlotSchema.index({ date: 1, time: 1 }, { unique: true });

// Middleware pour mettre à jour updatedAt
TimeSlotSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthode statique pour générer les créneaux d'une période
TimeSlotSchema.statics.generateSlotsForPeriod = async function(startDate, endDate) {
  const slots = [];
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Ignorer les weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      for (const time of timeSlots) {
        const existingSlot = await this.findOne({
          date: new Date(currentDate),
          time: time
        });
        
        if (!existingSlot) {
          slots.push({
            date: new Date(currentDate),
            time: time,
            isAvailable: true,
            isBooked: false
          });
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  if (slots.length > 0) {
    await this.insertMany(slots);
  }
  
  return slots.length;
};

// Méthode statique pour obtenir les créneaux disponibles
TimeSlotSchema.statics.getAvailableSlots = async function(startDate, endDate) {
  return await this.find({
    date: { $gte: startDate, $lte: endDate },
    isAvailable: true,
    isBooked: false
  }).sort({ date: 1, time: 1 });
};

// Méthode pour réserver un créneau
TimeSlotSchema.methods.book = async function(consultationId) {
  this.isBooked = true;
  this.consultationId = consultationId;
  await this.save();
};

// Méthode pour libérer un créneau
TimeSlotSchema.methods.release = async function() {
  this.isBooked = false;
  this.consultationId = null;
  await this.save();
};

export default mongoose.models.TimeSlot || mongoose.model('TimeSlot', TimeSlotSchema);