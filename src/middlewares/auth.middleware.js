import ProjectMember from "../models/projectmember.model.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";

export const validateProjectPermission=(roles=[])=>asyncHandler(async(req,res,next)=>{
const {projectId}=req.params
if(!projectId) 
    return res.status(400).json(new ApiError(400,"please enter a valid project id"))

const project=await ProjectMember.findOne({
    project:projectId,
    user:req.user?.id
})
if(!project) 
    return res.status(400).json(new ApiError(400,"project not found"))

const givenRole=project?.role
req.user.role=givenRole
if(!roles.includes(givenRole))
    return res.status(400).json(new ApiError(400,"you dont have permission to perform this action"))
next()
})