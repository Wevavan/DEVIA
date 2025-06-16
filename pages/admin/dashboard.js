// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  VideoCameraIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  EyeSlashIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// Composants utilitaires
const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, disabled = false, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const baseClasses = "inline-flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </button>
  );
};

// Composant principal Dashboard
export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [consultations, setConsultations] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [stats, setStats] = useState({});
  const [timeSlotsStats, setTimeSlotsStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    week: ''
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Chargement des données
  useEffect(() => {
    checkAuth();
    loadConsultations();
    loadTimeSlots();
  }, []);

  useEffect(() => {
    if (activeTab === 'timeslots') {
      loadTimeSlots();
    }
  }, [filters, selectedDate]);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

const loadConsultations = async () => {
  try {
    console.log('🔄 Chargement des consultations...');
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch('/api/admin/consultations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ajouter le token d'auth
      }
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.log('❌ Token invalide, redirection vers login');
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Données consultations reçues:', data);

    if (data.success) {
      setConsultations(data.consultations || []);
      setStats(data.stats || {});
    } else {
      // Si pas de success mais pas d'erreur, utiliser les données directement
      setConsultations(data.consultations || data || []);
      setStats(data.stats || {});
    }

  } catch (error) {
    console.error('❌ Erreur chargement consultations:', error);
    
    // En cas d'erreur, essayer l'API publique en fallback
    try {
      console.log('🔄 Tentative avec API publique...');
      const fallbackResponse = await fetch('/api/consultations');
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        setConsultations(fallbackData.data?.consultations || []);
        setStats(fallbackData.data?.stats || {});
        console.log('✅ Données chargées via API publique');
      }
    } catch (fallbackError) {
      console.error('❌ Erreur API publique aussi:', fallbackError);
    }
  }
};

const loadTimeSlots = async () => {
  try {
    console.log('🔄 Chargement des créneaux...');
    
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams();
    
    if (selectedDate) {
      params.append('startDate', selectedDate);
      params.append('endDate', selectedDate);
    } else if (filters.week) {
      const startOfWeek = new Date(filters.week);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      params.append('startDate', startOfWeek.toISOString().split('T')[0]);
      params.append('endDate', endOfWeek.toISOString().split('T')[0]);
    } else {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      params.append('startDate', today.toISOString().split('T')[0]);
      params.append('endDate', nextMonth.toISOString().split('T')[0]);
    }
    
    const response = await fetch(`/api/admin/timeslots?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ajouter le token d'auth
      }
    });

    console.log('📡 Response timeslots status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('❌ Token invalide pour timeslots');
        return; // Ne pas rediriger, juste ne pas charger les créneaux
      }
      throw new Error(`Erreur API timeslots: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 Données créneaux reçues:', data);
    
    let filteredSlots = data.slots || [];
    
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
    setTimeSlotsStats(data.stats || {});
    
  } catch (error) {
    console.error('❌ Erreur chargement créneaux:', error);
    // En cas d'erreur, mettre des valeurs par défaut
    setTimeSlots([]);
    setTimeSlotsStats({});
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: 'warning', label: 'En attente' },
      reviewed: { variant: 'info', label: 'Examiné' },
      contacted: { variant: 'info', label: 'Contacté' },
      scheduled: { variant: 'success', label: 'Planifié' },
      completed: { variant: 'success', label: 'Terminé' },
      cancelled: { variant: 'danger', label: 'Annulé' }
    };
    
    const config = statusMap[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getConsultationTypeIcon = (type) => {
    const icons = {
      telephone: PhoneIcon,
      'visio-zoom': VideoCameraIcon,
      'entretien-physique': MapPinIcon
    };
    const Icon = icons[type] || PhoneIcon;
    return <Icon className="w-4 h-4" />;
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
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du créneau');
    }
  };

  const deleteTimeSlot = async (slotId) => {
    try {
      const response = await fetch('/api/admin/timeslots', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slotId })
      });

      if (response.ok) {
        loadTimeSlots();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du créneau');
    }
  };

  const generateTimeSlots = async () => {
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
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération des créneaux');
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

  // Grouper les créneaux par date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const dateKey = slot.date.split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  if (loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
              { id: 'consultations', label: 'Consultations', icon: UserGroupIcon },
              { id: 'timeslots', label: 'Créneaux horaires', icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Consultations"
                value={stats.totalConsultations || 0}
                icon={UserGroupIcon}
                color="blue"
              />
              <StatCard
                title="En Attente"
                value={stats.pendingConsultations || 0}
                icon={ClockIcon}
                color="orange"
              />
              <StatCard
                title="Créneaux Disponibles"
                value={timeSlotsStats.available || 0}
                icon={CalendarIcon}
                color="green"
              />
              <StatCard
                title="Score Moyen"
                value={`${stats.avgQualificationScore || 0}%`}
                icon={ChartBarIcon}
                color="purple"
              />
            </div>

            {/* Consultations récentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Consultations Récentes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {(stats.recentConsultations || []).slice(0, 5).map((consultation) => (
                    <div key={consultation._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {consultation.firstName} {consultation.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{consultation.email}</p>
                        <p className="text-sm text-gray-500">
                          {consultation.projectType} • {formatDateTime(consultation.createdAt)}
                        </p>
                      </div>
                      {getStatusBadge(consultation.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consultations */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Toutes les Consultations ({consultations.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rendez-vous
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créé le
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consultations.map((consultation) => (
                      <tr key={consultation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {consultation.firstName} {consultation.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{consultation.email}</p>
                            {consultation.phone && (
                              <p className="text-sm text-gray-500">{consultation.phone}</p>
                            )}
                            {consultation.company && (
                              <p className="text-sm text-blue-600">{consultation.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{consultation.projectType}</p>
                            {consultation.projectName && (
                              <p className="text-sm text-gray-600">{consultation.projectName}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              Délai: {consultation.timeline}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getConsultationTypeIcon(consultation.consultationType)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(consultation.consultationDate)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {consultation.consultationTime}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {consultation.consultationType.replace('-', ' ')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-900">
                            {consultation.budget}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {consultation.qualificationScore}%
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${consultation.qualificationScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(consultation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(consultation.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des créneaux horaires */}
        {activeTab === 'timeslots' && (
          <div className="space-y-6">
            {/* Statistiques des créneaux */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Créneaux"
                value={timeSlotsStats.total || 0}
                icon={CalendarIcon}
                color="blue"
              />
              <StatCard
                title="Disponibles"
                value={timeSlotsStats.available || 0}
                icon={CheckCircleIcon}
                color="green"
              />
              <StatCard
                title="Réservés"
                value={timeSlotsStats.booked || 0}
                icon={ClockIcon}
                color="orange"
              />
              <StatCard
                title="Indisponibles"
                value={timeSlotsStats.unavailable || 0}
                icon={XCircleIcon}
                color="red"
              />
            </div>

            {/* Actions et filtres */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Actions rapides */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={generateTimeSlots} variant="primary">
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Générer créneaux (2 mois)</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setShowAddSlotModal(true)}
                    variant="success"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Ajouter un créneau</span>
                  </Button>
                  
                  <Button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    variant="secondary"
                  >
                    <FunnelIcon className="w-4 h-4" />
                    <span>Actions groupées</span>
                  </Button>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <input
                    type="week"
                    value={filters.week}
                    onChange={(e) => setFilters({ ...filters, week: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <Button
                      onClick={() => bulkToggleAvailability(false)}
                      variant="danger"
                      className="text-sm py-1 px-3"
                    >
                      Désactiver
                    </Button>
                    <Button
                      onClick={() => bulkToggleAvailability(true)}
                      variant="success"
                      className="text-sm py-1 px-3"
                    >
                      Activer
                    </Button>
                    <Button
                      onClick={() => setSelectedSlots([])}
                      variant="secondary"
                      className="text-sm py-1 px-3"
                    >
                      Annuler sélection
                    </Button>
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
                                onDelete={deleteTimeSlot}
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
        )}
      </main>

      {/* Modal d'ajout de créneau */}
      {showAddSlotModal && (
        <AddSlotModal
          onClose={() => setShowAddSlotModal(false)}
          onSuccess={() => {
            setShowAddSlotModal(false);
            loadTimeSlots();
          }}
        />
      )}
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
            <div>{slot.consultationId.email}</div>
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

// Modal d'ajout de créneau
function AddSlotModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '09:00',
    isAvailable: true,
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/timeslots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du créneau');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Ajouter un créneau
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure *
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Disponible</span>
              </label>
            </div>

            {!formData.isAvailable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Pourquoi ce créneau n'est-il pas disponible ?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}