import React, { useContext } from 'react';
import { Factory, Clock, FileJson } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getMesData } from '../api';
import { getExpirationStatus } from '../utils/dateUtils';

const Dashboard = () => {
    // Obtenemos los estados y funciones del contexto
    const { lines, pieces, setModalInfo, scanData, setScanData } = useContext(AppContext);

    // Solo para actualizar la fecha del último pase
    const handleUpdateLastPass = (piece) => {
        setScanData(prev => ({ ...prev, [piece.piezaID]: 'Cargando...' }));
        getMesData(piece.serial)
            .then(res => res.json())
            .then(data => {
                const timestamp = data?.data?.[0]?.runDate;
                if (timestamp) {
                    const localDate = new Date(timestamp).toLocaleString('es-MX', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                    });
                    setScanData(prev => ({ ...prev, [piece.piezaID]: localDate }));
                } else {
                    setScanData(prev => ({ ...prev, [piece.piezaID]: 'Sin datos' }));
                }
            })
            .catch(() => {
                setScanData(prev => ({ ...prev, [piece.piezaID]: 'Error' }));
            });
    };

    const handleShowDetails = (piece) => {
        setModalInfo({ piece, loading: true, data: null, error: null });
        getMesData(piece.serial) // Usamos la función de nuestra API centralizada
            .then(res => res.json())
            .then(data => {
                setModalInfo({ piece, loading: false, data: data, error: null });
            })
			
            .catch(error => {
                console.error("Error al consultar la API de MES:", error);
                setModalInfo({ piece, loading: false, data: null, error: error.message });
            });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Principal</h1>
			{lines.length === 0 && <p className="text-gray-500 dark:text-gray-400">No hay líneas de producción registradas.</p>}
            <div className="space-y-8">
                {lines.map(line => (
                    <div key={line.lineaID} className="bg-base-200 p-6 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><Factory className="mr-3 text-orange-500" />{line.nombre}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						    {pieces.filter(p => p.lineaID === line.lineaID).length === 0 && <p className="text-sm text-gray-400 col-span-full">No hay piezas golden asignadas.</p>}
                            {pieces.filter(p => p.lineaID === line.lineaID).map(piece => {
                                const expirationStatus = getExpirationStatus(piece.fechaExpiracion);
                                
                                // --- AQUÍ ESTÁ LA CORRECCIÓN ---
                                // Verificamos que 'scanData' sea un objeto antes de intentar acceder a él.
                                // Si es undefined, 'scanStatus' será 'Pendiente de paso' por defecto.
                                const scanStatus = (scanData && scanData[piece.piezaID]) || 'Pendiente de paso';
                                
                                let statusColor = 'text-red-500';
                                if (scanStatus === 'Cargando...') statusColor = 'text-blue-500';
                                else if (scanStatus !== 'Pendiente de paso' && scanStatus !== 'Error' && scanStatus !== 'Sin datos') statusColor = 'text-green-500';

                                return (
                                <div key={piece.piezaID} className="rounded-lg shadow-sm overflow-hidden border border-base-300 flex flex-col bg-base-100">
                                    <div className={`p-2 text-center font-bold ${expirationStatus.colorClass} ${expirationStatus.textColor}`}>{expirationStatus.text}</div>
                                    <div className="p-4 flex-grow flex flex-col">
                                        <h3 className="font-bold">{piece.nombre}</h3>
                                        <p className="text-sm text-base-content/70 mt-1">ID: {piece.serial}</p>
                                        <p className="text-sm text-base-content/70">Resp: {piece.responsable}</p>
                                        <div className="flex-grow mt-2 pt-2 border-t border-base-300">
                                            <p className={`text-xs font-semibold ${statusColor}`}>
                                                {scanStatus}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-base-300/50 grid grid-cols-2 gap-2">
                                        <button onClick={() => handleUpdateLastPass(piece)} className="btn btn-sm btn-soft w-full flex items-center gap-1">
                                            <Clock size={14} />
                                            Último Pase
                                        </button>
                                        <button onClick={() => handleShowDetails(piece)} className="btn btn-sm btn-soft btn-info w-full flex items-center gap-1">
                                            <FileJson size={14} />
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;