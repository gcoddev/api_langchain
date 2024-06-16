import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorDocumento from '../controllers/controller_documento.js'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import multer from 'multer'
import { uuid } from 'uuidv4'
import { v4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/documentos'),
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname))
    }
})

const uploadPdf = multer({
    storage,
    fileFilter: (req, file, cb) => {
        var filetypes = /pdf/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("Error, solo se permite los siguientes tipo de archivos: " + filetypes)
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }
}).single('documento')


router.route('/api/documentosAll')
    .get(ControladorDocumento.getDocumentosAll)

router.route('/api/documentos/:id_user')
    .get(ControladorDocumento.getDocumentos)
    .post(token.decodeToken, (req, res, next) => {
        uploadPdf(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.' });
                }
                return res.status(400).json({ message: err.message });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    }, ControladorDocumento.postDocumento);


router.route('/api/documento/:id_doc')
    .get(ControladorDocumento.getDocumento)
    .put(token.decodeToken, ControladorDocumento.putDocumento)

router.route('/api/documento/:id_doc/:pdf')
    .put(token.decodeToken, uploadPdf, ControladorDocumento.putDocumentoPdf)
    .delete(token.decodeToken, ControladorDocumento.deleteDocumento)

export default router