'use strict'
import Rol from '../models/Rol.js'

import Cryptr from 'cryptr'
const cryptr = new Cryptr('keyCryptrNodeAPI')
import pass from '../libs/pass.js'
import keys from '../libs/keys.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { exec } from 'child_process'
import { log } from 'console'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ControladorRol = () => { }

ControladorRol.getRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll()
        return res.status(200).json(roles)
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorRol.postRol = async (req, res, next) => {
    const post = { ...req.body }
    try {
        const dataRol = {
            nombre: post.nombre,
            descripcion: post.descripcion
        }
        await Rol.create(dataRol)

        res.status(200).json({
            message: 'Rol creado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorRol.putRol = async (req, res, next) => {
    const put = { ...req.body }
    const { id_rol } = req.params
    try {
        const dataRol = {
            nombre: put.nombre,
            descripcion: put.descripcion,
            estado: put.estado
        }
        await Rol.update(dataRol, {
            where: {
                id_rol: id_rol
            }
        })

        res.status(200).json({
            message: 'Rol modificado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorRol.deleteRol = async (req, res, next) => {
    const { id_rol } = req.params
    try {
        const dataRol = {
            estado: '2'
        }
        await Rol.update(dataRol, {
            where: {
                id_rol: id_rol
            }
        })
        res.status(200).json({
            message: 'Rol eliminado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

export default ControladorRol