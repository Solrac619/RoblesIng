import React, { useContext, useState } from 'react';
import AuthContext from '../../autenticacion/auth'; // Asegúrate de importar AuthContext correctamente

function FiltroCalendario() {
  const { fecha, setFecha, fecha_fin, setFecha_fin } = useContext(AuthContext); // Asegúrate de que AuthContext proporciona setFecha y setFecha_fin
  const [startDate, setStartDate] = useState(new Date(fecha).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(fecha_fin).toISOString().split('T')[0]);

  const handleStartDateChange = (event) => {
    const selectedDate = event.target.value;
    setStartDate(selectedDate);
  };

  const handleEndDateChange = (event) => {
    const selectedDate = event.target.value;
    setEndDate(selectedDate);
  };

  const handleSetDates = () => {
    setFecha(startDate); 
    setFecha_fin(endDate);
    console.log(`Fecha de inicio: ${startDate}, Fecha de fin: ${endDate}`); // Actualiza el contexto con las nuevas fechas al hacer clic en el botón
  };

  return (
    <div>
      <div>
        <label>Fecha de inicio:</label>
        <input
          type="date"
          name="fecha_inicio"
          value={startDate}
          onChange={handleStartDateChange}
          className="mb-2 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label>Fecha de fin:</label>
        <input
          type="date"
          name="fecha_fin"
          value={endDate}
          onChange={handleEndDateChange}
          className="mb-2 p-2 border rounded w-full"
        />
      </div>
      <button
        onClick={handleSetDates}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Establecer Rango de Fechas
      </button>
    </div>
  );
}

export default FiltroCalendario;
