import React, { useContext, useState } from 'react';
import { Trash2, Clock, Lock, Unlock } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { deleteTooling, getToolingData, getLogData } from '../../api';
import { getExpirationStatus } from '../../utils/dateUtils';

const ToolingDashboard = () => {
    const { toolings, lines, fetchData } = useContext(AppContext);
    const [toolingScanData, setToolingScanData] = useState({});

    const handleDeleteTooling = async (toolingId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este grupo de herramentales?')) return;
        try {
            await deleteTooling(toolingId);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el grupo de herramentales.');
        }
    };

    const handleUpdateLastPass = async (tooling) => {
        const line = lines.find(l => l.lineaID === tooling.lineaID);
        if (!line) {
            alert('No se encontró la línea para este herramental.');
            return;
        }

        setToolingScanData(prev => ({ ...prev, [tooling.herramentalID]: { loading: true } }));

        try {
            const logDataResponse = await getLogData();
            if (!logDataResponse.ok) throw new Error(`Error al obtener logs: ${logDataResponse.statusText}`);
            const allLogData = await logDataResponse.json();

            const mesPromises = tooling.seriales.map(s =>
                getToolingData(s.serialNumber, line.nombre)
                    .then(res => res.ok ? res.json() : Promise.resolve({ fetchError: true }))
                    .catch(() => ({ fetchError: true }))
            );

            const mesResults = await Promise.all(mesPromises);
            
            const individualStatuses = {};

            // Extraer el número de la línea del nombre de la línea (ej. "SMT Line 7" -> "7")
            // Y formatearlo a dos dígitos (ej. "7" -> "07") para que coincida con el formato del log
            const lineNumMatch = line.nombre.match(/\d+/g);
            const lineNumberFormatted = lineNumMatch && lineNumMatch.length > 0
                ? String(lineNumMatch[lineNumMatch.length - 1]).padStart(2, '0')
                : null;

            tooling.seriales.forEach((s, index) => {
                const serialNumber = s.serialNumber;
                const mesResult = mesResults[index];
                
                // Filtrar por toolUid Y el número de línea formateado, si se encontró
                const latestLog = allLogData
                    .filter(log =>
                        log.toolUid === serialNumber &&
                        (lineNumberFormatted === null || log.linea === lineNumberFormatted)
                    )
                    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))[0];

                let statusText;
                if (latestLog && latestLog.fechaHora) {
                    statusText = new Date(latestLog.fechaHora).toLocaleString('es-MX', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                } else {
                    statusText = 'Sin Montaje';
                }

                const isLocked = mesResult?.carrierInfo?.lock?.locked;

                individualStatuses[serialNumber] = { statusText, isLocked };
            });

            setToolingScanData(prev => ({ ...prev, [tooling.herramentalID]: { statuses: individualStatuses } }));

        } catch (error) {
            console.error("Error al consultar las APIs de herramentales:", error);
            setToolingScanData(prev => ({ ...prev, [tooling.herramentalID]: { error: 'Error de red o datos' } }));
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard de Herramentales</h1>
            
            <div role="alert" className="alert alert-info alert-soft mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Recientemente se ha añadido una función para validar el último pase, así como una verificación del estado del herramental (bloqueada o no). Ahora, si un herramental fue únicamente limpiado y aún no ha sido probado en el equipo, el sistema mostrará un mensaje en letras amarillas: “Solo limpieza, pendiente de montar”.</span>
                
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolings.length === 0 && (
                    <p className="col-span-full bg-base-200 p-6 rounded-lg">No hay grupos de herramentales registrados.</p>
                )}
                {toolings.map(tooling => {
                    const expirationStatus = getExpirationStatus(tooling.fechaExpiracion);
                    const groupScanData = toolingScanData[tooling.herramentalID];

                    return (
                    <div key={tooling.herramentalID} className="rounded-lg shadow-sm overflow-hidden border border-base-300 flex flex-col bg-base-200">
                         <div className={`p-2 text-center font-bold ${expirationStatus.colorClass} ${expirationStatus.textColor}`}>{expirationStatus.text}</div>
                         <div className="p-4 flex-grow flex flex-col">
                             <div className="flex justify-between items-start">
                                 <h3 className="font-bold">{tooling.nombreGrupo}</h3>
                                 <button onClick={() => handleDeleteTooling(tooling.herramentalID)} className="btn btn-ghost btn-sm btn-square text-red-500">
                                     <Trash2 size={18} />
                                 </button>
                             </div>
                             <p className="text-sm mt-1">Línea: {lines.find(l => l.lineaID === tooling.lineaID)?.nombre || 'N/A'}</p>
                             <p className="text-sm">Resp: {tooling.responsable}</p>
                             
                             <div className="mt-4 pt-2 border-t border-base-300">
                                <p className="text-xs font-semibold mb-2">Herramentales y Último Pase:</p>
                                
                                {groupScanData?.loading && <p className="text-sm text-blue-400">Cargando datos...</p>}
                                {groupScanData?.error && <p className="text-sm text-red-400">{groupScanData.error}</p>}

                                <ul className="space-y-1 text-sm">
                                    {tooling.seriales.map((s, i) => {
                                        const serialInfo = groupScanData?.statuses?.[s.serialNumber];
                                        const serialStatus = serialInfo?.statusText || 'Pendiente';
                                        const isLocked = serialInfo?.isLocked;
                                        
                                        let statusColor = 'text-gray-400';
                                        if (serialStatus.includes('/')) statusColor = 'text-green-400';
                                        else if (serialStatus.includes('Error') || serialStatus === 'Sin Montaje') statusColor = 'text-red-500';

                                        return (
                                            <li key={i} className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-2">
                                                    {isLocked === true && <Lock size={16} className="text-red-500" title="Bloqueado" />}
                                                    {isLocked === false && <Unlock size={16} className="text-green-500" title="Desbloqueado" />}
                                                    <span>{s.serialNumber}</span>
                                                </div>
                                                <span className={`font-mono ${statusColor}`}>{serialStatus}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                             </div>
                         </div>
                         <div className="p-2 bg-base-300/50">
                             <button onClick={() => handleUpdateLastPass(tooling)} className="btn btn-sm btn-soft w-full flex items-center gap-1">
                                <Clock size={14} />
                                Último Pase
                            </button>
                         </div>
                    </div>
                )})}
            </div>
         </div>
    );
};

export default ToolingDashboard;