import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorBlog from '../controllers/controller_blog.js'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import multer from 'multer'
import { v4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/imagenes'),
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname))
    }
})

const uploadImg = multer({
    storage,
    fileFilter: (req, file, cb) => {
        var filetypes = /gif|jpg|jpeg|png/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("Error, solo se permite los siguientes tipo de archivos: " + filetypes)
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
}).single('imagen')

const responseUpload = (req, res, next) => {
    uploadImg(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}


router.route('/api/blogsAll')
    .get(ControladorBlog.getBlogsAll)

router.route('/api/blogs/:id_user')
    .get(ControladorBlog.getBlogs)
    .post(token.decodeToken, responseUpload, ControladorBlog.postBlog);


router.route('/api/blog/:id_blog')
    .get(ControladorBlog.getBlog)
    .put(token.decodeToken, ControladorBlog.putBlog)

router.route('/api/blog/:id_blog/:img')
    .put(token.decodeToken, responseUpload, ControladorBlog.putBlogImg)
    .delete(token.decodeToken, ControladorBlog.deleteBlog)

export default router