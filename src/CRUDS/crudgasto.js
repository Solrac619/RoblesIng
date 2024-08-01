import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GastoTable = () => {
    const [gastos, setGastos] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    useEffect(() => {
        const fetchGastos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/gasto');
                setGastos(response.data);
            } catch (error) {
                console.error('Error fetching gastos', error);
            }
        };

        fetchGastos();
    }, []);

    const handleEditClick = (id) => {
        setEditing(id);
        const gasto = gastos.find(gasto => gasto.id === id);
        setEditedValues(gasto);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedValues({
            ...editedValues,
            [name]: value,
        });
    };

    const handleSaveClick = async (id) => {
        try {
            await axios.put(`http://localhost:3001/gasto/${id}`, editedValues);
            setGastos(gastos.map(gasto => (gasto.id === id ? editedValues : gasto)));
            setEditing(null);
        } catch (error) {
            console.error('Error updating gasto', error);
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th className='py-2 px-4 border-b-2 border-gray-200 text-left'></th>
                    <th className='py-2 px-4 border-b-2 border-gray-200 text-left'>Gasto Real</th>
                    <th className='py-2 px-4 border-b-2 border-gray-200 text-left'>Diferencia</th>
                    <th className='py-2 px-4 border-b-2 border-gray-200 text-left'>Presupuesto</th>
                </tr>
            </thead>
            <tbody>
                {gastos.map(gasto => (
                    <React.Fragment key={gasto.id}>
                        <tr>
                            <td className='py-2 px-4 border-b-2 border-gray-200 text-left'>Mano de Obra</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="gasto_real_manoObra"
                                        value={editedValues.gasto_real_manoObra}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.gasto_real_manoObra
                                )}
                            </td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>{gasto.diferencia_manoObra}</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="presupuesto_manoObra"
                                        value={editedValues.presupuesto_manoObra}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.presupuesto_manoObra
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className='py-2 px-4 border-b-2 border-gray-200 text-left'>Equipo</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="gasto_real_equipo"
                                        value={editedValues.gasto_real_equipo}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.gasto_real_equipo
                                )}
                            </td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>{gasto.diferencia_equipo}</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="presupuesto_equipo"
                                        value={editedValues.presupuesto_equipo}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.presupuesto_equipo
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className='py-2 px-4 border-b-2 border-gray-200 text-left'>Subcontrato</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="gasto_real_subcontrato"
                                        value={editedValues.gasto_real_subcontrato}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.gasto_real_subcontrato
                                )}
                            </td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>{gasto.diferencia_subcontrato}</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="presupuesto_subcontrato"
                                        value={editedValues.presupuesto_subcontrato}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.presupuesto_subcontrato
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className='py-2 px-4 border-b-2 border-gray-200 text-left'>Otro</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="gasto_real_otro"
                                        value={editedValues.gasto_real_otro}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.gasto_real_otro
                                )}
                            </td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>{gasto.diferencia_otro}</td>
                            <td className='py-2 px-4 border-b-2 border-gray-200'>
                                {editing === gasto.id ? (
                                    <input
                                        type="number"
                                        name="presupuesto_otro"
                                        value={editedValues.presupuesto_otro}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    gasto.presupuesto_otro
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className='py-2 px-4 border-b-2 border-gray-200 text-left'>Diferencia Total</td>
                            <td colSpan={3} className='py-2 px-4 border-b-2 border-gray-200'>{gasto.diferencia_total}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} className='py-2 px-4 border-b-2 border-gray-200 text-center'>
                                {editing === gasto.id ? (
                                    <button onClick={() => handleSaveClick(gasto.id)}>Guardar</button>
                                ) : (
                                    <button onClick={() => handleEditClick(gasto.id)}>Editar</button>
                                )}
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default GastoTable;
