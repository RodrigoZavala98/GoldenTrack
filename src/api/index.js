import axios from 'axios';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'https://fa00053vma.automotive-wan.com:7241/api';
const MES_API_BASE_URL = 'https://iservice-equipment.fa.main.conti.de/v2.0/equipments/SMD_MOPS/units';
const MES_API_V2_BASE = 'https://iservice-equipment.fa.main.conti.de/v2.0/equipments';
const LOCAL_LOG_API_URL = 'https://fa00053vma.automotive-wan.com:7245/api'; // Nueva API local

// --- FUNCIONES DE API PARA LÍNEAS ---
export const getLines = () => axios.get(`${API_BASE_URL}/Lineas`);
export const addLine = (line) => axios.post(`${API_BASE_URL}/Lineas`, line);
export const deleteLine = (id) => axios.delete(`${API_BASE_URL}/Lineas/${id}`);

// --- FUNCIONES DE API PARA PIEZAS GOLDEN ---
export const getPieces = () => axios.get(`${API_BASE_URL}/PiezasGolden`);
export const addPiece = (piece) => axios.post(`${API_BASE_URL}/PiezasGolden`, piece);
export const deletePiece = (id) => axios.delete(`${API_BASE_URL}/PiezasGolden/${id}`);

// --- FUNCIONES DE API PARA HERRAMENTALES ---
export const getToolings = () => axios.get(`${API_BASE_URL}/Herramentales`);
export const addTooling = (tooling) => axios.post(`${API_BASE_URL}/Herramentales`, tooling);
export const deleteTooling = (id) => axios.delete(`${API_BASE_URL}/Herramentales/${id}`);

/**
 * Obtiene los datos de las pruebas para un serial específico.
 */
export const getMesData = (serial) => {
    // NOTA: Puede que el equipment 'SMD_MOPS' también deba ser dinámico.
    const requestUrl = `${MES_API_V2_BASE}/SMD_MOPS/units/${serial},CCN_SEMI/testdata?testdataFilter=newest`;
    return fetch(requestUrl);
};
// --- FUNCIONES DE API PARA MES ---
// export const getMesData = (serial) => {
//    const requestUrl = `${MES_API_BASE_URL}/${serial},CCN_SEMI/testdata?testdataFilter=newest`;
//    return fetch(requestUrl);
//};

export const getPanelUnits = (serial, lineName) => {
    // Reemplazamos espacios en el nombre de la línea por si acaso y lo usamos como 'equipment'
    const equipment = lineName.replace(/\s/g, '_'); 
    const requestUrl = `${MES_API_V2_BASE}/${equipment}/units/${serial},SMD_MOPS?includeSerialchange=true`;
    return fetch(requestUrl);
};

/**
 * Obtiene los datos de un herramental (incluyendo estado de bloqueo) de la API de MES.
 * @param {string} serial - El nombre del herramental.
 * @param {string} lineName - El nombre de la línea para construir la URL.
 * @returns {Promise} - La promesa de la petición fetch.
 */
export const getToolingData = (serial, lineName) => {
    // Asumimos que el nombre de la línea es el 'equipment' en la URL
    const equipment = lineName.replace(/\s/g, '_');
    const requestUrl = `${MES_API_V2_BASE}/${equipment}/carriers/${serial},SMT_TOOLING`;
    return fetch(requestUrl);
};

/**
 * Obtiene todos los datos de log de la nueva API local.
 * @returns {Promise} - La promesa de la petición fetch.
 */
export const getLogData = () => {
    return fetch(`${LOCAL_LOG_API_URL}/LogData`);
};