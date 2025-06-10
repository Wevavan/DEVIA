// components/ConsultationModal.js
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  PhoneIcon, 
  VideoCameraIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function ConsultationModal({ 
  isOpen, 
  onClose, 
  source = 'website',
  sourceSection = 'general'
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Infos personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    
    // Projet
    projectType: '',
    projectName: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    
    // Consultation
    consultationDate: '',
    consultationTime: '',
    consultationType: 'telephone',
    
    // Meta
    source: source,
    sourceSection: sourceSection
  });

  const projectTypes = [
    { value: 'site-web-vitrine', label: 'Site Web Vitrine', icon: '🌐' },
    { value: 'site-web-ecommerce', label: 'Site E-commerce', icon: '🛒' },
    { value: 'application-web', label: 'Application Web', icon: '💻' },
    { value: 'integration-ia', label: 'Intégration IA', icon: '🤖' },
    { value: 'chatbot-ia', label: 'Chatbot IA', icon: '💬' },
    { value: 'automatisation', label: 'Automatisation', icon: '⚡' },
    { value: 'optimisation-seo', label: 'Optimisation SEO', icon: '📈' },
    { value: 'refonte-site', label: 'Refonte de Site', icon: '🔄' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'autre', label: 'Autre Projet', icon: '✨' }
  ];

  const budgetRanges = [
    { value: 'moins-2k', label: 'Moins de 2 000€' },
    { value: '2k-5k', label: '2 000€ - 5 000€' },
    { value: '5k-10k', label: '5 000€ - 10 000€' },
    { value: '10k-20k', label: '10 000€ - 20 000€' },
    { value: '20k-50k', label: '20 000€ - 50 000€' },
    { value: 'plus-50k', label: 'Plus de 50 000€' },
    { value: 'a-discuter', label: 'À discuter' }
  ];

  const timelines = [
    { value: 'urgent-1mois', label: 'Urgent (< 1 mois)' },
    { value: '1-3mois', label: '1 à 3 mois' },
    { value: '3-6mois', label: '3 à 6 mois' },
    { value: '6mois-plus', label: '6 mois et plus' },
    { value: 'pas-de-rush', label: 'Pas de contrainte' }
  ];

  const consultationTypes = [
    { 
      value: 'telephone', 
      label: 'Appel Téléphonique', 
      icon: PhoneIcon,
      description: 'Entretien par téléphone (30-45 min)'
    },
    { 
      value: 'visio-zoom', 
      label: 'Visioconférence Zoom', 
      icon: VideoCameraIcon,
      description: 'Appel vidéo avec partage d\'écran (45-60 min)'
    },
    { 
      value: 'entretien-physique', 
      label: 'Rendez-vous Physique', 
      icon: MapPinIcon,
      description: 'Rencontre en personne à Paris (60-90 min)'
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Réinitialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
      setFormData(prev => ({
        ...prev,
        source: source,
        sourceSection: sourceSection
      }));
    }
  }, [isOpen, source, sourceSection]);

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Générer les 14 prochains jours (sauf weekends)
    for (let i = 1; i <= 20; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Exclure les weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
        if (dates.length >= 10) break; // Limiter à 10 dates
      }
    }
    
    return dates;
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        
        // Analytics
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'consultation_request', 
            source: source,
            sourceSection: sourceSection,
            projectType: formData.projectType,
            budget: formData.budget
          })
        });
        
        // Fermer la modal après 3 secondes
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setStep(1);
          setFormData({
            firstName: '', lastName: '', email: '', phone: '', company: '',
            projectType: '', projectName: '', projectDescription: '', budget: '', timeline: '',
            consultationDate: '', consultationTime: '', consultationType: 'telephone',
            source: source, sourceSection: sourceSection
          });
        }, 3000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone;
  };

  const canProceedToStep3 = () => {
    return formData.projectType && formData.budget && formData.timeline;
  };

  const canSubmit = () => {
    return formData.consultationDate && formData.consultationTime && formData.consultationType;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-cyan-600/90"></div>
          
          <div className="relative flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Consultation Gratuite</h2>
                <p className="text-blue-100">Étape {step} sur 3 - {
                  step === 1 ? 'Vos informations' :
                  step === 2 ? 'Votre projet' : 'Planification'
                }</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative mt-6">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          
          {/* Success State */}
          {isSuccess && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Demande Envoyée ! 🎉</h3>
              <p className="text-gray-600 text-lg mb-2">
                Merci {formData.firstName} ! Votre demande de consultation a été reçue.
              </p>
              <p className="text-gray-500">
                Vous recevrez un email de confirmation et je vous contacterai sous 24h.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                <p className="text-blue-800 font-semibold">
                  📅 Rendez-vous prévu : {formatDate(new Date(formData.consultationDate))} à {formData.consultationTime}
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Informations personnelles */}
          {!isSuccess && step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <UserIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vos Informations</h3>
                <p className="text-gray-600">Pour que je puisse vous contacter efficacement</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Entreprise (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Projet */}
          {!isSuccess && step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <BriefcaseIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Votre Projet</h3>
                <p className="text-gray-600">Dites-moi en plus sur ce que vous souhaitez réaliser</p>
              </div>

              {/* Type de projet */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Type de projet *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('projectType', type.value)}
                      className={`p-4 border-2 rounded-xl text-left transition-all hover:border-blue-300 ${
                        formData.projectType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-semibold text-gray-900">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Budget envisagé *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {budgetRanges.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => handleInputChange('budget', budget.value)}
                      className={`p-3 border-2 rounded-xl text-left transition-all hover:border-green-300 ${
                        formData.budget === budget.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold text-gray-900">{budget.label}</span>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Timeline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Délai souhaité *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timelines.map((timeline) => (
                    <button
                      key={timeline.value}
                      onClick={() => handleInputChange('timeline', timeline.value)}
                      className={`p-3 border-2 rounded-xl text-left transition-all hover:border-orange-300 ${
                        formData.timeline === timeline.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold text-gray-900">{timeline.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nom et description du projet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du projet (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Ex: Mon site e-commerce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Décrivez brièvement votre projet..."
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  ← Retour
                </button>
                
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Planification */}
          {!isSuccess && step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CalendarIcon className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Planification</h3>
                <p className="text-gray-600">Choisissons le meilleur moment pour notre échange</p>
              </div>

              {/* Type de consultation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Type de consultation *
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {consultationTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('consultationType', type.value)}
                      className={`p-4 border-2 rounded-xl text-left transition-all hover:border-cyan-300 ${
                        formData.consultationType === type.value
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{type.label}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Date souhaitée *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAvailableDates().map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleInputChange('consultationDate', date.toISOString().split('T')[0])}
                      className={`p-3 border-2 rounded-xl text-center transition-all hover:border-blue-300 ${
                        formData.consultationDate === date.toISOString().split('T')[0]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDate(date)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Heure */}
              {formData.consultationDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Heure préférée *
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleInputChange('consultationTime', time)}
                        className={`p-3 border-2 rounded-xl text-center font-semibold transition-all hover:border-green-300 ${
                          formData.consultationTime === time
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Récapitulatif */}
              {formData.consultationDate && formData.consultationTime && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <SparklesIcon className="w-5 h-5 text-blue-600 mr-2" />
                    Récapitulatif de votre consultation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {consultationTypes.find(t => t.value === formData.consultationType)?.label}</p>
                    <p><strong>Date:</strong> {formatDate(new Date(formData.consultationDate))}</p>
                    <p><strong>Heure:</strong> {formData.consultationTime}</p>
                    <p><strong>Projet:</strong> {projectTypes.find(p => p.value === formData.projectType)?.label}</p>
                    <p><strong>Budget:</strong> {budgetRanges.find(b => b.value === formData.budget)?.label}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  ← Retour
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isSubmitting}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Confirmer la Consultation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}