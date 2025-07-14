import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { addTooling } from '../../api';

const ToolingManagement = () => {
    const { lines, fetchData } = useContext(AppContext);

    // Estados locales para el formulario
    const [newToolingName, setNewToolingName] = useState('');
    const [selectedLine, setSelectedLine] = useState('');
    const [responsable, setResponsable] = useState('');
    const [newExpirationDate, setNewExpirationDate] = useState('');
    const [serials, setSerials] = useState(Array(4).fill(''));

    const handleSerialChange = (index, value) => {
        const newSerials = [...serials];
        newSerials[index] = value;
        setSerials(newSerials);
    };

    const handleAddTooling = async (e) => {
        e.preventDefault();
        const cleanedSerials = serials.map(s => s.trim()).filter(s => s !== '');

        if (!newToolingName.trim() || !selectedLine || !responsable.trim() || !newExpirationDate || cleanedSerials.length !== 4) {
            alert("Por favor, completa todos los campos y los 4 números de serie.");
            return;
        }

        const newTooling = {
            nombreGrupo: newToolingName,
            responsable,
            fechaExpiracion: newExpirationDate,
            lineaID: parseInt(selectedLine),
            seriales: cleanedSerials.map(s => ({ serialNumber: s }))
        };

        try {
            await addTooling(newTooling); // Usamos la función de la API
            // Limpiamos el formulario
            setNewToolingName('');
            setSelectedLine('');
            setResponsable('');
            setNewExpirationDate('');
            setSerials(Array(4).fill(''));
            fetchData(); // Actualizamos los datos de la app
        } catch (error) {
            console.error(error);
            alert('No se pudo crear el grupo de herramentales.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestionar Herramentales</h1>
            <div className="bg-base-200 p-6 rounded-2xl shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Grupo de Herramental</h2>
                <form onSubmit={handleAddTooling} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="label"><span className="label-text">Nombre del Grupo</span></label>
                            <input type="text" value={newToolingName} onChange={e => setNewToolingName(e.target.value)} placeholder='SMT Linea #' required className="input input-bordered w-full p-2 rounded-lg w-full"/>
                        </div>
                        <div>
                             <label className="label"><span className="label-text">Línea</span></label>
                             <select value={selectedLine} onChange={e => setSelectedLine(e.target.value)} required className="select select-bordered w-full p-2 rounded-lg w-full">
                                <option value="" disabled>Seleccionar...</option>
                                {lines.map(line => <option key={line.lineaID} value={line.lineaID}>{line.nombre}</option>)}
                             </select>
                        </div>
                         <div>
                            <label className="label"><span className="label-text">Responsable</span></label>
                            <input type="text" value={responsable} onChange={e => setResponsable(e.target.value)} placeholder='Juanito Aumovio' required className="input input-bordered w-full p-2 rounded-lg w-full"/>
                        </div>
                        <div>
                             <label className="label"><span className="label-text">Fecha de Expiración</span></label>
                             <input type="date" value={newExpirationDate} onChange={e => setNewExpirationDate(e.target.value)} required className="input input-bordered w-full p-2 rounded-lg w-full"/>
                        </div>
                    </div>
                    <div>
                         <label className="label"><span className="label-text">Seriales de Herramentales (4 requeridos)</span></label>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {serials.map((serial, index) => (
                                <div key={index}>
                                    <input type="text" value={serial} onChange={e => handleSerialChange(index, e.target.value)} placeholder={`Serial Herramental #${index + 1}`} required className="input input-bordered w-full p-2 rounded-lg w-full"/>
                                </div>
                            ))}
                         </div>
                    </div>
                    <button type="submit" className="btn btn-soft btn-primary w-full font-bold py-2 px-4 rounded-lg ">
                        Agregar Grupo de Herramental
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ToolingManagement;