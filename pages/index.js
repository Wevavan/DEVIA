// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Services from '../components/Services';
import About from '../components/About';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import PremiumHeaderHero from '@/components/Header';

export default function Home() {
  useEffect(() => {
    // Track page view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_view', page: 'home' })
    });
  }, []);

  return (
    <>
      <PremiumHeaderHero />

      <main className="min-h-screen bg-gray-50">
        <Hero />
        <Services />
        <Projects />
        <About />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}