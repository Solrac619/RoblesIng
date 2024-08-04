import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, cliente: '', ubicacion: '', descripcion: '', fecha_fin: null, empresa_id: 1 });
  const [newItem, setNewItem] = useState({ cliente: '', ubicacion: '', descripcion: '', empresa_id: 1 }); // No incluir fecha_fin

  const navigate = useNavigate();

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      const response = await fetch('http://localhost:3001/proyectos');
      const proyectos = await response.json();
      setData(proyectos);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:3001/proyectos/${id}`, {
            method: 'DELETE'
          });
          fetchProyectos();
          Swal.fire(
            '¡Eliminado!',
            'El proyecto ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Error al eliminar el proyecto:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el proyecto.',
            'error'
          );
        }
      }
    });
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const validateForm = (item) => {
    if (!item.cliente || !item.ubicacion || !item.descripcion || !item.empresa_id) {
      Swal.fire(
        'Error',
        'Todos los campos son obligatorios.',
        'error'
      );
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(currentItem)) return;

    try {
      await fetch(`http://localhost:3001/proyectos/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentItem),
      });
      fetchProyectos();
      setIsEditing(false);
      setCurrentItem({ id: null, cliente: '', ubicacion: '', descripcion: '', fecha_fin: '', empresa_id: '' });
      Swal.fire(
        '¡Guardado!',
        'El proyecto ha sido actualizado.',
        'success'
      );
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al actualizar el proyecto.',
        'error'
      );
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(newItem)) return;

    try {
      await fetch('http://localhost:3001/proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      fetchProyectos();
      setNewItem({ cliente: '', ubicacion: '', descripcion: '', empresa_id: '' });
      setIsAdding(false);
      Swal.fire(
        '¡Agregado!',
        'El proyecto ha sido agregado.',
        'success'
      );
    } catch (error) {
      console.error('Error al agregar el proyecto:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al agregar el proyecto.',
        'error'
      );
    }
  };

  const handleDetallesClick = (proyectoId) => {
    navigate(`/detalles/${proyectoId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">PROYECTOS</h2>
        <button onClick={handleAddClick} className="bg-green-500 text-white p-2 rounded">Agregar proyecto</button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Agregar Proyecto</h3>
            <form onSubmit={handleAddFormSubmit}>
              <input
                type="text"
                name="cliente"
                value={newItem.cliente}
                onChange={handleAddInputChange}
                placeholder="Cliente"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="ubicacion"
                value={newItem.ubicacion}
                onChange={handleAddInputChange}
                placeholder="Ubicación"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="descripcion"
                value={newItem.descripcion}
                onChange={handleAddInputChange}
                placeholder="Descripción"
                className="mb-2 p-2 border rounded w-full"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Agregar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Cliente</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Ubicación</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Descripción</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-200">
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.cliente}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.ubicacion}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.descripcion}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                <button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 mx-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteClick(item.id)} className="text-red-500 hover:text-red-700 mx-2">
                  <FaTrash />
                </button>
                <button onClick={() => handleDetallesClick(item.id)} className="text-gray-500 hover:text-gray-800 mx-2">
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Editar Proyecto</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="cliente"
                value={currentItem.cliente}
                onChange={handleInputChange}
                placeholder="Cliente"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="ubicacion"
                value={currentItem.ubicacion}
                onChange={handleInputChange}
                placeholder="Ubicación"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="descripcion"
                value={currentItem.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="date"
                name="fecha_fin"
                value={currentItem.fecha_fin || ''}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Guardar</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
