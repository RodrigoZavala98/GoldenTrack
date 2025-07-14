import React from 'react';

const ScanResultDisplay = ({ apiData }) => {
    const latestResult = apiData?.data?.[0];

    if (!latestResult) {
        return <p>No se encontraron datos de resultados para mostrar.</p>;
    }

    const overallResult = latestResult.result;
    
    // Usamos .toLocaleString() para que convierta la hora a la zona horaria local, por la diferencia de 6 horas que existe al traer el json.
    // La 'Z' en la fecha del JSON le dice a JavaScript que es UTC, y el navegador hace el resto.
    const lastScanDate = new Date(latestResult.runDate).toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Usar formato de 24 horas para mayor claridad
    });
    
    const testSteps = latestResult.teststeps || [];

    return (
        <div className="p-4 bg-base-100 rounded-lg font-sans">
            <div className="border-b border-gray-500 pb-3 mb-3">
                <p className="text-lg">
                    Result: 
                    <span className={`font-bold ml-2 ${overallResult === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                        {overallResult}
                    </span>
                </p>
                <p className="text-sm">
                    Último Pase: {lastScanDate}
                </p>
            </div>

            <div className="space-y-2">
                {testSteps.map((step, index) => (
                    <div key={index} className="grid grid-cols-3 items-center text-sm">
                        <span className="text">{step.id}</span>
                        <span className="text-center font-mono">{parseFloat(step.value).toFixed(2)}</span>
                        <span className={`text-right font-semibold ${step.result === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                            {step.result}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScanResultDisplay;