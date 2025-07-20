import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getLines, getPieces, getToolings } from '../api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
        // --- ESTADO GENERAL DE LA UI ---
    const [page, setPage] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [modalInfo, setModalInfo] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState('editor'); // Estado del rol del usuario, por defecto 'editor'
    const [theme, setTheme] = useState('dracula'); // Declaración del estado del tema
    // --- ESTADO DE LOS DATOS DE LA API ---
    const [pieces, setPieces] = useState([]);
    const [lines, setLines] = useState([]);
    // --- ESTADO DE LAS PIEZAS ESPECIALES ---
    const [toolings, setToolings] = useState([]); // Renombrado de specialPieces a toolings

    // --- ESTADO DE LOS DATOS DE ESCANEOS ---
    // Aquí es donde creamos la variable 'scanData' y su función 'setScanData'.
    // Esta variable contendrá los datos de los últimos escaneos de las piezas
    // y se actualizará cada vez que se haga un nuevo escaneo.
    const [scanData, setScanData] = useState({});

    // --- Función para obtener los datos de la API ---
    // Usamos useCallback para evitar que la función se recree en cada renderizado.
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [linesRes, piecesRes, toolingsRes] = await Promise.all([
                getLines(),
                getPieces(),
                getToolings()
            ]);
            setLines(linesRes.data);
            setPieces(piecesRes.data);
            setToolings(toolingsRes.data);
        } catch (error) {
            console.error("Error al obtener los datos de la API:", error);
            alert("No se pudo conectar con el servidor. Asegúrate de que la API se está ejecutando y que la configuración de CORS es correcta.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Efecto para manejar el tema de la aplicación ---
    // Este efecto se ejecuta cada vez que cambia el tema.
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);


    // Agrupamos todos los valores y funciones que queremos que sean globales
    const value = {
        page, setPage,
        pieces,
        lines,
        toolings, // Usamos el nuevo nombre
        loading, // Estado de carga general
        modalInfo, setModalInfo, // Información del modal
        isSidebarOpen, setSidebarOpen, // Estado de la barra lateral
        userRole, setUserRole, // Rol del usuario
        theme, setTheme, // Tema de la aplicación
        fetchData, // Exponemos fetchData para poder recargar los datos desde cualquier componente
        scanData, // Datos de escaneos
        setScanData // Función para actualizar los datos de escaneos
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};