import React, { useState, useContext } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { addLine, deleteLine } from '../../api'; // Importamos las funciones de la API

const LineManagement = () => {
    // Obtenemos los datos y funciones que necesitamos del contexto
    const { lines, fetchData } = useContext(AppContext);

    // Estado local para el nombre de la nueva línea y el manejo de errores del formulario
    const [newLineName, setNewLineName] = useState('');
    const [error, setError] = useState('');

    const handleAddLine = async (e) => {
        e.preventDefault();
        const trimmedName = newLineName.trim();
        if (!trimmedName) {
            setError('El nombre de la línea no puede estar vacío.');
            return;
        }

        try {
            // Usamos la función de la API
            await addLine({ nombre: trimmedName });
            setNewLineName('');
            setError('');
            // Refrescamos los datos para toda la aplicación
            fetchData();
        } catch (err) {
            console.error(err);
            setError('El nombre de la línea ya existe o hubo un error en el servidor.');
        }
    };

    const handleDeleteLine = async (lineId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta línea? Se eliminarán todas las piezas y herramentales asociados.')) {
            return;
        }
        try {
            // Usamos la función de la API
            await deleteLine(lineId);
            // Refrescamos los datos
            fetchData();
        } catch (err) {
            console.error(err);
            alert('No se pudo eliminar la línea. Asegúrate de que no tenga dependencias o contacta al administrador.');
        }
    };

    return (
        <div>
             <h1 className="text-3xl font-bold mb-6">Gestionar Líneas de Producción</h1>
             <div className="bg-base-200 p-6 rounded-2xl shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Registrar Nueva Línea</h2>
                <form onSubmit={handleAddLine}>
                    <div className="flex items-start gap-4">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={newLineName}
                                onChange={e => setNewLineName(e.target.value)}
                                placeholder="Ej: Línea 5"
                                className="w-full p-2 input input-bordered rounded-lg"
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                        <button type="submit" className="btn btn-soft btn-primary flex items-center">
                            <Plus size={20} className="mr-2" /> Agregar
                        </button>
                    </div>
                </form>
            </div>
             <div className="bg-base-200 p-6 rounded-2xl shadow-md mt-8">
                <h2 className="text-xl font-semibold mb-4">Líneas Existentes</h2>
                <ul className="space-y-2">
                    {lines.map(line => (
                        <li key={line.lineaID} className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                            <span>{line.nombre}</span>
                            <button onClick={() => handleDeleteLine(line.lineaID)} className="btn btn-ghost btn-square btn-sm text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LineManagement;