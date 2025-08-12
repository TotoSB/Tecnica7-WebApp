import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 mr-4" />
        <Link to="/" className="text-xl font-bold">E.E.S.T N°7</Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/ciclo-basico" className="hover:text-gray-300">Ciclo Básico</Link></li>
          <li><Link to="/multimedios" className="hover:text-gray-300">Multimedios</Link></li>
          <li><Link to="/programacion" className="hover:text-gray-300">Programación</Link></li>
          <li><Link to="/inscripcion" className="hover:text-gray-300">Inscripciones</Link></li>
          <li><Link to="/historia" className="hover:text-gray-300">Historia</Link></li>
          <li><Link to="/contacto" className="hover:text-gray-300">Contacto</Link></li>
          <li><Link to="/radio" className="hover:text-gray-300">Radio</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
