import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../autenticacion/auth';

const ProjectSummary = ({ dateRange }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fecha, fecha_fin } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch de la lista de proyectos
        const response = await fetch('http://localhost:3001/proyectos');
        const projectList = await response.json();

        // Fetch de las ganancias netas para cada proyecto
        const projectsWithGains = await Promise.all(
          projectList.map(async (project) => {
            const response = await fetch(`http://localhost:3001/graficos/${project.id}/${fecha}/${fecha_fin}`);
            const data = await response.json();
            
            // Verificar si hay datos de ganancias netas para el proyecto
            if (data && !isNaN(parseFloat(data.total_ganancias_netas))) {
              const total_ganancias_netas = parseFloat(data.total_ganancias_netas) || 0;
              return { ...project, total_ganancias_netas };
            }
            return null;
          })
        );

        // Filtra proyectos con datos nulos
        const filteredProjects = projectsWithGains.filter(project => project !== null);

        setProjects(filteredProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects or gains:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [dateRange, fecha, fecha_fin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-500">Ganancias de proyectos</h2>
      <table className="min-w-full bg-white">
        <thead className="bg-[#ff4040] text-white">
          <tr>
            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Nombre del proyecto</th>
            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Total de ganancias</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="w-1/3 text-left py-3 px-4">{project.cliente}</td>
              <td 
                className={`w-1/3 text-left py-3 px-4 ${project.total_ganancias_netas < 0 ? 'text-red-500' : ''}`}
              >
                {`$${project.total_ganancias_netas.toFixed(2)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectSummary;
