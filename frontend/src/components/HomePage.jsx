import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Slider */}
      <div className="relative h-96 bg-gray-200 my-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white bg-black bg-opacity-50 p-4 rounded">E.E.S.T N°7</h1>
        </div>
      </div>

      {/* Orientaciones */}
      <div className="text-center my-12">
        <h2 className="text-3xl font-bold mb-8">ORIENTACIONES</h2>
        <div className="flex justify-center space-x-16">
          <div className="flex flex-col items-center">
            <a href="/programacion">
              <img src="/assets/codificacion.png" alt="Programación" className="h-24 w-24" />
            </a>
            <p className="mt-2 text-lg">Programación</p>
          </div>
          <div className="flex flex-col items-center">
            <a href="/multimedios">
              <img src="/assets/campana-digital.png" alt="Multimedios" className="h-24 w-24" />
            </a>
            <p className="mt-2 text-lg">Multimedios</p>
          </div>
        </div>
      </div>

      {/* Inscripcion */}
      <div className="text-center my-12">
        <a href="/inscripcion">
          <img src="/assets/inscripcion.png" alt="Inscripción" className="h-24 w-24 mx-auto" />
        </a>
        <p className="mt-2 text-lg">Inscripción</p>
      </div>

      {/* Contacto */}
      <div className="text-center my-12">
        <h2 className="text-3xl font-bold mb-8">CONTACTO</h2>
        <div className="flex justify-center items-center space-x-4 mb-4">
          <a href="https://www.instagram.com/tecnica7ldz/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/instagram.png" alt="Instagram" className="h-10 w-10" />
          </a>
          <p className="text-2xl">011 4248-6259</p>
        </div>
        <div className="w-full">
          <iframe
            className="w-full h-96"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13114.721495185673!2d-58.3968068!3d-34.7384502!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc61e14ed0cc44a21!2sEscuela%20Tecnica%207%20Lomas%20de%20Zamora!5e0!3m2!1ses!2sar!4v1650329442413!5m2!1ses!2sar"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
