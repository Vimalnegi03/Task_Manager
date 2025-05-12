import { validationResult } from "express-validator"
import ApiError from "../utils/api-error.js"
import { log } from "console"
export const validate=(req,res,next)=>{
   console.log(req?.email)
 const errors=validationResult(req)
 console.log(errors)
 if(errors.isEmpty()) {
    return next()
 }
 const extractedErrors=[]
 errors.array().map((err)=>extractedErrors.push({
    [err.path]:err.msg
 }))
 throw new ApiError(400,"Recieved data is not valid",extractedErrors)
}