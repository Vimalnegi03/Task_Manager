import ApiError from "../utils/api-error.js"
import ApiResponse from "../utils/api-response.js"
export const healthcheck=async(req,res)=>{
   res.status(200).json(new ApiResponse(200,{message:"Server is running"}))
}