import express from 'express'
import http from 'http'
import { fileURLToPath } from 'url';
import { dirname } from 'path'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
const app = express()
const server = http.createServer(app)
import db from './src/configs/db.js'
import dotenv from 'dotenv'
dotenv.config()

db.sync()
    .then(() => console.log('Conectado'))
    .catch(error => console.log(error))

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

import router_rol from './src/routes/router_roles.js'
app.use(router_rol)
import router_usuario from './src/routes/router_usuarios.js'
app.use(router_usuario)
import router_documento from './src/routes/router_documentos.js'
app.use(router_documento)
import router_blog from './src/routes/router_blogs.js'
app.use(router_blog)
import router_video from './src/routes/router_videos.js'
app.use(router_video)
import router_chatbot from './src/routes/router_chatbot.js'
app.use(router_chatbot)

const port = process.env.PORT || 3001

server.listen(port, () => {
    console.log(`Server connected to http://${process.env.URL}:${port}`);
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + '/public'))