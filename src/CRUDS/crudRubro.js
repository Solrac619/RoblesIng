import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const RubroApp = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, nombre: '' });
  const [newItem, setNewItem] = useState({ nombre: '' });

  useEffect(() => {
    fetchRubroes();
  }, []);

  const fetchRubroes = async () => {
    try {
      const response = await fetch('http://localhost:3001/rubro');
      const Rubroes = await response.json();
      setData(Rubroes);
    } catch (error) {
      console.error('Error al obtener los Rubroes:', error);
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
          await fetch(`http://localhost:3001/rubro/${id}`, {
            method: 'DELETE'
          });
          fetchRubroes();
          Swal.fire(
            '¡Eliminado!',
            'El Rubro ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Error al eliminar el Rubro:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el Rubro.',
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
    if (!item.nombre) {
      Swal.fire(
        'Error',
        'El nombre del Rubro es obligatorio.',
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
      await fetch(`http://localhost:3001/rubro/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentItem),
      });
      fetchRubroes();
      setIsEditing(false);
      setCurrentItem({ id: null, nombre: '' });
      Swal.fire(
        '¡Guardado!',
        'El Rubro ha sido actualizado.',
        'success'
      );
    } catch (error) {
      console.error('Error al actualizar el Rubro:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al actualizar el Rubro.',
        'error'
      );
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(newItem)) return;

    try {
      await fetch('http://localhost:3001/rubro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      fetchRubroes();
      setNewItem({ nombre: '' });
      setIsAdding(false);
      Swal.fire(
        '¡Agregado!',
        'El Rubro ha sido agregado.',
        'success'
      );
    } catch (error) {
      console.error('Error al agregar el Rubro:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al agregar el Rubro.',
        'error'
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rubroes</h2>
        <button onClick={handleAddClick} className="bg-green-500 text-white p-2 rounded">Agregar Rubro</button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Agregar Rubro</h3>
            <form onSubmit={handleAddFormSubmit}>
              <input
                type="text"
                name="nombre"
                value={newItem.nombre}
                onChange={handleAddInputChange}
                placeholder="Nombre del Rubro"
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
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Nombre</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-200">
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.nombre}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                <button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 mx-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteClick(item.id)} className="text-red-500 hover:text-red-700 mx-2">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Editar Rubro</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="nombre"
                value={currentItem.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del Rubro"
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

export default RubroApp;
