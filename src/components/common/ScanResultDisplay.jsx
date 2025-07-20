import React from 'react';

const ScanResultDisplay = ({ apiData }) => {
	// apiData ahora es un array de resultados, uno por cada serial del panel
    if (!apiData || apiData.length === 0) {
        return <p>No se encontraron datos de resultados para mostrar.</p>;
    }

    return (
        <div className="font-sans space-y-6">
		{/* Iteramos sobre el resultado de cada serial */}
            {apiData.map((result, index) => {
				
                // Extraemos la info original y el serial de forma segura
                const { originalUnit, ...testData } = result;
                const unitId = originalUnit.unitId;

                // --- Obtenemos el unitStatus del objeto originalUnit ---
                const unitStatus = originalUnit.unitStatus; // ej: "PASS", "CARMA", etc.
                const statusColorClass = unitStatus === 'PASS' ? 'text-green-400' : 'text-yellow-400';

				// Si una de las llamadas falló, mostramos un mensaje de error para esa unidad
                if (testData.fetchError || testData.error) {
                    return (
                        <div key={unitId || index} className="p-4 bg-base-200 rounded-lg">
                            <p className="font-bold text-red-500">Error al cargar datos para: {unitId}</p>
                        </div>
                    );
                }

                const latestResult = testData?.data?.[0];

                // Si la llamada fue exitosa pero no hay datos de prueba
                if (!latestResult) {
                    return (
                         <div key={unitId || index} className="p-4 bg-base-200 rounded-lg">
                            <h4 className="font-semibold">No se encontraron datos de prueba para el serial: <span className="font-mono text-warning">{unitId}</span></h4>
                            <p className="text-sm">
                                Estatus de la unidad: <span className={`font-semibold ${statusColorClass}`}>{unitStatus}</span>
                            </p>
                        </div>
                    );
                }

                const overallResult = latestResult.result;
                const lastScanDate = new Date(latestResult.runDate).toLocaleString('es-MX', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
                const testSteps = latestResult.teststeps || [];

                return (
                    <div key={unitId} className="p-4 bg-base-200 rounded-lg">
                        <div className="mb-3 border-b border-base-300 pb-2">
                             <h4 className="text-md font-bold">
                                Serial: <span className="font-mono text-info">{unitId}</span>
                            </h4>
                            {/* --- LÍNEA AÑADIDA PARA MOSTRAR EL ESTATUS --- */}
                            <p className="text-sm">
                                Estatus de la unidad: <span className={`font-semibold ${statusColorClass}`}>{unitStatus}</span>
                            </p>
                        </div>

                        <div className="flex justify-between items-center mb-3 text-sm">
                            <p>
                                Resultado de Prueba: 
                                <span className={`font-bold ml-2 ${overallResult === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                                    {overallResult}
                                </span>
                            </p>
                            <p className="text-base-content/70">Fecha: {lastScanDate}</p>
                        </div>
                        
                        <div className="space-y-2">
                            {testSteps.map((step, stepIndex) => (
                                <div key={stepIndex} className="grid grid-cols-3 items-center text-sm p-1 hover:bg-base-300/50 rounded">
                                    <span className="text-base-content/80">{step.id}</span>
                                    <span className="text-center font-mono">{parseFloat(step.value).toFixed(2)}</span>
                                    <span className={`text-right font-semibold ${step.result === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                                        {step.result}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScanResultDisplay;