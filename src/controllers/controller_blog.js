'use strict'
import Blog from '../models/Blog.js'
// import Usuario from '../models/Usuario.js'

import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { Sequelize } from 'sequelize'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ControladorBlog = () => { }

ControladorBlog.getBlogsAll = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            // include: ({
            //     model: Usuario
            // }),
            where: {
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (blogs.length == 0) {
            return res.status(404).json({
                message: 'Sin blogs'
            })
        }
        return res.status(200).json(blogs)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorBlog.getBlogs = async (req, res) => {
    const { id_user } = req.params
    try {
        const blogs = await Blog.findAll({
            where: {
                id_user: id_user,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (blogs.length == 0) {
            return res.status(404).json({
                message: 'Sin blogs'
            })
        }
        return res.status(200).json(blogs)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorBlog.getBlog = async (req, res) => {
    const { id_blog } = req.params
    try {
        const blog = await Blog.findOne({
            where: {
                id_blog: id_blog,
                estado: {
                    [Sequelize.Op.ne]: '2'
                }
            }
        })
        if (!blog) {
            return res.status(404).json({
                message: 'El blog no existe'
            })
        }
        return res.status(200).json(blog)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorBlog.postBlog = async (req, res, next) => {
    const post = { ...req.body }
    const { id_user } = req.params
    try {
        const dataBlog = {
            titulo: post.titulo,
            descripcion: post.descripcion,
            imagen: req.file.filename,
            contenido: post.contenido,
            id_user: id_user
        }

        await Blog.create(dataBlog)

        res.status(200).json({
            message: 'Blog agregado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorBlog.putBlog = async (req, res, next) => {
    const { id_blog } = req.params
    const put = { ...req.body }
    try {
        const dataBlog = {
            titulo: put.titulo,
            descripcion: put.descripcion,
            contenido: put.contenido,
            estado: put.estado,
        }
        const blog = await Blog.update(dataBlog, {
            where: {
                id_blog: id_blog
            }
        })
        console.log(blog);
        if (!blog[0]) {
            res.status(404).json({
                message: 'El blog no existe'
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

ControladorBlog.putBlogImg = async (req, res, next) => {
    const { id_blog, img } = req.params
    try {
        const dataBlog = {
            imagen: req.file.filename
        }
        const blog = await Blog.update(dataBlog, {
            where: {
                id_blog: id_blog
            }
        })
        if (!blog[0]) {
            res.status(404).json({
                message: 'El blog no existe'
            })
        }
        const imagePath = path.join(__dirname, '../../public/imagenes/', img);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        res.status(200).json({
            message: 'Imagen blog actualizado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

ControladorBlog.deleteBlog = async (req, res, next) => {
    const { id_blog, img } = req.params
    try {
        const dataBlog = {
            estado: '2'
        }
        await Blog.update(dataBlog, {
            where: {
                id_blog: id_blog
            }
        })
        const imagePath = path.join(__dirname, '../../public/imagenes/', img);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        res.status(200).json({
            message: 'Blog eliminado'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ocurrio un error',
            error: err.message
        })
    }
}

export default ControladorBlog