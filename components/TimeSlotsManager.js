// components/TimeSlotsManager.js
import { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function TimeSlotsManager() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: '',
    status: 'all',
    week: ''
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    loadTimeSlots();
  }, [filters]);

  const loadTimeSlots = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.date) {
        params.append('startDate', filters.date);
        params.append('endDate', filters.date);
      } else if (filters.week) {
        const startOfWeek = new Date(filters.week);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        params.append('startDate', startOfWeek.toISOString().split('T')[0]);
        params.append('endDate', endOfWeek.toISOString().split('T')[0]);
      } else {
        // Par défaut, afficher les 30 prochains jours
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        params.append('startDate', today.toISOString().split('T')[0]);
        params.append('endDate', nextMonth.toISOString().split('T')[0]);
      }

      const response = await fetch(`/api/admin/timeslots?${params}`);
      const data = await response.json();
      
      let filteredSlots = data.slots || [];
      
      // Filtrage par statut
      if (filters.status !== 'all') {
        filteredSlots = filteredSlots.filter(slot => {
          switch (filters.status) {
            case 'available':
              return slot.isAvailable && !slot.isBooked;
            case 'booked':
              return slot.isBooked;
            case 'unavailable':
              return !slot.isAvailable;
            default:
              return true;
          }
        });
      }
      
      setTimeSlots(filteredSlots);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 2);

    try {
      const response = await fetch('/api/admin/timeslots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        loadTimeSlots();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleSlotAvailability = async (slotId, currentAvailability) => {
    try {
      const response = await fetch('/api/admin/timeslots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slotId,
          isAvailable: !currentAvailability,
          reason: !currentAvailability ? null : 'Désactivé par l\'admin'
        })
      });

      if (response.ok) {
        loadTimeSlots();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteSlot = async (slotId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;

    try {
      const response = await fetch('/api/admin/timeslots', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slotId })
      });

      if (response.ok) {
        loadTimeSlots();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const bulkToggleAvailability = async (available) => {
    const promises = selectedSlots.map(slotId => {
      const slot = timeSlots.find(s => s._id === slotId);
      if (slot && !slot.isBooked) {
        return fetch('/api/admin/timeslots', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: slotId,
            isAvailable: available,
            reason: available ? null : 'Désactivé en masse'
          })
        });
      }
    });

    try {
      await Promise.all(promises);
      setSelectedSlots([]);
      loadTimeSlots();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayName = DAYS_OF_WEEK[date.getDay()];
    return `${dayName} ${date.toLocaleDateString('fr-FR')}`;
  };

  const getStatusBadge = (slot) => {
    if (slot.isBooked) {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Réservé</span>;
    }
    if (slot.isAvailable) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Disponible</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Indisponible</span>;
  };

  // Grouper les créneaux par date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const dateKey = slot.date.split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total" value={stats.total || 0} icon={CalendarIcon} color="blue" />
        <StatCard title="Disponibles" value={stats.available || 0} icon={CheckCircleIcon} color="green" />
        <StatCard title="Réservés" value={stats.booked || 0} icon={ClockIcon} color="orange" />
        <StatCard title="Indisponibles" value={stats.unavailable || 0} icon={XCircleIcon} color="red" />
      </div>

      {/* Actions et filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Actions rapides */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateSlots}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Générer créneaux</span>
            </button>
            
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Actions groupées</span>
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value, week: '' })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="week"
              value={filters.week}
              onChange={(e) => setFilters({ ...filters, week: e.target.value, date: '' })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponibles</option>
              <option value="booked">Réservés</option>
              <option value="unavailable">Indisponibles</option>
            </select>
          </div>
        </div>

        {/* Actions groupées */}
        {showBulkActions && selectedSlots.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              {selectedSlots.length} créneau(x) sélectionné(s)
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => bulkToggleAvailability(false)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Désactiver
              </button>
              <button
                onClick={() => bulkToggleAvailability(true)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activer
              </button>
              <button
                onClick={() => setSelectedSlots([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Annuler sélection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vue par date */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : Object.keys(slotsByDate).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Aucun créneau trouvé pour les filtres sélectionnés.</p>
          </div>
        ) : (
          Object.keys(slotsByDate)
            .sort()
            .map(date => (
              <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDate(date)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {slotsByDate[date].length} créneaux
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {slotsByDate[date]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(slot => (
                        <TimeSlotCard
                          key={slot._id}
                          slot={slot}
                          isSelected={selectedSlots.includes(slot._id)}
                          onSelect={(id) => {
                            if (selectedSlots.includes(id)) {
                              setSelectedSlots(selectedSlots.filter(s => s !== id));
                            } else {
                              setSelectedSlots([...selectedSlots, id]);
                            }
                          }}
                          onToggleAvailability={toggleSlotAvailability}
                          onDelete={deleteSlot}
                          showBulkActions={showBulkActions}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

// Composant pour chaque créneau
function TimeSlotCard({ slot, isSelected, onSelect, onToggleAvailability, onDelete, showBulkActions }) {
  const getCardStyle = () => {
    if (slot.isBooked) return 'border-blue-200 bg-blue-50';
    if (slot.isAvailable) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className={`relative border-2 rounded-lg p-3 transition-all ${getCardStyle()} ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      {showBulkActions && !slot.isBooked && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(slot._id)}
          className="absolute top-2 right-2 rounded border-gray-300"
        />
      )}
      
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900 mb-1">
          {slot.time}
        </div>
        
        <div className="mb-2">
          {slot.isBooked ? (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Réservé
            </span>
          ) : slot.isAvailable ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Libre
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              Bloqué
            </span>
          )}
        </div>

        {slot.consultationId && (
          <div className="text-xs text-gray-600 mb-2">
            <div className="font-medium">
              {slot.consultationId.firstName} {slot.consultationId.lastName}
            </div>
            <div>{slot.consultationId.projectType}</div>
          </div>
        )}

        {slot.reason && (
          <div className="text-xs text-gray-500 mb-2">
            {slot.reason}
          </div>
        )}

        <div className="flex justify-center space-x-1">
          {!slot.isBooked && (
            <button
              onClick={() => onToggleAvailability(slot._id, slot.isAvailable)}
              className={`p-1 rounded transition-colors ${
                slot.isAvailable
                  ? 'text-red-600 hover:bg-red-100'
                  : 'text-green-600 hover:bg-green-100'
              }`}
              title={slot.isAvailable ? 'Désactiver' : 'Activer'}
            >
              {slot.isAvailable ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          )}
          
          {!slot.isBooked && (
            <button
              onClick={() => onDelete(slot._id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Supprimer"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant StatCard réutilisable
function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}