import asyncHandler from "../utils/async-handler.js";

export const getProjects=asyncHandler(async(req,res)=>{})
export const getProjectById=asyncHandler(async(req,res)=>{})
export const createProject=asyncHandler(async(req,res)=>{})
export const updateProject=asyncHandler(async(req,res)=>{})
export const deleteProject=asyncHandler(async(req,res)=>{})
export const addMemberToProject=asyncHandler(async(req,res)=>{})
export const removeMemberFromProject=asyncHandler(async(req,res)=>{})
export const getProjectMembers=asyncHandler(async(req,res)=>{})
export const updateProjectMembers=asyncHandler(async(req,res)=>{})
export const updateMemeberRole=asyncHandler(async(req,res)=>{})  
export const deleteMember=asyncHandler(async(req,res)=>{})