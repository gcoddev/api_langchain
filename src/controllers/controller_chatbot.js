'use strict';

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ControladorChatbot = () => { }

ControladorChatbot.preguntar = async (req, res) => {
    const data = { ...req.body };
    if (!data.user_question) {
        res.status(200).json({
            status: 'error',
            message: 'La pregunta es obligatoria'
        });
    } else if (data.user_question.length <= 7) {
        res.status(200).json({
            status: 'error',
            message: 'La pregunta debe tener como minimo 7 caracteres'
        });
    } else if (!data.user_id) {
        res.status(200).json({
            status: 'error',
            message: 'Id de usuario requerido'
        });
    } else {
        try {
            const command = `python3 load_embeddings.py '${data.user_question}' ${data.user_id}`;
            let msg_stdout = "";

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
                        let json
                        try {
                            json = JSON.parse(msg_stdout);
                            resolve(json);
                        } catch (error) {
                            console.error("Error al parsear el texto como JSON:", error);
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
}

export default ControladorChatbot;