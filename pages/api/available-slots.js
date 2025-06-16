// pages/api/available-slots.js
import dbConnect from '../../lib/mongodb';
import TimeSlot from '../../models/TimeSlot';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Calculer la période (20 jours ouvrés à partir de demain)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30); // 30 jours pour être sûr d'avoir 20 jours ouvrés

    // Générer automatiquement les créneaux s'ils n'existent pas
    await TimeSlot.generateSlotsForPeriod(tomorrow, endDate);

    // Récupérer les créneaux disponibles
    const availableSlots = await TimeSlot.getAvailableSlots(tomorrow, endDate);

    // Grouper par date
    const slotsByDate = {};
    availableSlots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push(slot.time);
    });

    // Limiter à 10 dates avec des créneaux disponibles
    const availableDates = Object.keys(slotsByDate)
      .slice(0, 10)
      .map(dateKey => ({
        date: dateKey,
        times: slotsByDate[dateKey].sort()
      }));

    res.status(200).json({
      availableDates,
      totalSlots: availableSlots.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}