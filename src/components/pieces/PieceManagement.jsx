import React, { useState, useContext } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { addPiece, deletePiece } from '../../api'; // Importamos las funciones específicas de la API

const PieceManagement = () => {
    // Obtenemos todo lo que necesitamos del contexto global
    const { pieces, lines, fetchData } = useContext(AppContext);

    // Los estados locales para el formulario se quedan aquí, ya que solo los usa este componente
    const [newPieceName, setNewPieceName] = useState('');
    const [newPieceSerial, setNewPieceSerial] = useState('');
    const [selectedLine, setSelectedLine] = useState('');
    const [newExpirationDate, setNewExpirationDate] = useState('');
    const [responsable, setResponsable] = useState('');

const handleAddPiece = async (e) => {
        e.preventDefault();
        const newPiece = {
            nombre: newPieceName,
            serial: newPieceSerial,
            responsable,
            fechaExpiracion: newExpirationDate,
            lineaID: parseInt(selectedLine)
        };
        try {
            // Usamos la función centralizada de la API
            await addPiece(newPiece);
            // Limpiamos el formulario
            setNewPieceName('');
            setNewPieceSerial('');
            setSelectedLine('');
            setNewExpirationDate('');
            setResponsable('');
            // Refrescamos los datos de toda la app
            fetchData();
        } catch (error) {
            console.error(error);
            alert('No se pudo crear la pieza.');
        }
    };

    const handleDeletePiece = async (pieceId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta pieza?')) return;
        try {
            // Usamos la función centralizada de la API
            await deletePiece(pieceId);
            // Refrescamos los datos
            fetchData();
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar la pieza.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestionar Piezas Golden</h1>
            <div className="bg-base-200 p-6 rounded-2xl mb-8">
                <h2 className="text-xl font-semibold mb-4">Registrar Nueva Pieza</h2>
                <form onSubmit={handleAddPiece} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="w-full">
                        <label className="label">Nombre</label>
                        <input type="text" value={newPieceName} onChange={(e) => setNewPieceName(e.target.value)} placeholder="Ej: AOI T19+ Top" className="input input-bordered w-full" required />
                    </div>
                    <div className="w-full">
                        <label className="label">No. Serie</label>
                        <input type="text" value={newPieceSerial} onChange={(e) => setNewPieceSerial(e.target.value)} placeholder="Ej: G00000123" className="input input-bordered w-full" required />
                    </div>
                    <div className="w-full">
                        <label className="label">Línea</label>
                        <select value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} className="select select-bordered w-full" required>
                            <option value="" disabled>Selecciona una línea</option>
                            {lines.map(line => (<option key={line.lineaID} value={line.lineaID}>{line.nombre}</option>))}
                        </select>
                    </div>
                     <div className="w-full">
                        <label className="label">Responsable</label>
                        <input type="text" value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Ej: Juanito Aumovio" className="input input-bordered w-full" required />
                    </div>
                    <div className="w-full">
                        <label className="label">Fecha de Expiración</label>
                        <input type="date" value={newExpirationDate} onChange={(e) => setNewExpirationDate(e.target.value)} className="input input-bordered w-full" required />
                    </div>
                    <button type="submit" className="btn btn-soft btn-primary w-full mt-4 justify-center">
                        <Plus size={20} className="mr-2" /> Agregar Pieza
                    </button>
                </form>
            </div>
            <div className="bg-base-200 p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Piezas Registradas</h2>
                <div className="overflow-x-auto">
                    <table className="table w-full text-left">
                        <thead>
                            <tr className="bg-base-200 p-6 rounded-2xl shadow-md">
                                <th>Nombre</th>
                                <th>No. Serie</th>
                                <th>Línea</th>
                                <th>Responsable</th>
                                <th>Expiración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pieces.map(piece => (
                                <tr key={piece.piezaID} className="hover">
                                    <td>{piece.nombre}</td>
                                    <td>{piece.serial}</td>
                                    <td>{lines.find(l => l.lineaID === piece.lineaID)?.nombre || 'N/A'}</td>
                                    <td>{piece.responsable}</td>
                                    <td>{new Date(piece.fechaExpiracion).toLocaleDateString()}</td>
                                    <td className="p-3"><button onClick={() => handleDeletePiece(piece.piezaID)} className="btn btn-ghost btn-square btn-sm text-red-500"><Trash2 size={20} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PieceManagement;