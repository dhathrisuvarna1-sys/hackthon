import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SpeechPlayer } from '../components/SpeechPlayer';

export default function MainLayout() {
  return (
    <SpeechPlayer>
      <div className="app-window">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </SpeechPlayer>
  );
}
