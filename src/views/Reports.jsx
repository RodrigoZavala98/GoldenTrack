import React, { useState, useContext } from 'react';
import { Download } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { generateCSV } from '../utils/csvUtils'; // Importamos nuestra utilidad de CSV

const Reports = () => {
    // Obtenemos los datos maestros desde el contexto
    const { pieces, lines, toolings } = useContext(AppContext);

    // Estados locales para los filtros del formulario
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedPieceId, setSelectedPieceId] = useState('');
    // ... aquí irían otros estados para filtros si los añades en el futuro

    const formatPieceDataForReport = (data) => {
        return data.map(p => ({
            pieza_nombre: p.nombre,
            pieza_serial: p.serial,
            linea: lines.find(l => l.lineaID === p.lineaID)?.nombre || 'N/A',
            responsable: p.responsable || 'N/A',
            fecha_expiracion: p.fechaExpiracion ? new Date(p.fechaExpiracion).toLocaleDateString() : 'N/A',
        }));
    };

    const formatToolingDataForReport = (data) => {
        return data.map(t => ({
            grupo_herramental: t.nombreGrupo,
            linea: lines.find(l => l.lineaID === t.lineaID)?.nombre || 'N/A',
            seriales: t.seriales.map(s => s.serialNumber).join('; '), // Usamos ; para evitar conflictos con , del CSV
            responsable: t.responsable || 'N/A',
            fecha_expiracion: t.fechaExpiracion ? new Date(t.fechaExpiracion).toLocaleDateString() : 'N/A',
        }));
    };

    const handleGeneralPieceReport = () => {
        const reportData = formatPieceDataForReport(pieces);
        generateCSV(reportData, 'reporte_general_piezas_golden.csv');
    };

    const handleFilteredPieceReport = () => {
        let filteredData = [...pieces];
        if (selectedLine) {
            filteredData = filteredData.filter(p => p.lineaID === parseInt(selectedLine));
        }
        if (selectedPieceId) {
            filteredData = filteredData.filter(p => p.piezaID === parseInt(selectedPieceId));
        }
        const reportData = formatPieceDataForReport(filteredData);
        generateCSV(reportData, 'reporte_filtrado_piezas_golden.csv');
    };

    // Puedes añadir una función similar para reportes generales y filtrados de herramentales aquí
    const handleGeneralToolingReport = () => {
        const reportData = formatToolingDataForReport(toolings);
        generateCSV(reportData, 'reporte_general_herramentales.csv');
    };

    const availablePieces = selectedLine ? pieces.filter(p => p.lineaID === parseInt(selectedLine)) : [];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Generación de Reportes</h1>
            <div className="space-y-8">
                {/* Sección de Reportes de Piezas Golden */}
                <div className="bg-base-200 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Reporte de Piezas Golden</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4">
                        <div>
                            <label className="label"><span className="label-text">Filtrar por Línea</span></label>
                            <select value={selectedLine} onChange={e => { setSelectedLine(e.target.value); setSelectedPieceId(''); }} className="select select-bordered w-full p-2 border rounded-lg">
                                <option value="">Todas las Líneas</option>
                                {lines.map(line => (<option key={line.lineaID} value={line.lineaID}>{line.nombre}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="label"><span className="label-text">Filtrar por Pieza</span></label>
                            <select value={selectedPieceId} onChange={e => setSelectedPieceId(e.target.value)} disabled={!selectedLine} className="select select-bordered w-full p-2 border rounded-lg disabled:opacity-50">
                                <option value="">Todas las Piezas</option>
                                {availablePieces.map(p => (<option key={p.piezaID} value={p.piezaID}>{p.nombre} ({p.serial})</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="fjoin w-full mt-4 gap-4 mt-4">
                        <button onClick={handleFilteredPieceReport} className="btn btn-soft btn-primary join-item w-1/2 gap-4">
                            <Download size={20} className="mr-2" /> Generar Reporte Filtrado
                        </button>
                        <button onClick={handleGeneralPieceReport} className="btn btn-soft btn-secondary join-item w-1/2 gap-4">
                            <Download size={20} className="mr-2" /> Descargar Reporte General
                        </button>
                    </div>
                </div>

                {/* Sección de Reportes de Herramentales */}
                <div className="bg-base-200 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Reporte de Herramentales</h2>
                     <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                        <button onClick={handleGeneralToolingReport} className="btn btn-soft btn-accent w-full ">
                            <Download size={20} className="mr-2" /> Descargar Reporte General
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;