import React, { useState, useEffect } from 'react';
import Header from '../../src/components/Header';
import backgroundImageDesktop from '../assets/be.png';
import backgroundImageMobile from '../assets/bee.jpeg'; // Assume this is your mobile image

function Intro() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-grow">
        <img
          src={isMobile ? backgroundImageMobile : backgroundImageDesktop}
          className="w-full h-screen object-cover"
          alt="Blog banner"
        />
      </main>
    </div>
  );
}

export default Intro;