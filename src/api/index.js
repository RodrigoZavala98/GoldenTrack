import axios from 'axios';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'https://api-service-ags.cw01.contiwan.com:7241/api';
const MES_API_BASE_URL = 'https://iservice-equipment.fa.main.conti.de/v2.0/equipments/SMD_MOPS/units';

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

// --- FUNCIONES DE API PARA MES ---
export const getMesData = (serial) => {
    const requestUrl = `${MES_API_BASE_URL}/${serial},SMD_MOPS/testdata?testdataFilter=newest`;
    // Nota: El endpoint de MES podría requerir un método de fetch diferente
    // si tiene restricciones de CORS no compatibles con axios desde el navegador.
    // Por ahora, lo mantenemos con fetch como en tu código original.
    return fetch(requestUrl);
};