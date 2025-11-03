'use client';
import { useState, useEffect } from 'react';

const CustomNavbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 

      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed top-6 right-8 z-50 flex gap-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-3 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <a href="/" className="text-white hover:text-green-300 text-sm font-medium transition-colors">Home</a>
      <a href="/recipes" className="text-white hover:text-green-300 text-sm font-medium transition-colors">Recipes</a>
      <a href="#" className="text-white hover:text-green-300 text-sm font-medium transition-colors">About</a>
      <a href="#" className="text-white hover:text-green-300 text-sm font-medium transition-colors">More</a>
      <a href="#" className="text-white hover:text-green-300 text-sm font-medium transition-colors">Bhat Bhaji</a>
    </nav>
  );
};

export default CustomNavbar;