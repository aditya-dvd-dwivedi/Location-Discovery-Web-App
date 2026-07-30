const express= require('express');

const {check}=require('express-validator');

const router=express.Router();

const HttpError=require('../models/http-error.js');

const placesControllers=require('../controllers/places-controllers.js');
const fileUpload=require('../middleware/file-upload.js');

const checkAuth=require('../middleware/auth-check.js');


router.get('/:pid',placesControllers.getPlaceById);

router.get('/user/:uid',placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ],
    placesControllers.createPlace
);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5})
    ],
    placesControllers.updatePlace
);

router.delete('/:pid',placesControllers.deletePlace);

module.exports=router;