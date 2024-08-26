import React from 'react';
import Header from '../../src/components/Header';
import backgroundImage from '../assets/guts.png';

function Intro() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <img
          src={backgroundImage}
          className="w-full h-auto object-cover md:h-full"
          alt="Blog banner"
        />
      </main>
    </div>
  );
}

export default Intro;
