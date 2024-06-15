'use strict'

import Cryptr from 'cryptr'
const cryptr = new Cryptr('keyCryptrNodeAPI')
import pass from '../libs/pass.js'
import keys from '../libs/keys.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ControladorChatbot = () => { }

ControladorChatbot.preguntar = async (req, res) => {
    const data = { ...req.body }
    try {
        const command = `python3 load_embeddings.py ${data.question}`;
        let msg_stdout = ""
        const executePython = () => {
            return new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`Error al ejecutar el comando: ${error.message}`)
                        reject(msg_stdout);
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`)
                        reject(msg_stdout);
                    }
                    console.log(`${stdout}`)
                    resolve(msg_stdout);
                });
            });
        };
        msg_stdout = await executePython();
        res.status(200).json({
            message: msg_stdout
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

export default ControladorChatbot