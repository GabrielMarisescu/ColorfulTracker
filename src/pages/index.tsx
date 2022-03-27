import React from 'react';
import Footer from '../components/Footer';
import MusicPlayer from '../components/MusicPlayer';
import ScanSection from '../components/ScanSection';

//routing here

function index(): JSX.Element {
  console.log('Hello :D, remember to smile :)');
  return (
    <>
      <ScanSection />
      <MusicPlayer />
      <Footer />
    </>
  );
}

export default index;
