import jwt from 'jsonwebtoken'
import moment from 'moment'
import config from './config.js';
import express from 'express'
const token = express.Router();


token.createToken = (usuario) => {
    let payload = {
        iss: 'ApiChatbotLangChain',
        sub: usuario.key_usuario,
        name: usuario.nombres,
        iat: moment().unix(),
        exp: moment().add(120, 'minutes').unix()
    }
    return jwt.sign(payload, config.JWT_SECRET)
}

token.decodeToken = (req, res, next) => {

    // captura la Informacionde autorización
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('No autorizado');
        res.status(401).json({ message: 'Sin cabecera' });
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let revisarToken;
    try {
        revisarToken = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        res.status(500).json({ message: 'No Autenticado' });
        error.statusCode = 500;
        throw error;
    }
    if (!revisarToken) {
        const error = new Error('No Autenticado');
        error.statusCode = 401;
        throw error;
    }
    next();
}
token.verificar = (bearer_token) => {
    try {
        return jwt.verify(bearer_token, config.JWT_SECRET);
    } catch (error) {
        return error.message
    }
}

export default token