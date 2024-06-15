import { exec } from 'child_process';

// Suponiendo que tienes el nombre del archivo PDF en una variable llamada 'pdfName'
const pdfName = 'de que tratan los pdf';

// Comando para ejecutar el script de Python y pasarle el nombre del archivo PDF como argumento
const command = `python3 load_embeddings.py ${pdfName}`;

// Ejecutar el comando
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar el comando: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    // Imprimir la salida del script de Python
    console.log(`stdout: ${stdout}`);
});
