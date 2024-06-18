'use strict'
import Documento from '../models/Documento.js'
import Usuario from '../models/Usuario.js'

import Cryptr from 'cryptr'
const cryptr = new Cryptr('keyCryptrNodeAPI')
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { exec } from 'child_process';
import { log } from 'console'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ControladorDocumento = () => { }

ControladorDocumento.getDocumentosAll = async (req, res) => {
    try {
        const documentos = await Documento.findAll({
            include: ({
                model: Usuario
            })
        })
        return res.status(200).json(documentos)
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

ControladorDocumento.getDocumentos = async (req, res) => {
    const { id_user } = req.params
    try {
        const documentos = await Documento.findAll({
            where: {
                id_user: id_user
            }
        })
        return res.status(200).json(documentos)
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

ControladorDocumento.getDocumento = async (req, res) => {
    const { id_doc } = req.params
    try {
        const documento = await Documento.findOne({
            where: {
                id_doc: id_doc
            }
        })
        return res.status(200).json(documento)
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.postDocumento = async (req, res, next) => {
    const post = { ...req.body }
    const { id_user } = req.params
    try {
        const dataDocumento = {
            titulo: post.titulo,
            descripcion: post.descripcion,
            documento: req.file.filename,
            fecha: post.fecha,
            estado: 1,
            id_user: id_user
        }

        const command = `python3 load_pdf.py`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`Error al ejecutar el comando: ${error.message}`)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
            }
            console.log(stdout)
        });

        await Documento.create(dataDocumento)

        res.status(200).json({
            message: 'Documento agregado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.putDocumento = async (req, res, next) => {
    const { id_doc } = req.params
    const put = { ...req.body }
    try {
        const dataDocumento = {
            titulo: put.titulo,
            descripcion: put.descripcion,
            fecha: put.fecha,
            estado: put.estado
        }
        await Documento.update(dataDocumento, {
            where: {
                id_doc: id_doc
            }
        })
        res.status(200).json({
            message: 'Datos actualizado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

ControladorDocumento.putDocumentoPdf = async (req, res, next) => {
    const { id_doc, pdf } = req.params
    try {
        const dataDocumento = {
            documento: req.file.filename
        }
        await Documento.update(dataDocumento, {
            where: {
                id_doc: id_doc
            }
        })
        fs.unlinkSync(path.join(__dirname, '../../public/documentos/' + pdf))
        res.status(200).json({
            message: 'Documento actualizado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

ControladorDocumento.deleteDocumento = async (req, res, next) => {
    const { id_doc, pdf } = req.params
    try {
        await Documento.destroy({
            where: {
                id_doc: id_doc
            }
        })
        fs.unlinkSync(path.join(__dirname, '../../public/documentos/' + pdf))
        res.status(200).json({
            message: 'Documento eliminado'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

export default ControladorDocumento