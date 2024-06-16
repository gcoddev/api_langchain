'use strict'
import Usuario from '../models/Usuario.js'
import Rol from '../models/Rol.js'

import Cryptr from 'cryptr'
const cryptr = new Cryptr('keyCryptrNodeAPI')
import pass from '../libs/pass.js'
import keys from '../libs/keys.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { exec } from 'child_process'
import moment from 'moment'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ControladorUsuario = () => { }

ControladorUsuario.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const usuario = await Usuario.findOne({
            where: {
                username: username,
                estado: '1'
            }
        });
        if (usuario) {
            const credenciales = {
                nombres: usuario.nombres,
                key_usuario: usuario.id
            }
            const validarPassword = pass.comparaPassword(password, usuario.password);
            if (validarPassword) {
                const token = keys.createToken(credenciales);
                // const keyPer = cryptr.encrypt(usuario.id);
                res.status(200).json({
                    auth: true,
                    message: 'Bienvenido',
                    credencial: usuario.id,
                    token,
                    expires: moment().add(120, 'minutes').unix()
                })
            } else {
                res.status(401).json({
                    message: 'Contraseña incorrecta.'
                })
            }
        } else {
            res.status(400).json({
                message: 'Cuenta temporalmente Inactiva'
            })
        }
    } catch (err) {
        console.log(error)
        res.status(500).json({
            message: 'Ocurrió un error',
            error: err.message
        })
    }
}

ControladorUsuario.verificarToken = async (req, res, next) => {
    const post = { ...req.body }
    try {
        const verifity = keys.verificar(post.token);
        res.status(200).json({
            message: verifity
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrió un error',
            error: err.message
        })
    }
};

ControladorUsuario.getUsuario = async (req, res) => {
    const { id_user } = req.params
    try {
        const usuario = await Usuario.findOne({
            where: {
                id: id_user
            },
            include: ({
                model: Rol
            })
        })
        return res.status(200).json(usuario)
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorUsuario.postUsuario = async (req, res, next) => {
    const post = { ...req.body }
    try {
        const dataUsuario = {
            ci: post.ci,
            expedido: post.expedido,
            paterno: post.paterno,
            materno: post.materno,
            nombres: post.nombres,
            nacimiento: post.nacimiento,
            celular: post.celular,
            email: post.email,
            username: post.username,
            password: pass.encryptPassword(post.password)
        }
        await Usuario.create(dataUsuario)

        res.status(200).json({
            message: 'Usuario creado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorUsuario.putUsuario = async (req, res, next) => {
    const put = { ...req.body }
    const { id_user } = req.params
    try {
        const dataUsuario = {
            ci: put.ci,
            expedido: put.expedido,
            paterno: put.paterno,
            materno: put.materno,
            nombres: put.nombres,
            nacimiento: put.nacimiento,
            celular: put.celular,
            email: put.email,
            username: put.username,
            password: pass.encryptPassword(put.password),
            estado: put.estado,
            id_rol: put.id_rol
        }
        await Usuario.update(dataUsuario, {
            where: {
                id: id_user
            }
        })

        res.status(200).json({
            message: 'Usuario modificado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorUsuario.deleteUsuario = async (req, res, next) => {
    const { id_user } = req.params
    try {
        const dataUsuario = {
            estado: '2'
        }
        await Usuario.update(dataUsuario, {
            where: {
                id: id_user
            }
        })
        res.status(200).json({
            message: 'Usuario eliminado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

export default ControladorUsuario