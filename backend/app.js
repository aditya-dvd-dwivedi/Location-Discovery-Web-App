// Force Node to use Google and Cloudflare DNS to bypass local network blockades
require("node:dns/promises").setServers(["8.8.8.8", "1.1.1.1"]);

const express=require('express');
const bodyParser=require('body-parser');

const placesRoutes=require('./routes/places-routes');
const HttpError = require('./models/http-error');

const usersRoutes=require('./routes/users-routes');

const app=express();

const mongoose=require('mongoose');
const fs=require('fs');
const path=require('path');

app.use(bodyParser.json());
//allows frontend to access backend images
app.use('/uploads/images',express.static(path.join('uploads','images')));

//this handles the CORS error when we initially connect to frontend
//frontend wants backend also to be on same domain like (localhost3k or 5k)
//this j tells frontend to let it work
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/places',placesRoutes);

app.use('/api/users',usersRoutes);

app.use( (req,res,next) => {
    const error=new HttpError('Could not find route',404);
    throw error;
});

//error handler
app.use((error,req,res,next)=>{
    //unlink image on our general error handler
    //we dont want unecessary saving of image if we have a signup error
    if(req.file){
        fs.unlink(req.file.path,err=>{
            console.log(err);
        });
    }

    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500);
    res.json({message:error.message||'An unknown error occured'});
});

//if our connection to mongo is successful
//then we connect to local host 5000
//ow j throw error
mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kquazjj.mongodb.net/${process.env.DB_NAME}?appName=Cluster0`)
    .then(()=>{
        app.listen(process.env.PORT||5000);
    })
    .catch(err =>{
        console.log(err);
    })
;
