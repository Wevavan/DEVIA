import { useState, useEffect, useRef } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  RocketLaunchIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  CpuChipIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export default function ContactForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState([]);
  const sectionRef = useRef(null);

  // Mouse tracking pour les effets premium
  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleElements(prev => [...prev, index]);
            }, index * 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('[data-index]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCTAClick = (ctaType) => {
    console.log('CTA clicked:', ctaType);
    // Analytics tracking
    setIsModalOpen(true);
  };

  const contactOptions = [
    {
      icon: CalendarDaysIcon,
      title: "Consultation Stratégique VIP",
      subtitle: "45 min · Gratuit · Exclusif",
      description: "Analyse complète de votre projet avec recommandations personnalisées et roadmap détaillée",
      features: ["Audit gratuit", "Stratégie sur-mesure", "Devis précis"],
      cta: "Réserver Maintenant",
      color: "from-blue-500 via-cyan-500 to-teal-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      priority: "high"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Contact Express Premium",
      subtitle: "Réponse < 2h · Support VIP",
      description: "Échange rapide pour valider la faisabilité et obtenir une première estimation",
      features: ["Réponse ultra-rapide", "Conseils experts", "Sans engagement"],
      cta: "Échanger Maintenant",
      color: "from-purple-500 via-pink-500 to-rose-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      priority: "medium"
    }
  ];

  const guarantees = [
    {
      icon: TrophyIcon,
      title: "Expertise Reconnue",
      description: "3+ ans d'expérience, plusieurs projets réussis",
      color: "text-yellow-400"
    },
    {
      icon: BoltIcon,
      title: "Livraison Express",
      description: "Développement agile, mise en ligne rapide",
      color: "text-cyan-400"
    },
    {
      icon: ShieldCheckIcon,
      title: "Garantie Résultats",
      description: "Satisfaction client ou remboursement",
      color: "text-green-400"
    },
    {
      icon: FireIcon,
      title: "Support Premium 24/7",
      description: "Maintenance et évolutions incluses",
      color: "text-orange-400"
    }
  ];

  const stats = [
    { number: "98%", label: "Clients Satisfaits", icon: "😍" },
    { number: "< 2h", label: "Temps de Réponse", icon: "⚡" },
    { number: "50+", label: "Projets Livrés", icon: "🚀" },
    { number: "24/7", label: "Support Premium", icon: "🛡️" }
  ];

  return (
    <>
      <section 
        ref={sectionRef}
        className="relative py-32 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background Ultra Premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Animated Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Mouse Glow Effect */}
          <div 
            className="absolute w-96 h-96 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15), transparent 70%)`,
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
              transition: 'all 0.1s ease-out'
            }}
          />
          
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header Section */}
          <div data-index="0" className={`text-center mb-16 transition-all duration-700 ${
            visibleElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-8">
              <SparklesIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">CONTACT</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Transformons Votre Vision
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                En Succès Digital
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Vous avez un projet ambitieux ? Je suis là pour le concrétiser. 
              <span className="text-cyan-400 font-semibold"> Consultation gratuite, résultats garantis</span>.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Options Premium */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                data-index={index + 1}
                className={`group relative transition-all duration-700 ${
                  visibleElements.includes(index + 1) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Priority Badge */}
                {option.priority === 'high' && (
                  <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-xs font-black shadow-xl">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-3 h-3 fill-current" />
                      <span>RECOMMANDÉ</span>
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden group-hover:bg-white/15">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <option.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {option.title}
                      </h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${option.color} bg-clip-text text-transparent`}>
                        {option.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-white transition-colors">
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleCTAClick(option.title)}
                      className={`group/btn w-full relative overflow-hidden bg-gradient-to-r ${option.color} hover:shadow-2xl text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105`}
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-3">
                        <span className="text-lg">{option.cta}</span>
                        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                      </span>
                      
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </button>
                  </div>

                  {/* Floating Elements */}
                  <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r ${option.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                  <div className={`absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r ${option.color} rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-500`} />
                </div>
              </div>
            ))}
          </div>

          {/* Guarantees Section */}
          <div 
            data-index="3"
            className={`transition-all duration-700 ${
              visibleElements.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Pourquoi Me Faire Confiance ?</h3>
                <p className="text-gray-300 text-lg">Des garanties concrètes pour votre tranquillité d'esprit</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {guarantees.map((guarantee, index) => (
                  <div
                    key={index}
                    className="group text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="mb-4">
                      <guarantee.icon className={`w-12 h-12 ${guarantee.color} mx-auto group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {guarantee.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {guarantee.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div 
            data-index="4"
            className={`text-center mt-16 transition-all duration-700 ${
              visibleElements.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Prêt à démarrer votre projet ?</h3>
                <p className="text-gray-300">Discutons de vos objectifs dès aujourd'hui</p>
              </div>
              <button 
                onClick={() => handleCTAClick('bottom_cta')}
                className="group bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 whitespace-nowrap"
              >
                <span className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span>Lancer le Projet</span>
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Consultation Gratuite</h3>
            <p className="text-gray-600 mb-6">Merci pour votre intérêt ! Je vous contacte dans les plus brefs délais.</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}