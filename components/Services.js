import { useState, useEffect, useRef } from 'react';
import { 
  CodeBracketIcon, 
  SparklesIcon, 
  CogIcon, 
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export default function Services() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  const services = [
    {
      icon: CodeBracketIcon,
      title: "Développement Web",
      subtitle: "Sites & Applications",
      description: "Sites web modernes, responsives et performants avec les dernières technologies React, Next.js et Node.js pour une expérience utilisateur exceptionnelle.",
      features: ["Design Responsive", "SEO Optimisé", "Performance 98%+"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      delay: 0
    },
    {
      icon: SparklesIcon,
      title: "Intelligence Artificielle",
      subtitle: "IA & Automatisation",
      description: "Chatbots intelligents, automatisation des processus, analyse de données et solutions d'IA personnalisées pour transformer votre business.",
      features: ["Chatbots IA", "ML & Analytics", "Automatisation"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      delay: 100
    },
    {
      icon: CogIcon,
      title: "Optimisation",
      subtitle: "Performance & Sécurité",
      description: "Amélioration des performances, sécurité renforcée et maintenance continue pour garantir la fiabilité de vos solutions digitales.",
      features: ["Monitoring 24/7", "Sécurité Avancée", "Maintenance Pro"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      delay: 200
    },
    {
      icon: RocketLaunchIcon,
      title: "Déploiement",
      subtitle: "Mise en Production",
      description: "Déploiement cloud, formation complète et support technique premium pour assurer le succès total de votre projet digital.",
      features: ["Cloud AWS/Vercel", "Formation Équipe", "Support VIP"],
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      delay: 300
    }
  ];

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, services[index].delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background Premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section Full Width */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Transformez Votre Vision 
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              En Succès Digital
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
            Vous avez une idée ? Nous la concrétisons. Vous voulez dominer votre marché ? 
            Nous créons les outils qui feront la différence. Résultats garantis.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Background avec Glass Effect */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-white/80">
                
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Premium */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors"
                        style={{ animationDelay: `${visibleCards.includes(index) ? idx * 100 : 0}ms` }}
                      >
                        <CheckCircleIcon className={`w-4 h-4 mr-3 text-green-500 ${visibleCards.includes(index) ? 'animate-bounce' : ''}`} />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 group/btn ${
                    hoveredCard === index
                      ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <span>En savoir plus</span>
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>

                {/* Floating Elements */}
                <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r ${service.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r ${service.color} rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-500`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-6 h-6 text-yellow-500" />
              <span className="font-semibold text-gray-900">Prêt à transformer votre projet ?</span>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="flex items-center space-x-2">
                <span>Consultation Gratuite</span>
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}