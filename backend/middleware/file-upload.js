const multer=require('multer');
const uuid=require('uuid');
const cloudinary=require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//just sets our extension
const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
};


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});

// Configure direct Cloudinary streaming storage (Zero RAM / Zero Disk)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/images',
        public_id: (req, file) => uuid.v1()
    }
});

const fileUpload=multer({
    limits: 500000,
    storage: storage,//if not a valid ext send it back
    fileFilter: (req,file,cb)=>{
        const isValid=!!MIME_TYPE_MAP[file.mimetype];
        const error=isValid?null:new Error('Invalid mime type');
        cb(error,isValid);
    }
});

module.exports=fileUpload;
