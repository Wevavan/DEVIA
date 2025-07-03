import { useState, useEffect } from 'react';
import { 
  PlayIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  BoltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import ConsultationModal from './ConsultationModal'; // Import de la modal de consultation

export default function PremiumHero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('hero');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCTAClick = (ctaType) => {
    console.log('CTA clicked:', ctaType);
    
    // Analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'cta_click', 
        ctaType: ctaType,
        page: 'home',
        section: 'hero'
      })
    });

    // Ouvrir la modal de consultation
    setModalSource(ctaType);
    setIsConsultationModalOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (isVideoModalOpen) {
        setIsVideoModalOpen(false);
      }
      if (isConsultationModalOpen) {
        setIsConsultationModalOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isVideoModalOpen || isConsultationModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isVideoModalOpen, isConsultationModalOpen]);

  const stats = [
    { number: '50+', label: 'Projets Réalisés', icon: RocketLaunchIcon },
    { number: '98%', label: 'Clients Satisfaits', icon: StarIcon },
    { number: '24h', label: 'Support Réactif', icon: BoltIcon }
  ];

  const metrics = [
    { label: 'Performance', value: '98%', color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'SEO Score', value: '95%', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Accessibilité', value: '100%', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Bonnes Pratiques', value: '94%', color: 'text-cyan-400', bg: 'bg-cyan-400/10' }
  ];

  const techStack = [
    { name: 'React', color: 'from-blue-400 to-cyan-500' },
    { name: 'Next.js', color: 'from-gray-600 to-gray-800' },
    { name: 'AI/ML', color: 'from-purple-400 to-pink-500' },
    { name: 'Node.js', color: 'from-green-400 to-emerald-500' },
    { name: 'Python', color: 'from-yellow-400 to-orange-500' }
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Background - Optimisé */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
          
          {/* Floating Orbs - Performance améliorée */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse will-change-transform" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse will-change-transform" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse will-change-transform" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className={`text-white space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Status Badge */}
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-300">Disponible pour nouveaux projets</span>
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                </div>

                {/* Main Heading */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                    <span className="block bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                      Sites Web
                    </span>
                    <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      × Intelligence
                    </span>
                    <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                      Artificielle
                    </span>
                  </h1>
                  
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
                    <span className="text-lg font-bold tracking-wider uppercase">Premium Solutions</span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Développeur expert en <span className="text-cyan-400 font-semibold">technologies web avancées</span> et 
                  <span className="text-purple-400 font-semibold"> intelligence artificielle</span>. 
                  Je transforme vos idées en solutions digitales performantes qui génèrent des résultats.
                </p>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center space-y-2">
                      <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <button
                    onClick={() => handleCTAClick('hero_main_cta')}
                    className="group w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                    aria-label="Démarrer votre projet web premium"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <span className="text-lg">Démarrer Mon Projet</span>
                      <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="flex -space-x-2" role="img" aria-label="Avatars de clients satisfaits">
                      {[
                        'bg-gradient-to-r from-cyan-400 to-blue-500',
                        'bg-gradient-to-r from-purple-400 to-pink-500',
                        'bg-gradient-to-r from-green-400 to-emerald-500',
                        'bg-gradient-to-r from-orange-400 to-red-500'
                      ].map((gradient, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-8 rounded-full border-2 border-slate-900 ${gradient}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">+20 clients satisfaits</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="flex space-x-1" role="img" aria-label="5 étoiles sur 5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.9/5 sur Google</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className={`relative lg:pl-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '0.3s' }}>
                {/* Main Visual Container */}
                <div className="relative">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-3xl rotate-6" />
                  
                  {/* Main Card */}
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                    {/* Browser Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                      </div>
                      <div className="text-white/60 text-sm font-mono hidden sm:block">portfolio-premium.dev</div>
                    </div>

                    {/* Code Preview */}
                    <div className="space-y-4 text-sm font-mono overflow-x-auto">
                      <div className="text-purple-400">const <span className="text-cyan-400">solution</span> = {`{`}</div>
                      <div className="pl-4 space-y-2">
                        <div><span className="text-orange-400">web</span>: <span className="text-green-400">'React + Next.js'</span>,</div>
                        <div><span className="text-orange-400">ai</span>: <span className="text-green-400">'GPT-4 + Machine Learning'</span>,</div>
                        <div><span className="text-orange-400">performance</span>: <span className="text-green-400">'99% PageSpeed'</span>,</div>
                        <div><span className="text-orange-400">seo</span>: <span className="text-green-400">'Top 3 Google'</span></div>
                      </div>
                      <div className="text-purple-400">{`};`}</div>
                      
                      {/* Terminal Style Output */}
                      <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/10">
                        <div className="text-green-400 text-xs space-y-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>$ deploying to production...</span>
                          </div>
                          <div className="text-white/60">✓ Build completed in 2.3s</div>
                          <div className="text-white/60">✓ Performance: 98/100</div>
                          <div className="text-white/60">✓ SEO: 95/100</div>
                          <div className="text-cyan-400">🚀 Live at: https://yoursite.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Dashboard */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      {metrics.map((metric, index) => (
                        <div key={index} className={`${metric.bg} rounded-xl p-4 text-center border border-white/10`}>
                          <div className={`text-xl sm:text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                          <div className="text-white/60 text-xs">{metric.label}</div>
                          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div 
                              className={`h-full bg-current rounded-full ${metric.color} transition-all duration-1000`}
                              style={{ 
                                width: isVisible ? metric.value : '0%',
                                transitionDelay: `${0.5 + index * 0.1}s`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80 animate-bounce shadow-lg shadow-cyan-500/25" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse shadow-lg shadow-purple-500/25" />
                  
                  {/* Code Floating Icons */}
                  <div className="absolute top-1/4 -left-4 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white font-mono text-xs hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ animation: 'float 3s ease-in-out infinite' }}>
                    {'</>'}
                  </div>
                  <div className="absolute bottom-1/3 -right-4 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white font-mono text-xs hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ animation: 'float 3s ease-in-out infinite 0.3s' }}>
                    {'{}'}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex justify-center space-x-3 sm:space-x-6 mt-12 flex-wrap gap-3">
                  {techStack.map((tech, index) => (
                    <div
                      key={tech.name}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center text-white font-bold text-xs hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ 
                        transitionDelay: `${0.8 + index * 0.1}s`
                      }}
                      title={tech.name}
                    >
                      {tech.name.slice(0, 3)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2 text-white/60">
            <span className="text-sm font-medium">Découvrez mes services</span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Fermer la modal"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="text-white text-center p-8">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <PlayIcon className="w-12 h-12 opacity-80" />
                </div>
                <h2 id="video-modal-title" className="text-xl font-semibold mb-2">Vidéo de démonstration</h2>
                <p className="text-gray-400">Découvrez comment je transforme vos idées en réalité</p>
                <button 
                  className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                  onClick={() => handleCTAClick('video_demo')}
                >
                  Voir la démonstration complète
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Consultation */}
      <ConsultationModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        source="website"
        sourceSection={modalSource}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}