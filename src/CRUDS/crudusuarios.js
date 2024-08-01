import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const CrudUsuarios = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, nombre: '', departamento: '', telefono: '', email: '', usuario: '', contraseña: '' });
  const [newItem, setNewItem] = useState({ nombre: '', departamento: '', telefono: '', email: '', usuario: '', contraseña: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/usuarios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
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
      confirmButtonText: 'Sí, eliminarlo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          fetchUsuarios();
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el usuario.',
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
    let errors = {};

    // Validaciones personalizadas
    if (!item.nombre) errors.nombre = 'El nombre es requerido';
    if (!item.departamento) errors.departamento = 'El departamento es requerido';
    if (!item.telefono) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(item.telefono)) {
      errors.telefono = 'El teléfono debe tener 10 dígitos numéricos';
    }
    if (!item.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(item.email)) {
      errors.email = 'El email no es válido';
    }
    if (!item.usuario) errors.usuario = 'El usuario es requerido';
    if (!item.contraseña) errors.contraseña = 'La contraseña es requerida';

    // Validación de caracteres no permitidos, excluyendo email
    const forbiddenChars = /[<>,*()]/; // Removed . and - from forbidden characters
    ['nombre', 'departamento', 'telefono', 'usuario', 'contraseña'].forEach(key => {
      if (typeof item[key] === 'string' && forbiddenChars.test(item[key])) {
        errors[key] = 'No se permiten los siguientes caracteres: <>,*()';
      }
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(currentItem)) return;

    try {
      await axios.put(`http://localhost:3001/usuarios/${currentItem.id}`, currentItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsuarios();
      setIsEditing(false);
      setCurrentItem({ id: null, nombre: '', departamento: '', telefono: '', email: '', usuario: '', contraseña: '' });
      Swal.fire(
        '¡Actualizado!',
        'El usuario ha sido actualizado.',
        'success'
      );
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al actualizar el usuario.',
        'error'
      );
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(newItem)) return;

    try {
      await axios.post('http://localhost:3001/usuarios', newItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsuarios();
      setNewItem({ nombre: '', departamento: '', telefono: '', email: '', usuario: '', contraseña: '' });
      setIsAdding(false);
      Swal.fire(
        '¡Agregado!',
        'El usuario ha sido agregado.',
        'success'
      );
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al agregar el usuario.',
        'error'
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">USUARIOS</h2>
        <button onClick={handleAddClick} className="bg-green-500 text-white p-2 rounded">Agregar usuarios</button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Agregar Usuario</h3>
            <form onSubmit={handleAddFormSubmit}>
              <input
                type="text"
                name="nombre"
                value={newItem.nombre}
                onChange={handleAddInputChange}
                placeholder="Nombre"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
              <input
                type="text"
                name="departamento"
                value={newItem.departamento}
                onChange={handleAddInputChange}
                placeholder="Departamento"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.departamento && <p className="text-red-500 text-sm">{errors.departamento}</p>}
              <input
                type="text"
                name="telefono"
                value={newItem.telefono}
                onChange={handleAddInputChange}
                placeholder="Telefono"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
              <input
                type="email"
                name="email"
                value={newItem.email}
                onChange={handleAddInputChange}
                placeholder="Email"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="text"
                name="usuario"
                value={newItem.usuario}
                onChange={handleAddInputChange}
                placeholder="Usuario"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.usuario && <p className="text-red-500 text-sm">{errors.usuario}</p>}
              <input
                type="password"
                name="contraseña"
                value={newItem.contraseña}
                onChange={handleAddInputChange}
                placeholder="Contraseña"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.contraseña && <p className="text-red-500 text-sm">{errors.contraseña}</p>}
              <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Agregar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Nombre</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Departamento</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Telefono</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Email</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Usuario</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b border-gray-200">{item.nombre}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.departamento}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.telefono}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.email}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.usuario}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button onClick={() => handleEditClick(item)} className="text-blue-500 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteClick(item.id)} className="text-red-500">
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
            <h3 className="text-lg font-bold mb-4">Editar Usuario</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="nombre"
                value={currentItem.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
              <input
                type="text"
                name="departamento"
                value={currentItem.departamento}
                onChange={handleInputChange}
                placeholder="Departamento"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.departamento && <p className="text-red-500 text-sm">{errors.departamento}</p>}
              <input
                type="text"
                name="telefono"
                value={currentItem.telefono}
                onChange={handleInputChange}
                placeholder="Telefono"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
              <input
                type="email"
                name="email"
                value={currentItem.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="text"
                name="usuario"
                value={currentItem.usuario}
                onChange={handleInputChange}
                placeholder="Usuario"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.usuario && <p className="text-red-500 text-sm">{errors.usuario}</p>}
              <input
                type="password"
                name="contraseña"
                value={currentItem.contraseña}
                onChange={handleInputChange}
                placeholder="Contraseña"
                className="mb-2 p-2 border rounded w-full"
              />
              {errors.contraseña && <p className="text-red-500 text-sm">{errors.contraseña}</p>}
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Actualizar</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudUsuarios;
