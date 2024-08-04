// src/componentes/resumen/OverallProgress.jsx
import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import AuthContext from '../../autenticacion/auth';

const OverallProgress = () => {

  const { fecha , fecha_fin} = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/graficos/fecha/datos/${fecha}/${fecha_fin}`);
        const result = await response.json();

        if (result.length > 0) {
          const [totales] = result;
          setData([
            { name: 'Ganancias Brutas', value: parseFloat(totales.total_ganancias_brutas) },
            { name: 'Pérdidas', value: -parseFloat(totales.total_perdidas) }, // Representando pérdidas como valores negativos
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fecha]);


  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-500">Relación de pérdidas y ganancias</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[dataMin => Math.min(0, dataMin), dataMax => Math.max(0, dataMax)]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#ff4040" />
          <ReferenceLine  y={0} stroke="#9b9b9b" /> {/* Línea de referencia en el eje X */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallProgress;
