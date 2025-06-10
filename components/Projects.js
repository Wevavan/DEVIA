import { useState, useEffect, useRef } from 'react';
import { 
  EyeIcon, 
  CodeBracketIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  RocketLaunchIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  PaintBrushIcon,
  StarIcon,
  CheckCircleIcon,
  HomeModernIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UserGroupIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  const projects = [
    {
      id: 1,
      title: "ApartBook Premium",
      subtitle: "Réservation d'appartements nouvelle génération",
      description: "Plateforme de réservation d'appartements avec IA de recommandation, visite virtuelle 360°, système de paiement sécurisé et gestion automatisée des check-in/check-out. +240% de réservations confirmées.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
      tags: ["Next.js", "Stripe", "Three.js", "MongoDB", "OpenAI"],
      type: "Web + IA",
      category: "immobilier",
      color: "from-blue-500 to-cyan-500",
      icon: HomeModernIcon,
      metrics: { bookings: "+240%", revenue: "€2.8M", satisfaction: "98%" },
      featured: true,
      technologies: ["Visite 360°", "IA Recommandation", "Paiement Stripe", "Check-in Auto"]
    },
    {
      id: 2,
      title: "CVBuilder Pro",
      subtitle: "Plateforme IA de création CV & suivi candidatures",
      description: "Solution complète avec génération automatique de CV/LM par IA, templates premium ATS-friendly, suivi intelligent des candidatures et analytics de performance. Taux d'embauche +180%.",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&crop=center",
      tags: ["React", "OpenAI GPT-4", "Node.js", "PostgreSQL", "PDF.js"],
      type: "IA + SaaS",
      category: "rh",
      color: "from-purple-500 to-pink-500",
      icon: DocumentTextIcon,
      metrics: { users: "15K+", success: "+180%", cvs: "50K+" },
      featured: true,
      technologies: ["IA GPT-4", "ATS Optimize", "Analytics Pro", "Multi-export"]
    },
    {
      id: 3,
      title: "SalonBook360",
      subtitle: "Écosystème complet salon de coiffure",
      description: "App tout-en-un avec réservation intelligente, gestion planning IA, paiement intégré, profils clients avancés et marketing automation. ROI +320% pour les salons partenaires.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center",
      tags: ["React Native", "Stripe", "Firebase", "SendGrid", "ML"],
      type: "Mobile + IA",
      category: "beauty",
      color: "from-green-500 to-emerald-500",
      icon: CalendarDaysIcon,
      metrics: { salons: "200+", revenue: "+320%", bookings: "100K+" },
      featured: false,
      technologies: ["Planning IA", "Paiement Mobile", "CRM Client", "Marketing Auto"]
    },
  ];

  const filters = [
    { id: 'all', label: 'Portfolio Complet', count: projects.length, icon: SparklesIcon },
    { id: 'featured', label: 'Projets Phares', count: projects.filter(p => p.featured).length, icon: StarIcon },
    { id: 'ai', label: 'Intelligence IA', count: projects.filter(p => p.type.includes('IA')).length, icon: SparklesIcon },
    { id: 'web', label: 'Web Premium', count: projects.filter(p => p.type.includes('Web')).length, icon: GlobeAltIcon }
  ];

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return project.featured;
    if (activeFilter === 'ai') return project.type.includes('IA');
    if (activeFilter === 'web') return project.type.includes('Web');
    return true;
  });

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredProjects]);

  const handleProjectClick = (projectId) => {
    console.log('Project clicked:', projectId);
    // Analytics tracking
  };

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="relative py-32 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Ultra Premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Mouse Glow Effect */}
        <div 
          className="absolute w-96 h-96 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08), transparent 70%)`,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.1s ease-out'
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section Ultra Premium */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full px-6 py-3 mb-8 shadow-lg">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-900">Portfolio Premium</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Projets Qui Transforment
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Les Business en Succès
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-8">
            Chaque ligne de code génère du ROI. Découvrez comment nous transformons 
            <span className="text-blue-600 font-semibold"> les idées ambitieuses</span> en 
            <span className="text-purple-600 font-semibold"> solutions rentables</span> qui révolutionnent les secteurs.
          </p>

          {/* Stats rapides */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50">
              <div className="text-2xl font-black text-blue-600">€5.1M</div>
              <div className="text-sm text-gray-600">Revenus générés</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50">
              <div className="text-2xl font-black text-purple-600">65K+</div>
              <div className="text-sm text-gray-600">Utilisateurs actifs</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50">
              <div className="text-2xl font-black text-green-600">+280%</div>
              <div className="text-sm text-gray-600">ROI moyen</div>
            </div>
          </div>
        </div>

        {/* Filters Ultra Premium */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                  : 'bg-white/90 backdrop-blur-xl text-gray-700 hover:bg-white hover:text-blue-600 border border-white/50 hover:border-blue-200 shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-3">
                <filter.icon className="w-5 h-5" />
                <span>{filter.label}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-black ${
                  activeFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  {filter.count}
                </span>
              </span>
              
              {/* Glow effect */}
              {activeFilter === filter.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30 -z-10" />
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid Ultra Premium */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              data-index={index}
              className={`group relative transition-all duration-700 cursor-pointer ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Featured Badge Ultra Premium */}
              {project.featured && (
                <div className="absolute -top-4 -right-4 z-30 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-2xl transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="w-4 h-4 fill-current" />
                    <span>BESTSELLER</span>
                  </div>
                </div>
              )}

              {/* Card Container Ultra Premium */}
              <div className="relative h-full bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-700 border border-white/50 group-hover:border-white/80 transform group-hover:scale-105 group-hover:-translate-y-4">
                
                {/* Image Section avec vraies images */}
                <div className="relative h-64 overflow-hidden">
                  {/* Image Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                      <project.icon className="w-10 h-10" />
                    </div>
                    <span className="text-sm font-black bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg">
                      {project.type}
                    </span>
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <EyeIcon className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-lg font-black">Découvrir le Projet</span>
                      <div className="text-sm opacity-80 mt-1">Cliquez pour voir les détails</div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Content Section Ultra Premium */}
                <div className="p-8 relative">
                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className={`text-sm font-bold bg-gradient-to-r ${project.color} bg-clip-text text-transparent uppercase tracking-wide`}>
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Metrics Ultra Premium */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {Object.entries(project.metrics).map(([key, value], idx) => (
                      <div key={key} className="text-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100/50 group-hover:shadow-md transition-shadow">
                        <div className={`text-lg font-black bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>
                          {value}
                        </div>
                        <div className="text-xs text-gray-500 capitalize font-medium">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Technologies Clés :</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {project.technologies.map((tech, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          <span className="text-gray-600 font-medium">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full font-bold transition-all duration-300 hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
                        +{project.tags.length - 3} techs
                      </span>
                    )}
                  </div>

                  {/* CTA Button Ultra Premium */}
                  <button className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-black transition-all duration-500 group/btn relative overflow-hidden ${
                    hoveredProject === project.id
                      ? `bg-gradient-to-r ${project.color} text-white shadow-2xl transform scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-lg hover:shadow-xl'
                  }`}>
                    <span className="relative z-10">Explorer ce Projet</span>
                    <ArrowRightIcon className="w-5 h-5 relative z-10 transition-transform group-hover/btn:translate-x-2" />
                    
                    {/* Animated background */}
                    {hoveredProject === project.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    )}
                  </button>
                </div>

                {/* Card Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500 -z-10`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Ultra Premium */}
        <div className="text-center mt-24">
          <div className="inline-flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-10 shadow-2xl hover:shadow-4xl transition-all duration-500 transform hover:scale-105">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-black text-gray-900 mb-3">Votre Projet, Notre Expertise</h3>
              <p className="text-gray-600 text-lg">Transformons votre vision en success story mesurable</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>Consultation gratuite</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>Devis sous 24h</span>
                </div>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-black py-5 px-10 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-4xl whitespace-nowrap relative overflow-hidden group">
              <span className="relative z-10 flex items-center space-x-3">
                <RocketLaunchIcon className="w-6 h-6" />
                <span>Lancer Mon Projet</span>
                <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
              
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}