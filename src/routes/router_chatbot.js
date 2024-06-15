import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorChatbot from '../controllers/controller_chatbot.js'

router.route('/api/ask')
    .post(token.decodeToken, ControladorChatbot.preguntar)

export default router