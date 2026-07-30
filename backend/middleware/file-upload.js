const multer=require('multer');
const uuid=require('uuid');

//just sets our extension
const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
};

const fileUpload=multer({
    limits: 500000,
    storage: multer.diskStorage({
        //where to save images
        destination: (req,file,cb)=>{
            cb(null,'uploads/images')

        },//set filename of what we save
        filename: (req,file,cb)=>{
            const ext=MIME_TYPE_MAP[file.mimetype];
            cb(null,uuid.v1()+'.'+ext);
        }
    }),//if not a valid ext send it back
    fileFilter: (req,file,cb)=>{
        const isValid=!!MIME_TYPE_MAP[file.mimetype];
        const error=isValid?null:new Error('Invalid mime type');
        cb(error,isValid);
    }
});

module.exports=fileUpload;
