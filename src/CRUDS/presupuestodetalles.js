import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const PresupuestoDetalles = () => {
  const { proyectoId } = useParams();
  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, material_id: '', monto_presupuesto: '', monto_gatoreal: '' });
  const [newItem, setNewItem] = useState({ material_id: '', monto_presupuesto: '', monto_gatoreal: '' });

  useEffect(() => {
    fetchPresupuestoDetalles();
    fetchAllMaterials();
    fetchFiltro();
  }, [proyectoId]);

  const fetchPresupuestoDetalles = async () => {
    try {
      const response = await fetch(`http://localhost:3001/detallesp/${proyectoId}`);
      const detalles = await response.json();
      setData(detalles);
    } catch (error) {
      console.error('Error al obtener los detalles del presupuesto:', error);
    }
  };

  const fetchAllMaterials = async () => {
    try {
      const response = await fetch('http://localhost:3001/material');
      const materiales = await response.json();
      setAllMaterials(materiales);
    } catch (error) {
      console.error('Error al obtener todos los materiales:', error);
    }
  };

  const fetchFiltro = async () => {
    try {
      const response = await fetch('http://localhost:3001/material/rubroId');
      const filtro = await response.json();
      setFiltro(filtro);
    } catch (error) {
      console.error('Error al obtener los materiales filtrados por rubro:', error);
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
          await fetch(`http://localhost:3001/detallesp/${id}`, {
            method: 'DELETE'
          });
          fetchPresupuestoDetalles();
          Swal.fire(
            '¡Eliminado!',
            'El detalle del presupuesto ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Error al eliminar el detalle del presupuesto:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el detalle del presupuesto.',
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
    if (!item.material_id || !item.monto_presupuesto || !item.monto_gatoreal) {
      Swal.fire(
        'Error',
        'Todos los campos son obligatorios.',
        'error'
      );
      return false;
    }

    if (isNaN(item.monto_presupuesto) || isNaN(item.monto_gatoreal)) {
      Swal.fire(
        'Error',
        'Monto inválido.',
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
      await fetch(`http://localhost:3001/detallesp/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          material_id: currentItem.material_id,
          monto_presupuesto: currentItem.monto_presupuesto,
          monto_gatoreal: currentItem.monto_gatoreal
        }),
      });
      fetchPresupuestoDetalles();
      setIsEditing(false);
      setCurrentItem({ id: null, material_id: '', monto_presupuesto: '', monto_gatoreal: '' });
      Swal.fire(
        '¡Guardado!',
        'El detalle del presupuesto ha sido actualizado.',
        'success'
      );
    } catch (error) {
      console.error('Error al actualizar el detalle del presupuesto:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al actualizar el detalle del presupuesto.',
        'error'
      );
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(newItem)) return;

    try {
      await fetch('http://localhost:3001/detallesp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newItem, proyecto_id: proyectoId }),
      });
      fetchPresupuestoDetalles();
      setNewItem({ material_id: '', monto_presupuesto: '', monto_gatoreal: '' });
      setIsAdding(false);
      Swal.fire(
        '¡Agregado!',
        'El detalle del presupuesto ha sido agregado.',
        'success'
      );
    } catch (error) {
      console.error('Error al agregar el detalle del presupuesto:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al agregar el detalle del presupuesto.',
        'error'
      );
    }
  };

  // Agrupar materiales por rubro solo si están presentes en el presupuesto
  const materialsInUse = data.map(detalle => detalle.material_id);
  const usedMaterials = filtro.filter(item => materialsInUse.includes(item.material_id));

  const rubroGroups = usedMaterials.reduce((acc, item) => {
    const rubro = item.rubro || 'Sin Rubro';
    if (!acc[rubro]) acc[rubro] = [];
    acc[rubro].push(item);
    return acc;
  }, {});

  // Función para exportar a Excel
  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    Object.entries(rubroGroups).forEach(([rubro, items]) => {
      const worksheetData = [
        ['Material', 'Monto Presupuesto', 'Monto Gasto Real', 'Diferencia']
      ];
      items.forEach(item => {
        const detalle = data.find(d => d.material_id === item.material_id) || {};
        worksheetData.push([
          item.material,
          detalle.monto_presupuesto || '',
          detalle.monto_gatoreal || '',
          (detalle.monto_presupuesto - detalle.monto_gatoreal) || ''
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, rubro);
    });

    XLSX.writeFile(workbook, `presupuesto_${proyectoId}.xlsx`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Detalles del Presupuesto</h2>
        <div>
          <button onClick={handleAddClick} className="bg-green-500 text-white p-2 rounded mr-2">Agregar detalle</button>
          <button onClick={handleExportToExcel} className="bg-blue-500 text-white p-2 rounded">Exportar a Excel</button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Agregar Detalle del Presupuesto</h3>
            <form onSubmit={handleAddFormSubmit}>
              <select
                name="material_id"
                value={newItem.material_id}
                onChange={handleAddInputChange}
                className="mb-2 p-2 border rounded w-full"
              >
                <option value="">Seleccionar Material</option>
                {allMaterials.map((material) => (
                  <option key={material.id} value={material.id}>{material.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                name="monto_presupuesto"
                value={newItem.monto_presupuesto}
                onChange={handleAddInputChange}
                placeholder="Monto Presupuesto"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="number"
                name="monto_gatoreal"
                value={newItem.monto_gatoreal}
                onChange={handleAddInputChange}
                placeholder="Monto Gasto Real"
                className="mb-2 p-2 border rounded w-full"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Agregar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {Object.entries(rubroGroups).map(([rubro, items]) => (
        <div key={rubro}>
          <h3 className="text-xl font-semibold mt-4 mb-2">{rubro}</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Material</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Monto Presupuesto</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Monto Gasto Real</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left">Diferencia</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const detalle = data.find(d => d.material_id === item.material_id);
                if (!detalle) return null; // Si no se encuentra el detalle, no renderizar la fila
                return (
                  <tr key={`${rubro}-${item.material_id}`} className="hover:bg-gray-200">
                    <td className="py-2 px-4 border-b border-gray-200 text-left">{item.material}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-left">{detalle.monto_presupuesto}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-left">{detalle.monto_gatoreal}</td>
                    <td
                      className={`py-2 px-4 border-b border-gray-200 text-left ${detalle.monto_presupuesto - detalle.monto_gatoreal >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {detalle.monto_presupuesto - detalle.monto_gatoreal}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                      <button onClick={() => handleEditClick(detalle)} className="text-blue-500 hover:text-blue-700 mx-2">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteClick(detalle.id)} className="text-red-500 hover:text-red-700 mx-2">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Editar Detalle del Presupuesto</h3>
            <form onSubmit={handleFormSubmit}>
              <select
                name="material_id"
                value={currentItem.material_id}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
              >
                <option value="">Seleccionar Material</option>
                {allMaterials.map((material) => (
                  <option key={material.id} value={material.id}>{material.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                name="monto_presupuesto"
                value={currentItem.monto_presupuesto}
                onChange={handleInputChange}
                placeholder="Monto Presupuesto"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="number"
                name="monto_gatoreal"
                value={currentItem.monto_gatoreal}
                onChange={handleInputChange}
                placeholder="Monto Gasto Real"
                className="mb-2 p-2 border rounded w-full"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Guardar Cambios</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresupuestoDetalles;
