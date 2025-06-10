// pages/admin/dashboard.js
import { useState, useEffect, useRef } from 'react';
import { 
  EyeIcon, 
  CursorArrowRaysIcon, 
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  BellIcon,
  CogIcon,
  PowerIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  SparklesIcon,
  RocketLaunchIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [consultationStats, setConsultationStats] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const dashboardRef = useRef(null);

  // Charger les données
  useEffect(() => {
    loadDashboardData();
  }, [activeTab, timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Charger les stats générales
      if (activeTab === 'overview') {
        // Mock data pour les stats générales
        setStats({
          pageViews: 15847,
          ctaClicks: 428,
          projectClicks: 189,
          conversionRate: 3.2,
          totalRevenue: 68500,
          avgSessionTime: '4m 12s',
          bounceRate: 19.8,
          topPages: [
            { page: '/consultation', views: 4521, change: +28.5 },
            { page: '/projets', views: 3876, change: +12.7 },
            { page: '/services', views: 2987, change: +8.3 }
          ]
        });
      }

      // Charger les consultations
      if (activeTab === 'consultations') {
        const consultationResponse = await fetch('/api/admin/consultations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (consultationResponse.ok) {
          const consultationData = await consultationResponse.json();
          setConsultations(consultationData.data.consultations);
          setConsultationStats(consultationData.data.stats);
        }
      }

      // Charger les contacts (existant)
      if (activeTab === 'contacts') {
        const contactResponse = await fetch('/api/admin/contacts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          setContacts(contactData.data || []);
        }
      }

    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  const updateConsultationStatus = async (consultationId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/consultations?id=${consultationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadDashboardData(); // Recharger les données
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const exportConsultations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/consultations?export=csv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || consultation.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-500';
      case 'reviewed': return 'bg-blue-500';
      case 'contacted': return 'bg-purple-500';
      case 'scheduled': return 'bg-cyan-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'reviewed': 'Analysé',
      'contacted': 'Contacté',
      'scheduled': 'Planifié',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <SparklesIcon className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chargement du Dashboard</h3>
          <p className="text-gray-600">Préparation de vos données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" ref={dashboardRef}>
      {/* Header Premium */}
      <header className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/50 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <RocketLaunchIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Dashboard Premium</h1>
                <p className="text-sm text-gray-500">Tableau de bord administrateur</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative"
                >
                  <BellIcon className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {consultations.filter(c => c.status === 'pending').length}
                  </span>
                </button>
              </div>

              {/* Settings */}
              <button className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <CogIcon className="w-5 h-5 text-gray-600" />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <PowerIcon className="w-4 h-4" />
                <span className="font-semibold">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-2xl p-1">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
              { id: 'consultations', label: 'Consultations', icon: AcademicCapIcon },
              { id: 'contacts', label: 'Contacts', icon: UserGroupIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.id === 'consultations' && consultations.filter(c => c.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {consultations.filter(c => c.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Vues de Page',
                  value: stats?.pageViews?.toLocaleString() || '0',
                  change: '+12.3%',
                  icon: EyeIcon,
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-500/10 to-cyan-500/10'
                },
                {
                  title: 'Consultations',
                  value: consultations?.length || '0',
                  change: '+28.7%',
                  icon: AcademicCapIcon,
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-500/10 to-emerald-500/10'
                },
                {
                  title: 'Taux Conversion',
                  value: `${stats?.conversionRate || '0'}%`,
                  change: '+2.1%',
                  icon: ArrowTrendingUpIcon,
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-500/10 to-pink-500/10'
                },
                {
                  title: 'Revenus',
                  value: `${(stats?.totalRevenue || 0).toLocaleString()}€`,
                  change: '+15.2%',
                  icon: CurrencyEuroIcon,
                  color: 'from-orange-500 to-red-500',
                  bgColor: 'from-orange-500/10 to-red-500/10'
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-bold">{stat.change}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Onglet Consultations */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            {/* Stats Consultations */}
            {consultationStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{consultationStats.totalConsultations}</h3>
                      <p className="text-sm text-gray-600 font-medium">Total Consultations</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{consultationStats.avgQualificationScore}%</h3>
                      <p className="text-sm text-gray-600 font-medium">Score Moyen</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <TrophyIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{consultationStats.statusBreakdown?.pending || 0}</h3>
                      <p className="text-sm text-gray-600 font-medium">En Attente</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{consultationStats.avgConversionProbability}%</h3>
                      <p className="text-sm text-gray-600 font-medium">Taux Conversion</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Consultations Table */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Demandes de Consultation</h2>
                    <p className="text-gray-600">Gestion des consultations gratuites</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Search */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="reviewed">Analysé</option>
                      <option value="contacted">Contacté</option>
                      <option value="scheduled">Planifié</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Toutes priorités</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">Haute</option>
                      <option value="medium">Moyenne</option>
                      <option value="low">Basse</option>
                    </select>
                    
                    {/* Export */}
                    <button 
                      onClick={exportConsultations}
                      className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Projet</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Priorité</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredConsultations.map((consultation) => (
                      <tr key={consultation._id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-bold text-gray-900">{consultation.firstName} {consultation.lastName}</div>
                            {consultation.company && <div className="text-sm text-gray-600">{consultation.company}</div>}
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <EnvelopeIcon className="w-3 h-3" />
                              <span>{consultation.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <PhoneIcon className="w-3 h-3" />
                              <span>{consultation.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">{consultation.projectName}</div>
                            <div className="text-sm text-purple-600">{consultation.projectType}</div>
                            <div className="text-xs text-gray-500">via {consultation.source}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-green-600">{consultation.budget}</div>
                          <div className="text-xs text-gray-500">{consultation.timeline}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-12 h-2 rounded-full bg-gray-200 overflow-hidden`}>
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  consultation.qualificationScore >= 80 ? 'bg-green-500' :
                                  consultation.qualificationScore >= 60 ? 'bg-yellow-500' :
                                  consultation.qualificationScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${consultation.qualificationScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{consultation.qualificationScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(consultation.priority)}`}>
                            {consultation.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(consultation.status)}`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              {getStatusLabel(consultation.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {consultation.status === 'pending' && (
                              <button 
                                onClick={() => updateConsultationStatus(consultation._id, 'contacted')}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Marquer comme contacté"
                              >
                                <PhoneIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                              <EnvelopeIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                              <ArrowRightIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredConsultations.length === 0 && (
                  <div className="text-center py-12">
                    <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune consultation</h3>
                    <p className="text-gray-500">Aucune consultation ne correspond aux filtres sélectionnés.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Contacts (existant) */}
        {activeTab === 'contacts' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Demandes de Contact</h2>
              <p className="text-gray-600">Formulaires de contact classiques</p>
            </div>
            {/* Table des contacts existante */}
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">Section contacts existante à conserver...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}