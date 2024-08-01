import React, { useContext, useState } from 'react';
import AuthContext from '../../autenticacion/auth'; // Asegúrate de importar AuthContext correctamente

function FiltroCalendario() {
  const { fecha, setFecha } = useContext(AuthContext); // Asegúrate de que AuthContext proporciona setFecha
  const [startDate, setStartDate] = useState(new Date(fecha).toISOString().split('T')[0]);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setStartDate(selectedDate);
  };

  const handleSetDate = () => {
    setFecha(startDate); // Actualiza el contexto con la nueva fecha al hacer clic en el botón
  };

  return (
    <div>
      <input
        type="date"
        name="fecha_inicio"
        value={startDate}
        onChange={handleDateChange}
        className="mb-2 p-2 border rounded w-full"
      />
      <button
        onClick={handleSetDate}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Establecer Fecha
      </button>
    </div>
  );
}

export default FiltroCalendario;
