// Force Node to use Google and Cloudflare DNS to bypass local network blockades
require("node:dns/promises").setServers(["8.8.8.8", "1.1.1.1"]);


const HttpError=require('../models/http-error.js');

const {validationResult}=require('express-validator');

const uuid=require('uuid');

const Place=require('../models/place.js');

const User=require('../models/user.js');

const fs=require('fs');

const mongoose=require('mongoose');


const getPlaceById= async (req,res,next)=>{
    //extract pid value
    const placeId=req.params.pid; // req has {pid: 'p1'}

    //check mongodb if place exist
    let place;
    try{
        place=await Place.findById(placeId);
    }catch(err){//connection error
        const error=new HttpError('error, couldnt find place',500);
        throw next(error);
    }

    //if place is empty (doesnt exist)
    if(!place){
        throw new HttpError('could not find place id',404);
    }

    res.json({place : place.toObject({getters:true})});//return the whole place
};

const getPlacesByUserId =async (req,res,next)=>{
    const userId=req.params.uid; // req has {uid: 'u1'}
    
    //try and catch to connect to mongo db
    let places;

    try{
        places=await Place.find({creator: userId});
    }catch(err){
        throw new HttpError('error, couldnt find user id',500);
    }


    if(!places || places.length===0){
        throw new HttpError('No places created.',404);
    }
    //respond w places
    res.json({places:places.map(place=>place.toObject({getters: true}))});
};


const createPlace =async(req,res,next)=>{

    const errors=validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data',422);
    }

    const { title, description, coordinates, address}=req.body;


    const createdPlace= new Place( {
        title,
        description,
        location: {
            lat: 0.00,
            lng: 0.00
        },
        address,
        creator:req.userData.userId,
        image: req.file.path
    });

    //j check if user alr exists before we save our place
    let user;

    try{
        user=await User.findById(req.userData.userId);
    }catch(err){
        throw new HttpError('creating place failed',500);
    }

    if(!user){
        throw new HttpError('could not find user id',404);
    }

    
    //Sessions define a chronological sequence of related database operations. 
    // Transactions—built on top of sessions—enable you to execute multiple read and write
    //operations across multiple documents and collections as a single "all-or-nothing" unit

    try{//save the place to mongo and push the place into user's places
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    }catch(err){
        console.log(err);
        const error=new HttpError(
            'creating place failed try again',
            500
        );
        return next(error);
    }

    res.status(201).json({place: createdPlace});

};

const updatePlace = async(req,res,next) => {

    //check if the requests are valid
    const errors=validationResult(req);
    //we dont want empty title or description
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data',422);
    }



    const { title,description }=req.body;
    const placeId=req.params.pid;

    //check mongodb if place exist
    let place;
    try{
        place=await Place.findById(placeId);
    }catch(err){//connection error
        const error=new HttpError('error, couldnt find place',500);
        throw next(error);
    }


    //verify if the editing user is the guy who actually the creator
    if(place.creator.toString()!==req.userData.userId){
        throw new HttpError('You didnt create the place',401);
    }

    place.title=title;
    place.description=description;
    //try to save into mongo
    try{
        await place.save();
    }catch(err){
        throw new HttpError('something went wrong,couldnt update',500);

    }


    res.status(200).json({place: place.toObject({getters: true})});
};

const deletePlace =async (req,res,next) => {
    const placeId=req.params.pid;

    let place;
    //get place by id in mongo
    try{
        place=await Place.findById(placeId).populate('creator');
    }catch(err){
        throw new HttpError('error, couldnt delete place',500);
    }

    // 2. Check if the place actually exists before trying to delete it
    if (!place) {
        return next(new HttpError('Could not find a place for this id.', 404));
    }


    if(place.creator.id!==req.userData.userId){
        throw new HttpError('You didnt create the place, invalid user',401);
    }
    const imagePath=place.image;

    //delete place by id in mongo
    try{
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session: sess});//delete place
        place.creator.places.pull(place);//delete it from the user's places array
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    }
    catch(err){
        throw new HttpError('error, couldnt delete place',500);
    }

    fs.unlink(imagePath,err=>{
        console.log(err);
    });
    res.status(200).json({message: "place deleted"});
};

exports.getPlaceById=getPlaceById;

exports.getPlacesByUserId=getPlacesByUserId;

exports.createPlace=createPlace;

exports.updatePlace=updatePlace;

exports.deletePlace=deletePlace;