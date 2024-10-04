"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = void 0;
const multer = require('multer');
const path = require('path');
// Configurar o armazenamento de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Nome único para cada imagem
    }
});
// Filtrar arquivos (aceitar apenas imagens)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    }
    else {
        cb(new Error('Apenas imagens são permitidas!'));
    }
};
// Middleware de upload para múltiplas imagens
exports.uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB por imagem
    fileFilter: fileFilter
}).array('images', 10); // Permitir até 10 ima
//# sourceMappingURL=fileUpload.js.map