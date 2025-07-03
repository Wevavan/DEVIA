import { useState, useEffect, useRef } from 'react';
import { 
  CpuChipIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CodeBracketIcon,
  SparklesIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  BoltIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState([]);
  const footerRef = useRef(null);

  // Mouse tracking pour les effets premium
  const handleMouseMove = (e) => {
    const rect = footerRef.current?.getBoundingClientRect();
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
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = footerRef.current?.querySelectorAll('[data-index]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const services = [
    { 
      name: "Développement Web Premium", 
      href: "#", 
      icon: CodeBracketIcon,
      description: "Sites haute performance"
    },
    { 
      name: "Intelligence Artificielle", 
      href: "#", 
      icon: SparklesIcon,
      description: "Solutions IA sur-mesure"
    },
    { 
      name: "Optimisation & SEO", 
      href: "#", 
      icon: RocketLaunchIcon,
      description: "Performance maximale"
    },
    { 
      name: "Maintenance VIP", 
      href: "#", 
      icon: WrenchScrewdriverIcon,
      description: "Support 24/7"
    }
  ];

  const quickLinks = [
    { name: "Services", href: "#services" },
    { name: "Projets", href: "#projects" },
    { name: "À Propos", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "FAQ", href: "#faq" },
    { name: "Conditions", href: "#terms" }
  ];

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: "Email Premium",
      value: "i.wevavan.gbenou@gmail.com",
      href: "mailto:i.wevavan.gbenou@gmail.com",
      color: "text-cyan-400"
    },
    {
      icon: PhoneIcon,
      label: "Téléphone",
      value: "+33 6 62 70 45 80",
      href: "tel:+33612345678",
      color: "text-purple-400"
    },
    {
      icon: MapPinIcon,
      label: "Localisation",
      value: "Paris, France",
      href: "#",
      color: "text-pink-400"
    }
  ];

  const guarantees = [
    { icon: BoltIcon, text: "Réponse < 2h", color: "text-yellow-400" },
    { icon: ShieldCheckIcon, text: "Garantie Satisfait", color: "text-green-400" },
    { icon: ClockIcon, text: "Support 24/7", color: "text-blue-400" },
    { icon: StarIcon, text: "Qualité Premium", color: "text-orange-400" }
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "#",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-400 hover:to-blue-500",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      href: "#",
      color: "from-gray-700 to-gray-800",
      hoverColor: "hover:from-gray-600 hover:to-gray-700",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "#",
      color: "from-sky-500 to-sky-600",
      hoverColor: "hover:from-sky-400 hover:to-sky-500",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    }
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
      id="contact"
    >
      {/* Background Ultra Premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Mouse Glow Effect */}
        <div 
          className="absolute w-96 h-96 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1), transparent 70%)`,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.1s ease-out'
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-20">
        {/* Header Section */}
        <div 
          data-index="0"
          className={`text-center mb-16 transition-all duration-700 ${
            visibleElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              DevIA Pro
            </h3>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Votre partenaire digital pour des <span className="text-cyan-400 font-semibold">solutions web premium</span> et 
            <span className="text-purple-400 font-semibold"> intelligence artificielle avancée</span>. 
            Transformons ensemble vos idées en succès digitaux.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* Services Premium */}
          <div 
            data-index="1"
            className={`lg:col-span-2 transition-all duration-700 ${
              visibleElements.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-2xl font-bold text-white mb-8 flex items-center space-x-2">
              <SparklesIcon className="w-6 h-6 text-cyan-400" />
              <span>Services Premium</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <a
                  key={index}
                  href={service.href}
                  className="group p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                        {service.name}
                      </h5>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div 
            data-index="2"
            className={`transition-all duration-700 ${
              visibleElements.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-2xl font-bold text-white mb-8">Navigation</h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <ArrowRightIcon className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Premium */}
          <div 
            data-index="3"
            className={`transition-all duration-700 ${
              visibleElements.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-2xl font-bold text-white mb-8">CONTACT</h4>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="group flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <contact.icon className={`w-4 h-4 ${contact.color}`} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">{contact.label}</div>
                    <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {contact.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Guarantees Bar */}
        <div 
          data-index="4"
          className={`transition-all duration-700 mb-16 ${
            visibleElements.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((guarantee, index) => (
                <div
                  key={index}
                  className="group text-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <guarantee.icon className={`w-8 h-8 ${guarantee.color} mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">
                    {guarantee.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social & Newsletter */}
        <div 
          data-index="5"
          className={`transition-all duration-700 mb-12 ${
            visibleElements.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-white font-bold">Suivez-moi :</span>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`group w-12 h-12 bg-gradient-to-r ${social.color} ${social.hoverColor} rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl`}
                    aria-label={social.name}
                  >
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            {/* <div className="flex items-center space-x-4">
              <span className="text-white font-bold">Newsletter Tech :</span>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105">
                  S'abonner
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          data-index="6"
          className={`border-t border-white/10 pt-8 transition-all duration-700 ${
            visibleElements.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-center lg:text-left">
              <p>&copy; 2025 <span className="text-cyan-400 font-semibold">wevavan</span>. Tous droits réservés.</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}