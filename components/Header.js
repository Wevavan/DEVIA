import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { 
  ChevronRightIcon, 
  SparklesIcon, 
  CodeBracketIcon, 
  Bars3Icon, 
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PlayIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  BoltIcon,
  FireIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

import ConsultationModal from './ConsultationModal'; // Import de la nouvelle modal

export default function PremiumHeaderHero() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('header');

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 20;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    setIsVisible(true);
    
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
        section: 'header'
      })
    });

    // Ouvrir la modal de consultation
    setModalSource(ctaType);
    setIsConsultationModalOpen(true);
  };

  const navigationItems = [
    { name: 'Accueil', href: '#', active: true },
    { name: 'Services', href: '#services' },
    { name: 'Projets', href: '#projects' },
    { name: 'À propos', href: '#about' },
    { name: 'Contact', href: '#contact'}
  ];

  return (
    <>
      {/* HEADER PREMIUM CLEAN */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100' 
            : 'bg-transparent'
        } ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        role="banner"
      >
        {/* Top Bar Premium */}
        <div className={`border-b transition-all duration-500 ${
          isScrolled ? 'border-gray-100' : 'border-white/20'
        }`}>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-10">
              {/* Left - Contact Info */}
              <div className="flex items-center space-x-8">
                <div className={`flex items-center space-x-2 text-sm ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="hidden sm:inline font-medium">Disponible maintenant</span>
                </div>
                <a
                  href="tel:+33662704580"
                  className={`hidden md:flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>+33 6 62 70 45 80</span>
                </a>
              </div>

              {/* Right - Social & Status */}
              <div className="flex items-center space-x-4">
                <div className={`hidden lg:flex items-center space-x-2 text-sm ${
                    isScrolled ? 'text-gray-500' : 'text-white/60'
                }`}>
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">4.9/5 clients satisfaits</span>
                </div>
                <div className="flex space-x-2">
                    {[
                    {
                        name: 'TikTok',
                        href: 'https://tiktok.com/@votre_compte',
                        color: isScrolled ? 'hover:bg-black' : 'hover:bg-black/80',
                        icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
                        </svg>
                        )
                    },
                    {
                        name: 'Instagram', 
                        href: 'https://instagram.com/votre_compte',
                        color: isScrolled ? 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500' : 'hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400',
                        icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        )
                    },
                    {
                        name: 'Facebook',
                        href: 'https://facebook.com/votre_page', 
                        color: isScrolled ? 'hover:bg-blue-600' : 'hover:bg-blue-500',
                        icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        )
                    }
                    ].map((social, index) => (
                    <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isScrolled
                            ? 'bg-gray-100 text-gray-600 hover:text-white'
                            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                        } hover:scale-110 relative overflow-hidden`}
                        aria-label={social.name}
                    >
                        <span className="relative z-10 transition-colors duration-300">
                        {social.icon}
                        </span>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${social.color} rounded-lg`} />
                    </a>
                    ))}
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-6" role="navigation">
          <div className="flex items-center justify-between h-20">
            {/* Logo Premium */}
            <a 
              href="/" 
              className="flex items-center space-x-4 group"
              aria-label="DevIA Pro - Accueil"
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                  isScrolled ? 'shadow-blue-500/20' : 'shadow-white/20'
                }`}>
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className={`text-xl font-bold transition-colors ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  DevIA Pro
                </h1>
                <p className={`text-xs transition-colors ${
                  isScrolled ? 'text-gray-500' : 'text-white/70'
                }`}>
                  Web & Intelligence Artificielle
                </p>
              </div>
            </a>

            {/* Desktop Navigation Clean */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative py-3 px-2 font-medium transition-all duration-300 ${
                    isScrolled
                      ? item.active 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                      : item.active
                        ? 'text-cyan-400'
                        : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                    item.active
                      ? isScrolled
                        ? 'bg-blue-600 scale-x-100'
                        : 'bg-cyan-400 scale-x-100'
                      : 'bg-current scale-x-0 hover:scale-x-100'
                  }`} />
                </a>
              ))}
            </div>

            {/* CTA Clean */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => handleCTAClick('header_consultation')}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Consultation Gratuite</span>
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
                }`}>
                  <Bars3Icon className="w-6 h-6" />
                </span>
                <span className={`absolute inset-0 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
                }`}>
                  <XMarkIcon className="w-6 h-6" />
                </span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Clean */}
        <div 
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-xl">
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block py-4 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium ${
                      isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms' 
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{item.name}</span>
                      {item.active && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </a>
                ))}
                
                {/* Mobile CTA */}
                <div className="pt-6 border-t border-gray-200 mt-4">
                  <button
                    onClick={() => {
                      handleCTAClick('mobile_consultation');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 ${
                      isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: isMenuOpen ? `${navigationItems.length * 50}ms` : '0ms' 
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Consultation Gratuite</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                {/* Mobile Contact */}
                <div className="pt-6 space-y-4">
                  <a
                    href="tel:+33662704580"
                    className={`flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors p-3 rounded-lg hover:bg-blue-50 ${
                      isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: isMenuOpen ? `${(navigationItems.length + 2) * 50}ms` : '0ms' 
                    }}
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span className="font-medium">+33 6 62 70 45 80</span>
                  </a>
                  <a
                    href="mailto:contact@devia-pro.fr"
                    className={`flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors p-3 rounded-lg hover:bg-blue-50 ${
                      isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: isMenuOpen ? `${(navigationItems.length + 3) * 50}ms` : '0ms' 
                    }}
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    <span className="font-medium">contact@devia-pro.fr</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modal de Consultation */}
      <ConsultationModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        source="website"
        sourceSection={modalSource}
      />
    </>
  );
}