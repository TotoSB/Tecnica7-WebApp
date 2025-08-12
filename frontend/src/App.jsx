import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CicloBasicoPage from './components/CicloBasicoPage';
import MultimediosPage from './components/MultimediosPage';
import ProgramacionPage from './components/ProgramacionPage';
import InscripcionPage from './components/InscripcionPage';
import HistoriaPage from './components/HistoriaPage';
import ContactoPage from './components/ContactoPage';
import RadioPage from './components/RadioPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ciclo-basico" element={<CicloBasicoPage />} />
        <Route path="/multimedios" element={<MultimediosPage />} />
        <Route path="/programacion" element={<ProgramacionPage />} />
        <Route path="/inscripcion" element={<InscripcionPage />} />
        <Route path="/historia" element={<HistoriaPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/radio" element={<RadioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
