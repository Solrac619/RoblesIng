import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNavbar}
        className="absolute top-4 left-4 z-20 p-2 bg-gray-800 text-white rounded"
      >
        {isOpen ? '←' : '→'}
      </button>
      <nav
        className={`bg-black h-screen p-4 w-64 fixed top-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-start space-y-4">
          <div className="text-white text-lg font-bold mb-6">
            Proffit & Losses
          </div>
          <a href="#home" className="text-gray-300 hover:text-white">Dashboard</a>
          <a href="#about" className="text-gray-300 hover:text-white">Proyectos</a>
          <a href="#services" className="text-gray-300 hover:text-white">Proveedores</a>
          <a href="#contact" className="text-gray-300 hover:text-white">Gasto real vs Presupuesto</a>
          <a href="#contact" className="text-gray-300 hover:text-white">Usuarios</a>
          <a href="#contact" className="text-gray-300 hover:text-white">Proyeccion gasto real</a>
          <a href="#contact" className="text-gray-300 hover:text-white">Pagos e inversiones</a>



        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
