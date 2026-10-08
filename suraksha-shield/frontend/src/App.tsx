import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import MessageScanner from './pages/MessageScanner';
import UpiScanner from './pages/UpiScanner';
import Result from './pages/Result';
import AutomaticScanner from './pages/AutomaticScanner';
import ImageScanner from './pages/ImageScanner';
import History from './pages/History';
import Learn from './pages/Learn';
import About from './pages/About';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="scan/message" element={<MessageScanner />} />
          <Route path="scan/automatic" element={<AutomaticScanner />} />
          <Route path="scan/image" element={<ImageScanner />} />
          <Route path="scan/upi" element={<UpiScanner />} />
          <Route path="results/:id" element={<Result />} />
          <Route path="learn" element={<Learn />} />
          <Route path="history" element={<History />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
