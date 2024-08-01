import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ProviderTable = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, nombre: '', codigo: '', rfc: '', direccion: '', ciudad: '', telefono: '', nombreContacto: '', email: '' });
  const [newItem, setNewItem] = useState({ nombre: '', codigo: '', rfc: '', direccion: '', ciudad: '', telefono: '', nombreContacto: '', email: '' });

  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = async () => {
    try {
      const response = await fetch('http://localhost:3001/proveedores');
      const proveedores = await response.json();
      setData(proveedores);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:3001/proveedores/${id}`, {
            method: 'DELETE'
          });
          setData(data.filter(item => item.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El proveedor ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting provider:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el proveedor.',
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(currentItem);
    if (isValid) {
      try {
        await fetch(`http://localhost:3001/proveedores/${currentItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentItem),
        });
        fetchProvider();
        setIsEditing(false);
        setCurrentItem({ id: null, nombre: '', codigo: '', rfc: '', direccion: '', ciudad: '', telefono: '', nombreContacto: '', email: '' });
        Swal.fire(
          '¡Actualizado!',
          'El proveedor ha sido actualizado.',
          'success'
        );
      } catch (error) {
        console.error('Error updating provider:', error);
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar el proveedor.',
          'error'
        );
      }
    } else {
      Swal.fire(
        'Error',
        'Por favor completa todos los campos requeridos.',
        'error'
      );
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(newItem);
    if (isValid) {
      try {
        const response = await fetch('http://localhost:3001/proveedores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
        const addedItem = await response.json();
        fetchProvider();
        setData([...data, addedItem]);
        setIsAdding(false);
        setNewItem({ nombre: '', codigo: '', rfc: '', direccion: '', ciudad: '', telefono: '', nombreContacto: '', email: '' });
        Swal.fire(
          '¡Agregado!',
          'El proveedor ha sido agregado.',
          'success'
        );
      } catch (error) {
        console.error('Error adding provider:', error);
        Swal.fire(
          'Error',
          'Hubo un problema al agregar el proveedor.',
          'error'
        );
      }
    } else {
      Swal.fire(
        'Error',
        'Por favor completa todos los campos requeridos.',
        'error'
      );
    }
  };

  const validateForm = (item) => {
    return (
      item.nombre.trim() !== '' &&
      item.codigo.trim() !== '' &&
      item.rfc.trim() !== '' &&
      item.direccion.trim() !== '' &&
      item.ciudad.trim() !== '' &&
      item.telefono.trim() !== '' &&
      item.nombreContacto.trim() !== '' &&
      item.email.trim() !== ''
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">PROVEEDORES</h2>
        <button onClick={handleAddClick} className="bg-green-500 text-white p-2 rounded">Agregar Proveedor</button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Agregar Proveedor</h3>
            <form onSubmit={handleAddFormSubmit}>
              <input
                type="text"
                name="nombre"
                value={newItem.nombre}
                onChange={handleAddInputChange}
                placeholder="Nombre"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="codigo"
                value={newItem.codigo}
                onChange={handleAddInputChange}
                placeholder="Código"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="rfc"
                value={newItem.rfc}
                onChange={handleAddInputChange}
                placeholder="RFC"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="direccion"
                value={newItem.direccion}
                onChange={handleAddInputChange}
                placeholder="Dirección"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="ciudad"
                value={newItem.ciudad}
                onChange={handleAddInputChange}
                placeholder="Ciudad"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="telefono"
                value={newItem.telefono}
                onChange={handleAddInputChange}
                placeholder="Teléfono"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="nombreContacto"
                value={newItem.nombreContacto}
                onChange={handleAddInputChange}
                placeholder="Nombre de Contacto"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="email"
                name="email"
                value={newItem.email}
                onChange={handleAddInputChange}
                placeholder="Email"
                className="mb-2 p-2 border rounded w-full"
              />
              <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Agregar</button>
              <button onClick={() => setIsAdding(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">NOMBRE</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">CODIGO</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">RFC</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">DIRECCION</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">CIUDAD</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">TELEFONO</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">NOMBRE CONTACTO</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">EMAIL</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-200">
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.nombre}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.codigo}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.rfc}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.direccion}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.ciudad}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.telefono}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.nombreContacto}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-left">{item.email}</td>
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
            <h3 className="text-lg font-bold mb-4">Editar Proveedor</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="nombre"
                value={currentItem.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="codigo"
                value={currentItem.codigo}
                onChange={handleInputChange}
                placeholder="Código"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="rfc"
                value={currentItem.rfc}
                onChange={handleInputChange}
                placeholder="RFC"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="direccion"
                value={currentItem.direccion}
                onChange={handleInputChange}
                placeholder="Dirección"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="ciudad"
                value={currentItem.ciudad}
                onChange={handleInputChange}
                placeholder="Ciudad"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="telefono"
                value={currentItem.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                name="nombreContacto"
                value={currentItem.nombreContacto}
                onChange={handleInputChange}
                placeholder="Nombre de Contacto"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="email"
                name="email"
                value={currentItem.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="mb-2 p-2 border rounded w-full"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Actualizar</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderTable;
