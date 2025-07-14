/* Este componente contiene la lógica para filtrar datos y generar archivos CSV. */
export const generateCSV = (data, filename) => {
    if (!data || data.length === 0) {
        alert("No hay datos que coincidan con los filtros seleccionados para generar el reporte.");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Fila de encabezado
        ...data.map(row =>
            headers.map(fieldName =>
                JSON.stringify(row[fieldName] ?? '')
            ).join(',')
        )
    ];

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};