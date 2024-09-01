const sheetUrl = 'https://docs.google.com/spreadsheets/d/1YdmgulWSJhjcK4_AUPduqfemorgPXnu3l3nqoRFnXmo/export?format=csv';

function parseCSV(csvText) {
    const rows = csvText.trim().split('\n');
    return rows.map(row => {
        const cells = [];
        let cell = '';
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                cells.push(cell);
                cell = '';
            } else {
                cell += char;
            }
        }
        cells.push(cell); // Push the last cell
        return cells;
    });
}

function convertToSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return (minutes * 60) + seconds;
}

async function handleRequest() {
    try {
        const response = await fetch(sheetUrl);
        if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.status}`);
        const csvText = await response.text();

        // Parse the CSV text
        const data = parseCSV(csvText);

        const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, ...items] = data

        const discography = items.map(raw => {
            const track = {
                date: Number(raw[0]),
                album: raw[1],
                position: raw[3] ? Number(raw[3]) : undefined,
                title: raw[4] && !raw[4].includes("Track Missing") ? raw[4] : undefined,
                duration: raw[5] ? convertToSeconds(raw[5]) : undefined,
                overBitrateMp3: raw[7] ? Number(raw[7]) : undefined,
                trueBitrateMp3: raw[8] ? Number(raw[8]) : undefined
            };
            return track;
        });

        // Write discography to file
        const fs = require('fs');
        const path = require('path');
        const outputPath = path.resolve(__dirname, '../build/discography.js');
        const dataToWrite = `const discography = ${JSON.stringify(discography, null, 2)};\nexport default discography;`;
        
        fs.writeFileSync(outputPath, dataToWrite, 'utf8');

        console.log('Discography written to ../build/discography.js');

        return new Response('Data processed and written to file.', { status: 200 });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}

handleRequest();
