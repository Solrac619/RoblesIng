// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import StatsCard from '../componentes/estado/card_estado';
import ProjectSummary from '../componentes/resumen/proyecto';
import OverallProgress from '../componentes/resumen/progresoGeneral';
import TodayTasks from '../componentes/tablas/tareas';
import ProjectsWorkload from '../componentes/estado/proyecto';
import FiltroCalendario from '../componentes/Calendario/filtroCalendario';
import { FaDollarSign, FaMoneyBillWave, FaChartLine, FaBalanceScale } from 'react-icons/fa';
import AuthContext from '../autenticacion/auth';

const Dashboard = () => {
  const { fecha , fecha_fin} = useContext(AuthContext);

  const [data, setData] = useState({
    total_ganancias_netas: 0,
    total_ganancias_brutas: 0,
    total_perdidas: 0,
    total_gastos: 0,
    gasto_presupuestado: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/graficos/fecha/datos/${fecha}/${fecha_fin}`);
        const result = await response.json();
        console.log('Fetched data:', result); // Log para depuración

        if (result.length > 0) {
          const [totales] = result; // Acceder al primer objeto del array

          let total_ganancias_netas = parseFloat(totales.total_ganancias_netas);
          let total_perdidas = parseFloat(totales.total_perdidas);
console.log("total perdida "+total_perdidas + "total  neta"+ total_ganancias_netas)
         
           if (total_ganancias_netas === 0) {
            total_perdidas = 0;
          } else if (total_ganancias_netas > total_perdidas){
            total_perdidas = 0;
          } else if (total_perdidas > total_ganancias_netas){
            total_ganancias_netas = 0
          }

          setData({
            total_ganancias_netas,
            total_ganancias_brutas: parseFloat(totales.total_ganancias_brutas),
            total_perdidas, 
            total_gastos: parseFloat(totales.total_gastos),
            gasto_presupuestado: parseFloat(totales.gasto_presupuestado)
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fecha]);

  const formatValue = (value) => {
    return `$${(value ?? 0).toFixed(2)}`;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <FiltroCalendario />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total de ganancias netas"
          value={formatValue(data.total_ganancias_netas)}
          icon={FaDollarSign}
          textcolor="text-2xl font-bold"
          color="bg-green-500"
        />
        <StatsCard
          title="Gastos de proyecto"
          value={formatValue(data.total_gastos)}
          icon={FaChartLine}
          textcolor="text-2xl font-bold"
          color="bg-red-500"
        />
        <StatsCard
          title="Gastos presupuestados"
          value={formatValue(data.gasto_presupuestado)}
          icon={FaMoneyBillWave}
          textcolor="text-2xl font-bold"
          color="bg-blue-500"
        />
        <StatsCard
          title="Ganancias brutas"
          value={formatValue(data.total_ganancias_brutas)}
          icon={FaMoneyBillWave}
          textcolor="text-2xl font-bold"
          color="bg-orange-500"
        />
        <StatsCard
          title="Pérdidas"
          value={formatValue(data.total_perdidas)}
          icon={FaBalanceScale}
          textcolor="text-2xl font-bold text-red-500"
          color="bg-yellow-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectSummary />
        <OverallProgress />
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TodayTasks />
        <ProjectsWorkload />
      </div> */}
    </div>
  );
};

export default Dashboard;
