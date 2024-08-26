import React from 'react';
import Header from '../../src/components/Header';
import backgroundImage from '../assets/be.png';

function Intro() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-grow">
        <img
          src={backgroundImage}
          className="w-full h-screen object-cover"
          alt="Blog banner"
        />
      </main>
    </div>
  );
}

export default Intro;
