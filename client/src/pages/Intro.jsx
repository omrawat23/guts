import React from 'react';
import Header from '../../src/components/Header';
import backgroundImage from "../assets/guts.png";


function Intro() {
  return (
        <div className="relative min-h-screen">
          <Header />
          <main className="w-full h-full">
            <img src={backgroundImage} className="w-full h-auto object-cover" alt="Blog banner" />
          </main>
        </div>
  );
}

export default Intro;