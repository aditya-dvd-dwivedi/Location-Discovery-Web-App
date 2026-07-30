const mongoose=require('mongoose');
//checks if all entries are unique
const uniqueValidator=require('mongoose-unique-validator').default;

const Schema=mongoose.Schema;
//blueprint for the user model
const userSchema = new Schema({
    name: {type: String, required: true},
    //this unique parameter j creates an index for email in the database
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true,minlength: 6},
    image: {type: String, required: true},
    places: [{type: mongoose.Types.ObjectId, required: true,ref: 'Place'}]
});
//does the check here
userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User',userSchema);