import React, { useContext } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { deleteTooling } from '../../api';
import { getExpirationStatus } from '../../utils/dateUtils'; // Reutilizamos nuestra función de utilidad

const ToolingDashboard = () => {
    // Recuerda que en el contexto lo llamamos 'toolings', no 'specialPieces'
    const { toolings, lines, fetchData } = useContext(AppContext);

    const handleDeleteTooling = async (toolingId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este grupo de herramentales?')) return;
        try {
            await deleteTooling(toolingId);
            fetchData(); // Refrescamos los datos
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el grupo de herramentales.');
        }
    };

    return (
         <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard de Herramentales</h1>
            
            <div role="alert" className="alert alert-info alert-soft">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Continuamos trabajando en el sistema de Herramentales para MPM, consulta la documentación de desarrollo para más información.</span>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolings.length === 0 && (
                    <p className="col-span-full bg-base-200 p-6 rounded-lg">No hay grupos de herramentales registrados.</p>
                )}
                {toolings.map(tooling => {
                    const expirationStatus = getExpirationStatus(tooling.fechaExpiracion);
                    return (
                    <div key={tooling.herramentalID} className="rounded-lg shadow-sm overflow-hidden border border-base-300 flex flex-col bg-base-200">
                         <div className={`p-2 text-center font-bold ${expirationStatus.colorClass} ${expirationStatus.textColor}`}>{expirationStatus.text}</div>
                         <div className="p-4 flex-grow">
                             <div className="flex justify-between items-start">
                                 <h3 className="font-bold">{tooling.nombreGrupo}</h3>
                                 <button onClick={() => handleDeleteTooling(tooling.herramentalID)} className="btn btn-ghost btn-sm btn-square text-red-500">
                                     <Trash2 size={18} />
                                 </button>
                             </div>
                             <p className="text-sm mt-1">Línea: {lines.find(l => l.lineaID === tooling.lineaID)?.nombre || 'N/A'}</p>
                             <p className="text-sm">Resp: {tooling.responsable}</p>
                             <div className="mt-4">
                                <p className="text-xs font-semibold mb-1">Seriales:</p>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {tooling.seriales.map((s, i) => <li key={i}>{s.serialNumber}</li>)}
                                </ul>
                             </div>
                         </div>
                    </div>
                )})}
            </div>
         </div>
    );
};

export default ToolingDashboard;