import multer from 'multer';

const singleUpload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('avatar');

export {
     singleUpload
}