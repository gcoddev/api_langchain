'use strict';

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ControladorChatbot = () => { };

ControladorChatbot.obtenerChat = async (req, res) => {
    const { user_id } = req.params;
    try {
        const convFilePath = join(__dirname, `../../public/conversations/conv_${user_id}.json`);

        let conversation = [];
        if (fs.existsSync(convFilePath)) {
            const rawData = fs.readFileSync(convFilePath);
            conversation = JSON.parse(rawData);
        } else {
            // Si el archivo no existe, crear el archivo con el mensaje de bienvenida
            conversation = [
                {
                    text: "Bienvenido/a al chat.",
                    type: "text",
                    status: "viewed",
                    isSender: false
                }
            ];
            fs.writeFileSync(convFilePath, JSON.stringify(conversation, null, 4));
        }

        res.status(200).json(conversation);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrió un error',
            error: err.message
        });
    }
};

ControladorChatbot.preguntar = async (req, res) => {
    const data = { ...req.body };
    if (!data.user_question) {
        res.status(200).json({
            status: 'error',
            message: 'La pregunta es obligatoria'
        });
    } else if (data.user_question.length <= 1) {
        res.status(200).json({
            status: 'error',
            message: 'La pregunta debe tener como mínimo 1 caracteres'
        });
    } else if (!data.user_id) {
        res.status(200).json({
            status: 'error',
            message: 'Id de usuario requerido'
        });
    } else {
        try {
            // Definir la ruta del archivo de conversación
            const convFilePath = join(__dirname, `../../public/conversations/conv_${data.user_id}.json`);

            // Leer el archivo de conversación o crear uno nuevo si no existe
            let conversation = [];
            if (fs.existsSync(convFilePath)) {
                const rawData = fs.readFileSync(convFilePath);
                conversation = JSON.parse(rawData);
            }

            // Agregar la pregunta del usuario a la conversación
            conversation.push({
                text: data.user_question,
                type: 'text',
                status: 'viewed',
                isSender: true
            });

            // Guardar la conversación actualizada en el archivo, creando el archivo si no existe
            fs.writeFileSync(convFilePath, JSON.stringify(conversation, null, 4));

            const command = `python3 load_embeddings.py '${data.user_question}' ${data.user_id}`;
            let msg_stdout = '';

            const executePython = () => {
                return new Promise((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            msg_stdout = `Error al ejecutar el comando: ${error.message}`;
                            reject(msg_stdout);
                        }
                        if (stderr) {
                            msg_stdout = `stderr: ${stderr}`;
                            reject(msg_stdout);
                        }
                        msg_stdout = `${stdout}`;

                        console.log(msg_stdout);
                        let json;
                        try {
                            json = JSON.parse(msg_stdout);
                            resolve(json);
                        } catch (error) {
                            console.error("Error al parsear el texto como JSON:", error);
                            reject(error);
                        }
                    });
                });
            };

            const jsonResponse = await executePython();
            res.status(200).json(jsonResponse);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Ocurrió un error',
                error: err.message
            });
        }
    }
};

export default ControladorChatbot;
