import asyncHandler from "../utils/async-handler.js";
import Project from '../models/project.model.js'
import ApiError from '../utils/api-error.js'
import ApiResponse from "../utils/api-response.js";
import ProjectMember from '../models/projectmember.model.js'
import User from '../models/user.model.js'
export const getProjects=asyncHandler(async(req,res)=>{
    const userId=req.user?.id
    if(!userId)
        return res.status(400).json(new ApiError(400,"Please log in to acess this"))
const projects=await Project.find({createdBy:userId})
if(!projects)
    return res.status(400).json(new ApiError(400,"no projects found"))
 res.status(200).json(new ApiResponse(200,projects,"successfully found groups you are associated with"))
})

export const getProjectById=asyncHandler(async(req,res)=>{
    const userId=req.user?.id
    const {projectId}=req.params
    if(!userId)
        return res.status(400).json(new ApiError(400,"please log in to access this feature"))
    if(!projectId)
        return res.status(400).json(new ApiError(400,"please enter a valid project id"))
  const project=await Project.findOne({_id:projectId})
  if(!project)
    return res.status(400).json(400,"no project found with this id")
res.status(200).json(new ApiResponse(200,project,"project successfully fetched"))

})


export const createProject=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
   const id=req.user?.id
  const project= await Project.create({name,description,createdBy:id})
  if(!project)
    return res.status(400).json(new ApiError(400,"failed to create project"))
return res.status(200).json(new ApiResponse(200,project,"project created successfully"))
})


export const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json(new ApiError(400, "Please provide a valid project ID"));
    }
  
    const { name, description } = req.body;
    if (!name && !description) {
      return res.status(400).json(new ApiError(400, "Please provide either name or description"));
    }
  
    const id = req.user?.id;
  
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
  
    if (project.createdBy.toString() !== id) {
      return res.status(403).json(new ApiError(403, "Only the creator is allowed to update this project"));
    }
  
    if (name) project.name = name;
    if (description) project.description = description;
  
    await project.save();
  
    res.status(200).json(new ApiResponse(200, project, "Project details successfully updated"));
  });
  
  export const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json(new ApiError(400, "Please provide a valid project ID"));
    }
  
    const userId = req.user?.id;
  
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
  
    if (project.createdBy.toString() !== userId) {
      return res.status(403).json(new ApiError(403, "Only the creator is allowed to delete this project"));
    }
  
    await project.deleteOne(); // or Project.findByIdAndDelete(projectId)
  
    res.status(200).json(new ApiResponse(200, null, "Project successfully deleted"));
  });
  
  export const addMemberToProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const creatorId = req.user?.id;
  
    if (!projectId) {
      return res.status(400).json(new ApiError(400, "Please provide a valid project ID"));
    }
  
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
  
    if (project.createdBy.toString() !== creatorId) {
      return res.status(403).json(new ApiError(403, "Only the project creator can add members"));
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User with this email not found"));
    }
  
    // Optional: Prevent duplicate entries
    const alreadyMember = await ProjectMember.findOne({ user: user._id, project: project._id });
    if (alreadyMember) {
      return res.status(400).json(new ApiError(400, "User is already a member of this project"));
    }
  
    const addedMember = await ProjectMember.create({
      user: user._id,
      project: project._id,
      role,
    });
  
    if (!addedMember) {
      return res.status(500).json(new ApiError(500, "Failed to add project member"));
    }
  
    res.status(200).json(
      new ApiResponse(200, addedMember, "Member added successfully")
    );
  });
  export const removeMemberFromProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;
    const requesterId = req.user?.id;
  
    if (!projectId) {
      return res.status(400).json(new ApiError(400, "Please provide a valid project ID"));
    }
  
    if (!email) {
      return res.status(400).json(new ApiError(400, "Please provide the email of the user to remove"));
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
  
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
  
    if (project.createdBy.toString() !== requesterId) {
      return res.status(403).json(new ApiError(403, "Only the project creator can remove members"));
    }
  
    const member = await ProjectMember.findOne({
      project: project._id,
      user: user._id
    });
  
    if (!member) {
      return res.status(404).json(new ApiError(404, "Member not found in this project"));
    }
  
    const restrictedRoles = ["admin", "project_admin"];
    if (restrictedRoles.includes(member.role.toLowerCase())) {
      return res.status(403).json(new ApiError(403, "You cannot remove a member with elevated privileges"));
    }
  
    await member.deleteOne();
  
    res.status(200).json(
      new ApiResponse(200, null, "Member successfully removed from the project")
    );
  });
  
  export const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
  
    if (!projectId) {
      return res.status(400).json(new ApiError(400, "Please enter a valid project ID"));
    }
  
    // Step 1: Get all ProjectMember entries for this project
    const members = await ProjectMember.find({ project: projectId });
  
    if (!members.length) {
      return res.status(404).json(new ApiError(404, "No members found for this project"));
    }
  
    // Step 2: Extract user IDs from those entries
    const userIds = members.map((member) => member.user);
  
    // Step 3: Fetch all user details in one go
    const users = await User.find({ _id: { $in: userIds } }).select("fullName email username avatar");
  
    res.status(200).json(new ApiResponse(200, users, "Successfully fetched project members"));
  });
  

  export const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;
    const { role } = req.body;
    const requesterId = req.user?.id;
  
    if (!projectId || !memberId || !role) {
      return res.status(400).json(new ApiError(400, "Project ID, member ID, and role are required"));
    }
  
    // 1. Validate the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
  
    // 2. Ensure requester is the creator
    if (project.createdBy.toString() !== requesterId) {
      return res.status(403).json(new ApiError(403, "Only the project creator can update member roles"));
    }
  
    // 3. Find the project member entry
    const member = await ProjectMember.findOne({ project: projectId, user: memberId });
    if (!member) {
      return res.status(404).json(new ApiError(404, "Member not found in this project"));
    }
  
    // 4. Update the role
    member.role = role;
    await member.save();
  
    res.status(200).json(
      new ApiResponse(200, member, "Member role updated successfully")
    );
  });
  
