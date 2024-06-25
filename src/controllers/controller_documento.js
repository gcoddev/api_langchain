'use strict'
import Documento from '../models/Documento.js'
import Usuario from '../models/Usuario.js'

import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { Sequelize } from 'sequelize'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ControladorDocumento = () => { }

ControladorDocumento.getDocumentosAll = async (req, res) => {
    try {
        const documentos = await Documento.findAll({
            include: ({
                model: Usuario
            }),
            where: {
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (documentos.length == 0) {
            return res.status(404).json({
                message: 'Sin documentos'
            })
        }
        return res.status(200).json(documentos)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.getDocumentos = async (req, res) => {
    const { id_user } = req.params
    try {
        const documentos = await Documento.findAll({
            where: {
                id_user: id_user,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (documentos.length == 0) {
            return res.status(404).json({
                message: 'Sin documentos'
            })
        }
        return res.status(200).json(documentos)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.getDocumento = async (req, res) => {
    const { id_doc } = req.params
    try {
        const documento = await Documento.findOne({
            where: {
                id_doc: id_doc,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (!documento) {
            return res.status(404).json({
                message: 'El documento no existe'
            })
        }
        return res.status(200).json(documento)
    } catch (err) {
        console.log(err);
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
            id_user: id_user
        }

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
        }
        const doc = await Documento.update(dataDocumento, {
            where: {
                id_doc: id_doc,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        // if (!doc[0]) {
        //     res.status(404).json({
        //         message: 'El registro no existe'
        //     })
        // }
        res.status(200).json({
            message: 'Registro actualizado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.putDocumentoPdf = async (req, res, next) => {
    const { id_doc, pdf } = req.params
    try {
        const dataDocumento = {
            documento: req.file.filename
        }
        const doc = await Documento.update(dataDocumento, {
            where: {
                id_doc: id_doc,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (!doc[0]) {
            res.status(404).json({
                message: 'El documento no existe'
            })
        }
        const pdfPath = path.join(__dirname, '../../public/documentos/' + pdf)
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath)
        }
        res.status(200).json({
            message: 'Documento actualizado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.deleteDocumento = async (req, res, next) => {
    const { id_doc, pdf } = req.params
    try {
        const dataDocumento = {
            estado: '2'
        }
        const doc = await Documento.update(dataDocumento, {
            where: {
                id_doc: id_doc
            }
        })
        if (!doc[0]) {
            res.status(404).json({
                message: 'El documento no existe'
            })
        }
        const pdfPath = path.join(__dirname, '../../public/documentos/' + pdf)
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath)
        }
        res.status(200).json({
            message: 'Documento eliminado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorDocumento.estado = async (req, res, next) => {
    const { id_doc } = req.params
    const put = { ...req.body }
    try {
        await Documento.update({ estado: put.estado }, { where: { id_doc: id_doc } })

        res.status(200).json({
            message: 'Estado actualizado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

export default ControladorDocumento