import Note from "../models/note.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

export const getNotes=asyncHandler(async(req,res,next)=>{
    const {projectId}=req.params
  const project= await Project.findById(projectId)
  if(!project)
    return res.status(400).json(new ApiError(404,"project not founc"))
 const notes=await ProjectNote.find({
    project:projectId
 }).populate("createdBy","username fullName avatar")

 return res.status(200).json(new ApiResponse(200,notes,"notes successfully fteched"))
})

export const getNotesById=asyncHandler(async(req,res,next)=>{
    const {noteId}=req.params
   const note= await ProjectNote.findById(noteId).populate("createdBy","username fullName avatar")

   if(!note)
    return res.status(400).json(new ApiError(404,"no notes found "))
 res.status(200).json(new ApiResponse(200,note,"notes fetched successfully"))

})

export const createNote=asyncHandler(async(req,res,next)=>{
    const {projectId}=req.params
    const {content}=req.body
  const project=  await Project.findById(projectId)
  if(!project)
    return res.status(400).json(new ApiError(400,"no project found"))
const note=await Note.create({
    project:projectId,
    content,
    createdBy:user.req.id
})
const populatedNote=await ProjectNote.findById(note._id).populate("createdBy","username fullName avatar")
if(!populatedNote)
    return res.status(400).json(new ApiError(400,"no note created"))
res.status(200).json(new ApiResponse(200,populated,"note created successfully successfully"))

})

export const updateNote=asyncHandler(async(req,res,next)=>{
    const {noteId}=req.params
    const {content}=req.body
   const existingNote= await Note.findById(note)
   if(!existingNote)
    return res.status(400).json(new ApiError(400,"failed to find notes"))
    const note=await Note.findByIdAndUpdate(
        noteId,{
            content
        },
        {new:true}
    ).populate("createdBy","username fullName avatar")
    res.status(200).json(new ApiResponse(200,note,"note updated successfully"))
})


export const deleteNote=asyncHandler(async(req,res,next)=>{
    const {noteId}=req.params
    const note=await Note.findByIdAndDelete(noteId)
    if(!note)
        return res.status(400).json(new ApiError(400,"no note found"))
    res.status(200).json(new ApiResponse(200,note,"note deleted successfully"))
})