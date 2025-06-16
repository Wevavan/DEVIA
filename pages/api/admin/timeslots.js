// pages/api/admin/timeslots.js
import dbConnect from '../../../lib/mongodb';
import TimeSlot from '../../../models/TimeSlot';

export default async function handler(req, res) {
  try {
    await dbConnect();

    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}

// GET - Récupérer les créneaux
async function handleGet(req, res) {
  const { startDate, endDate, page = 1, limit = 50 } = req.query;
  
  const filter = {};
  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [slots, total] = await Promise.all([
    TimeSlot.find(filter)
      .populate('consultationId', 'firstName lastName email phone projectType')
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit)),
    TimeSlot.countDocuments(filter)
  ]);

  // Statistiques
  const stats = await TimeSlot.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        available: { $sum: { $cond: [{ $and: ['$isAvailable', { $not: '$isBooked' }] }, 1, 0] } },
        booked: { $sum: { $cond: ['$isBooked', 1, 0] } },
        unavailable: { $sum: { $cond: [{ $not: '$isAvailable' }, 1, 0] } }
      }
    }
  ]);

  res.status(200).json({
    slots,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    stats: stats[0] || { total: 0, available: 0, booked: 0, unavailable: 0 }
  });
}

// POST - Créer/Générer des créneaux
async function handlePost(req, res) {
  const { action, startDate, endDate, date, time, isAvailable, reason } = req.body;

  if (action === 'generate') {
    // Générer automatiquement les créneaux pour une période
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate et endDate requis pour la génération' });
    }

    const created = await TimeSlot.generateSlotsForPeriod(
      new Date(startDate),
      new Date(endDate)
    );

    return res.status(201).json({ 
      message: `${created} créneaux générés avec succès`,
      created 
    });
  }

  // Créer un créneau spécifique
  if (!date || !time) {
    return res.status(400).json({ message: 'Date et heure requises' });
  }

  const existingSlot = await TimeSlot.findOne({ date: new Date(date), time });
  if (existingSlot) {
    return res.status(400).json({ message: 'Ce créneau existe déjà' });
  }

  const slot = new TimeSlot({
    date: new Date(date),
    time,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    reason
  });

  await slot.save();
  
  res.status(201).json({ 
    message: 'Créneau créé avec succès',
    slot 
  });
}

// PUT - Modifier un créneau
async function handlePut(req, res) {
  const { id, isAvailable, reason } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID du créneau requis' });
  }

  const slot = await TimeSlot.findById(id);
  if (!slot) {
    return res.status(404).json({ message: 'Créneau non trouvé' });
  }

  // Vérifier si le créneau est réservé
  if (slot.isBooked && isAvailable === false) {
    return res.status(400).json({ 
      message: 'Impossible de désactiver un créneau réservé. Annulez d\'abord la consultation.' 
    });
  }

  slot.isAvailable = isAvailable !== undefined ? isAvailable : slot.isAvailable;
  slot.reason = reason !== undefined ? reason : slot.reason;

  await slot.save();

  res.status(200).json({ 
    message: 'Créneau modifié avec succès',
    slot 
  });
}

// DELETE - Supprimer un créneau
async function handleDelete(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID du créneau requis' });
  }

  const slot = await TimeSlot.findById(id);
  if (!slot) {
    return res.status(404).json({ message: 'Créneau non trouvé' });
  }

  if (slot.isBooked) {
    return res.status(400).json({ 
      message: 'Impossible de supprimer un créneau réservé. Annulez d\'abord la consultation.' 
    });
  }

  await TimeSlot.findByIdAndDelete(id);

  res.status(200).json({ 
    message: 'Créneau supprimé avec succès' 
  });
}