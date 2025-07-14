export const getExpirationStatus = (expirationDateString) => {
    // 1. Verificación inicial más robusta
    if (!expirationDateString || typeof expirationDateString !== 'string') {
        return { colorClass: 'bg-gray-400 dark:bg-gray-600', textColor: 'text-white', text: 'Sin fecha' };
    }

    const datePart = expirationDateString.split('T')[0];
    const parts = datePart.split('-');

    // 2. Verificación CRUCIAL: Asegurarnos de que tenemos un array con año, mes y día
    if (parts.length < 3) {
        console.error("Formato de fecha inválido recibido:", expirationDateString);
        return { colorClass: 'bg-gray-500', textColor: 'text-white', text: 'Fecha Inválida' };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // El mes es 0-indexado en JS
    const day = parseInt(parts[2], 10);

    // 3. Verificamos si la conversión a número fue exitosa
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.error("Componentes de fecha inválidos:", parts);
        return { colorClass: 'bg-gray-500', textColor: 'text-white', text: 'Fecha Inválida' };
    }

    const expiration = new Date(year, month, day);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { colorClass: 'bg-red-500', textColor: 'text-white', text: `Expirado` };
    if (diffDays <= 20) return { colorClass: 'bg-red-500', textColor: 'text-white', text: `Expira en ${diffDays} días` };
    if (diffDays <= 40) return { colorClass: 'bg-yellow-400', textColor: 'text-gray-800', text: `Expira en ${diffDays} días` };
    return { colorClass: 'bg-emerald-400', textColor: 'text-white', text: 'Vigente' };
};