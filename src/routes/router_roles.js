import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorRol from '../controllers/controller_rol.js'

router.route('/api/roles')
    .get(ControladorRol.getRoles)
    .post(token.decodeToken, ControladorRol.postRol)

router.route('/api/rol/:id_rol')
    .put(token.decodeToken, ControladorRol.putRol)
    .delete(token.decodeToken, ControladorRol.deleteRol)

export default router