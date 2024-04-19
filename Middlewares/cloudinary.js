const createError = require('http-errors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dub1nm5pa',
    api_key: '168674223973647',
    api_secret: '-WS7T-IcckSdwVSokfp5lmy5HZY'
});

const storage = multer.diskStorage({});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
});

const uploadImage = (req, res, next) => {

    upload.single('image')(req, res, async error => {
        try {
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.cloudinaryImageUrl = result.secure_url;
            }
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    });
};

module.exports = uploadImage;
