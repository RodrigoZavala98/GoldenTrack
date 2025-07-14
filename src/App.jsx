import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Sidebar from './components/common/Sidebar';
import Modal from './components/common/Modal';
import ScanResultDisplay from './components/common/ScanResultDisplay'; // <-- 1. Importa el nuevo componente

// ... (tus otras importaciones de vistas)
import Dashboard from './views/Dashboard';
import PieceManagement from './components/pieces/PieceManagement';
import LineManagement from './components/lines/LineManagement';
import Reports from './views/Reports';
import ToolingManagement from './components/tooling/ToolingManagement';
import ToolingDashboard from './components/tooling/ToolingDashboard';
// ...

export default function App() {
    const { page, loading, modalInfo, setModalInfo } = useContext(AppContext);

    // Esta función decidirá qué componente de página mostrar
    const renderPage = () => {
        if (loading) {
            return <div className="w-full text-center p-10">
                       <p className="text-gray-500 dark:text-gray-400">Cargando datos desde la API...</p>
                   </div>;
        }
		
		switch (page) {
            case 'dashboard':
                return <Dashboard />;
            case 'pieces':
                return <PieceManagement />;
            case 'lines':
                return <LineManagement />;
            case 'toolingManagement':
                return <ToolingManagement />;
            case 'toolingDashboard':
                return <ToolingDashboard />;
            case 'reports':
                return <Reports />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen font-sans">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 p-6 lg:p-8">
                {renderPage()}
            </main>

            {/* El Modal ahora usará nuestro componente de formato */}
            <Modal
                isOpen={!!modalInfo}
                onClose={() => setModalInfo(null)}
                // El título del modal ahora usa el nombre de la pieza
                title={`Detalles de: ${modalInfo?.piece?.nombre || ''}`}
            >
                {modalInfo?.loading && <p className="text-center">Cargando datos desde MES...</p>}
                {modalInfo?.error && <p className="text-red-500 text-center">Error: {modalInfo.error}</p>}
                
                {/* 2. Aquí está la magia: si hay datos, renderizamos nuestro componente formateador */}
                {modalInfo?.data && <ScanResultDisplay apiData={modalInfo.data} />}

            </Modal>
        </div>
    );
}