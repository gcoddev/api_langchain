import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorChatbot from '../controllers/controller_chatbot.js'

router.route('/')
    .get(async (req, res) => {
        const html = await `<!DOCTYPE html><html><head><title>Chatbot langchain</title><body><h1>Welcome chatbot</h1></body></head></html>`
        res.status(200).send(html)
    })

router.route('/api')
    .get((req, res) => {
        res.status(200).json({
            status: 'ok',
            message: 'Chatbot online'
        });

    })

router.route('/api/ask')
    .post(token.decodeToken, ControladorChatbot.preguntar)

export default router