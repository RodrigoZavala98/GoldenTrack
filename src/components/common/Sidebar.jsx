import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { LayoutDashboard, ClipboardList, HardDrive, Wrench, Factory, FileText, X, Sun, Moon } from 'lucide-react';

const NavLink = ({ icon: Icon, label, pageName }) => {
    const { page, setPage, setSidebarOpen } = useContext(AppContext);

    return (
        <button
            onClick={() => {
                setPage(pageName);
                setSidebarOpen(false);
            }}
            className={`btn justify-start w-full flex items-center w-full px-4 py-6 text-left rounded-lg transition-colors duration-200 hover:bg-base-300 ${
                page === pageName ? 'btn-primary' : 'btn-ghost hover:bg-base-300'
            }`}
        >
            <Icon className="mr-4" size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );
};

// Lista de temas para generar el dropdown dinámicamente
const themes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula'];

const Sidebar = () => {
        // Nos aseguramos de obtener la función 'setTheme' del contexto.
    const { isSidebarOpen, setSidebarOpen, userRole, setUserRole, setTheme  } = useContext(AppContext);

    return (
        <aside className={`bg-base-200 text-base-content w-64 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 border-r border-base-300 flex flex-col`}>
            <div className="p-6 flex items-center justify-between border-b border-base-300 ">
                <div className="flex items-center">
                    <img src="/Aumovio.svg" alt="Logo" className="h-8 w-auto mr-3" />
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn btn-ghost btn-square ">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2 btn-ghost">
                <NavLink icon={LayoutDashboard} label="Dashboard" pageName="dashboard" />
                <NavLink icon={ClipboardList} label="Dashboard Herramentales" pageName="toolingDashboard" />
                {userRole === 'editor' && (
                    <>
                        <NavLink icon={HardDrive} label="Gestionar Piezas" pageName="pieces" />
                        <NavLink icon={Wrench} label="Gestionar Herramentales" pageName="toolingManagement" />
                        <NavLink icon={Factory} label="Gestionar Líneas" pageName="lines" />
                    </>
                )}
                <NavLink icon={FileText} label="Reportes" pageName="reports" />
            </nav>
            <div className="p-4 mt-auto border-t border-base-300 space-y-4">

                 {/* Dropdown de Temas Conectado al Contexto */}
                <div className="dropdown dropdown-top w-full">
                    <div tabIndex={0} role="button" className="btn w-full">
                        Cambiar tema
                        <svg width="12px" height="12px" className="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
                    </div>
                    <ul tabIndex={0} className="dropdown-content bg-base-200 rounded-box z-[1] w-52 p-2 shadow-2xl">
                        {themes.map(themeName => (
                            <li key={themeName}>
                                {/* Al hacer clic, llamamos a setTheme del contexto */}
                                <a onClick={() => setTheme(themeName)} className="w-full text-start btn btn-sm btn-ghost justify-start">
                                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Selector de Rol del Usuario */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Rol Actual</label>
                    <select value={userRole} onChange={e => setUserRole(e.target.value)} className="select select-bordered w-full mb-1">
                        <option value="editor">Editor</option>
                        <option value="viewer">Visualizador</option>
                    </select>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;