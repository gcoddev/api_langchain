'use strict'
import Video from '../models/Video.js'
// import Usuario from '../models/Usuario.js'
import { Sequelize } from 'sequelize'

const ControladorVideo = () => { }

ControladorVideo.getVideosAll = async (req, res) => {
    try {
        const videos = await Video.findAll({
            // include: ({
            //     model: Usuario
            // }),
            where: {
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (videos.length == 0) {
            return res.status(404).json({
                message: 'Sin videos'
            })
        }
        return res.status(200).json(videos)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

ControladorVideo.getVideos = async (req, res) => {
    const { id_user } = req.params
    try {
        const videos = await Video.findAll({
            where: {
                id_user: id_user,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (videos.length == 0) {
            return res.status(404).json({
                message: 'Sin videos'
            })
        }
        return res.status(200).json(videos)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err
        })
    }
}

ControladorVideo.getVideo = async (req, res) => {
    const { id_video } = req.params
    try {
        const video = await Video.findOne({
            where: {
                id_video: id_video,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (!video) {
            return res.status(404).json({
                message: 'El video no existe'
            })
        }
        return res.status(200).json(video)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorVideo.postVideo = async (req, res, next) => {
    const post = { ...req.body }
    const { id_user } = req.params
    try {
        const dataVideo = {
            titulo: post.titulo,
            url: post.url,
            descripcion: post.descripcion,
            id_user: id_user
        }

        await Video.create(dataVideo)

        res.status(200).json({
            message: 'Video agregado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorVideo.putVideo = async (req, res, next) => {
    const { id_video } = req.params
    const put = { ...req.body }
    try {
        const dataVideo = {
            titulo: put.titulo,
            url: put.url,
            descripcion: put.descripcion,
            estado: put.estado
        }
        const video = await Video.update(dataVideo, {
            where: {
                id_video: id_video
            }
        })
        if (!video[0]) {
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        res.status(200).json({
            message: 'Datos actualizados'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorVideo.deleteVideo = async (req, res, next) => {
    const { id_video } = req.params
    try {
        const dataVideo = {
            estado: '2'
        }
        const video = await Video.update(dataVideo, {
            where: {
                id_video: id_video
            }
        })
        if (!video[0]) {
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        res.status(200).json({
            message: 'Video eliminado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

export default ControladorVideo