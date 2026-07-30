const uuid=require('uuid');

const HttpError=require('../models/http-error.js');

const {validationResult}=require('express-validator');

const User=require('../models/user.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const getUsers=async(req,res,next)=>{

    //get all users except password
    let users;
    try{
        users=await User.find({},'-password');
    }catch(err){
        throw new HttpError('fetching users failed, try again later',500);
    }
    //return response
    res.json({users: users.map(user=>user.toObject({getters: true}))});

};

const signup= async(req,res,next)=>{
    //check if the requests are valid
    const errors=validationResult(req);
    //we dont want empty title or description
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data',422);
    }

    const { name, email, password}=req.body;


    //check if user exists in mongodb
    let existingUser;
    try{
        existingUser=await User.findOne({email:email})
    }catch(error){//if we didnt connect to mongo
        throw new HttpError('signing up failed, try again later',500);
    }

    //if user already exists why signup
    if(existingUser){
        throw new HttpError('user exist already, please login',422);
    }


    //we must encrypt our password
    let hashedPassword;
    try{//hash the normal password text w a security of 12
        hashedPassword=await bcrypt.hash(password,12);
    }catch(err){
        throw new HttpError('could not create user, please try again',500);
    }

    //create temp variable and push otherwise
    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        places: [],
        image: req.file.path
    });

    //use this to save the user
    try{
        await createdUser.save();
    }catch(err){
        const error=new HttpError(
            'signing up failed try again',
            500
        );
        return next(error);
    }

    let token;
    try{
        token=jwt.sign(
            {userId: createdUser.id,email: createdUser.email},
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        );
    }catch(err){
        const error=new HttpError(
            'signing up failed try again',
            500
        );
        return next(error);
    }


    res.status(201).json({user: createdUser.id,email: createdUser.email,token:token});

};

const login =async(req,res,next)=>{

    const { email, password}=req.body;


    //check if user exists in mongodb
    let existingUser;
    try{
        existingUser=await User.findOne({email:email})
    }catch(error){//if we didnt connect to mongo
        throw new HttpError('logging in failed, try again later',500);
    }
    //if user doesnt exist or password wrong
    if(!existingUser){
        throw new HttpError('email is wrong or password is wrong',404);
    }

    //we must check if hashedPassword is our normal text password
    let isValidPassword=false;
    try{//returns true if its the same pass
        isValidPassword=await bcrypt.compare(password,existingUser.password);
    }catch(err){
        throw new HttpError('could not log you in, please check your credentials and try again',401);
    }

    //if theres no error in try and catch and the password isnt valid
    if(!isValidPassword){
       throw new HttpError('invalid credentials, could not log you in.',404); 
    }
    //if isValidPassword then we are logged in

    
    let token;
    try{
        token=jwt.sign(
            {userId: existingUser.id,email: existingUser.email},
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        );
    }catch(err){
        const error=new HttpError(
            'signing up failed try again',
            500
        );
        return next(error);
    }


    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token:token
    });
};

exports.getUsers=getUsers;

exports.signup=signup;

exports.login=login;
