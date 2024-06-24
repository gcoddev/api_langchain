import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorUsuario from '../controllers/controller_usuario.js'

router.route('/api/login')
    .post(ControladorUsuario.login)

router.route('/api/token')
    .post(ControladorUsuario.verificarToken)

router.route('/api/usuarios')
    .get(token.decodeToken, ControladorUsuario.getUsuarios)
    .post(token.decodeToken, ControladorUsuario.postUsuario)

router.route('/api/usuario/:id_user')
    .get(token.decodeToken, ControladorUsuario.getUsuario)
    .put(token.decodeToken, ControladorUsuario.putUsuario)
    .delete(token.decodeToken, ControladorUsuario.deleteUsuario)


// App
router.route('/api/loginApp')
    .post(ControladorUsuario.loginApp)

router.route('/api/usuariosApp')
    .post(ControladorUsuario.postUsuarioApp)

router.route('/api/usuarioApp/:id_user')
    .put(ControladorUsuario.putUsuarioApp)

export default router