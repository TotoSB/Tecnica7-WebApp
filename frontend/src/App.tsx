import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import HomePage from './components/HomePage.tsx';
import CicloBasicoPage from './components/CicloBasicoPage.tsx';
import MultimediosPage from './components/MultimediosPage.tsx';
import ProgramacionPage from './components/ProgramacionPage.tsx';
import InscripcionPage from './components/InscripcionPage.tsx';
import HistoriaPage from './components/HistoriaPage.tsx';
import ContactoPage from './components/ContactoPage.tsx';
import RadioPage from './components/RadioPage.tsx';

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
