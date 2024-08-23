const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeSchema = new mongoose.Schema({
    firstname : {
        type:String,
        trim:true,
        required:true,
    },
    lastname : {
        type:String,
        trim:true,
        required:true,
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    gender : {
        type:String,
        required:true,
    },
    phonenumber : {
        type: Number,
        required:true,
        min:10,
        unique:true
    },
    age : {
        type: Number,
        required:true,
    },
    password : {
        type: String,
        required:true
    },
    confirmpassword : {
        type: String,
        required:true
    },
    tokens :[{
        token:{
            type:String,
            required:true
        }
    }]

})

//generating token
employeSchema.methods.generateAuthToken = async function(){
    try{
    const token = await jwt.sign({_id:this._id.toString()} , process.env.SECRET_KEY );
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
    }catch(err){
        res.send("err in token" + err)
        console.log("err in token" + err)
    }
}


//MIDDLEWERE
//converting password into hashing
employeSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
        this.confirmpassword = await bcrypt.hash(this.confirmpassword , 10)
    }
    next()
})

const Register = new mongoose.model("Register" , employeSchema );

module.exports =  Register ;