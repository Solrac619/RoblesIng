import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PDFLista = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/formato/list');
        const { files } = response.data;
        setFiles(files || []); // Asegúrate de que files sea un array
      } catch (error) {
        console.error('Error al listar los archivos:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-2">Lista de archivos PDF:</h2>
      <ul className="border border-gray-200 rounded-md p-4">
        {Array.isArray(files) && files.length > 0 ? (
          files.map((file, index) => (
            <li key={index} className="flex justify-between items-center py-2">
              <span className="truncate w-full">{file}</span>
              <div>
                <a
                  href={`http://localhost:3001/assets/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Ver
                </a>
              
              </div>
            </li>
          ))
        ) : (
          <p>No hay archivos disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default PDFLista;
