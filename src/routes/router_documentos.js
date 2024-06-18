import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorDocumento from '../controllers/controller_documento.js'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import multer from 'multer'
import { v4 } from 'uuid';
import { exec } from 'child_process';

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

const responseUpload = (req, res, next) => {
    uploadPdf(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        } else {
            loadPdfs()
        }
        next();
    });
}

const loadPdfs = () => {
    console.log('Load pdfs for the embeddings...');
    exec('python3 load_pdf.py', (error, stdout, stderr) => {
        if (error) {
            console.log(`Error al ejecutar el comando: ${error.message}`)
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
        }
        console.log(stdout)
    });
}

router.route('/api/documentosAll')
    .get(ControladorDocumento.getDocumentosAll)

router.route('/api/documentos/:id_user')
    .get(ControladorDocumento.getDocumentos)
    .post(token.decodeToken, responseUpload, ControladorDocumento.postDocumento);


router.route('/api/documento/:id_doc')
    .get(ControladorDocumento.getDocumento)
    .put(token.decodeToken, ControladorDocumento.putDocumento)

router.route('/api/documento/:id_doc/:pdf')
    .put(token.decodeToken, responseUpload, ControladorDocumento.putDocumentoPdf)
    .delete(token.decodeToken, ControladorDocumento.deleteDocumento)

export default router