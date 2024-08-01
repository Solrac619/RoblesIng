import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFolder, FaUsers, FaWrench, FaBoxOpen, FaTags, FaFileAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex h-screen">
            <nav
                className={`bg-black h-screen p-4 w-64 fixed top-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}
            >
                <div className="flex items-center justify-center py-12">
                    <h1 className="text-xl font-bold text-white">Profit & Losses</h1>
                </div>
                <div className="flex items-center justify-center mb-4">
                    {/* <button className="bg-white text-black px-4 py-2 rounded-full flex items-center">
                        <FaPlusCircle className="mr-2 text-3xl text-[#78a35b]" />
                        Create new project
                    </button> */}
                </div>
                <nav className="flex-grow">
                    <ul>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaTachometerAlt className="mr-3 text-white" />
                            <Link to="/dashboard" className="text-white">Dashboard</Link>
                        </li>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaFolder className="mr-3 text-white" />
                            <Link to="/crudproyectos" className="text-white">Proyectos</Link>
                        </li>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaBoxOpen className="mr-3 text-white" />
                            <Link to="/crudproveedor" className="text-white">Proveedores</Link>
                        </li>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaTags className="mr-3 text-white" />
                            <Link to="/crudRubro" className="text-white">Rubros</Link>
                        </li>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaWrench className="mr-3 text-white" />
                            <Link to="/crudMaterial" className="text-white">Conceptos</Link>
                        </li>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaUsers className="mr-3 text-white" />
                            <Link to="/crudusuarios" className="text-white">Usuarios</Link>
                        </li>
                        <li className="flex items-center py-2 px-4 hover:bg-gray-700">
                            <FaFileAlt className="mr-3 text-white" />
                            <Link to="/doc" className="text-white">Formatos</Link>
                        </li>
                        
                    </ul>
                </nav>
            </nav>
            <div className={`transition-all duration-300 ease-in-out flex-1 ${isOpen ? 'ml-64' : 'ml-0'}`}>
                <button
                    onClick={toggleNavbar}
                    className="absolute top-4 left-16 z-40 p-2 bg-gray-800 text-white rounded transform -translate-x-1/2"
                >
                    {isOpen ? <FaChevronLeft className="text-xl" /> : <FaChevronRight className="text-xl" />}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
