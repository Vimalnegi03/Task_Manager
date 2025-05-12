import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto'
const userSchema=new mongoose.Schema({
    avatar: {
        url: {
          type: String,
          default: "https://placehold.co/600x400"
        },
        localPath: {
          type: String,
          default: ""
        }
      },
username:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique:true,
    index:true
},
email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    index:true
},
fullName:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
isEmailVerified:{
    type:Boolean,
    default:false
},
forgotPasswordToken:{
    type:String,
},
forgotPasswordExpiry:{
    type:Date
},
refreshToken:{
    type:String
},
emailVerificationToken:{
    type:String
},
emailVerificationExpiry:{
    type:Date
},

},{timestamps:true})

userSchema.pre("save",async function(next)
{
if(this.isModified("password"))
{
    this.password=await bcrypt.hash(this.password,10);
}
next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    const isCorrect=await bcrypt.compare(password,this.password)
    return isCorrect
}
userSchema.methods.generateAccessToken=async function(next){
  const token= jwt.sign({
        _id:this._id,
        email:this.email
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    return token
  
}
userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign({
         _id:this._id,
         email:this.email
     },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY}) 
 }
 userSchema.methods.generateTemporaryToken=async function()
 {
    const unhashedToken=await crypto.randomBytes(32).toString("hex")
   const hashedToken =crypto.createHash("sha256")
                    .update(unhashedToken).digest("hex")

    const tokenExpiry=Date.now()+(20*60*1000)
    return {hashedToken,unhashedToken,tokenExpiry}
 }
const User=mongoose.model("User",userSchema)
export default User