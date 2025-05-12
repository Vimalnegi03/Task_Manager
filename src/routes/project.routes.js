import { Router } from "express";
import { getProjects,getProjectById,createProject,updateProject,deleteProject,addMemberToProject,removeMemberFromProject,getProjectMembers,updateMemberRole} from "../controllers/project.controllers.js";
import {verifyJWT} from '../middlewares/verifyJwt.middleware.js'
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator,addMemberToProjectValidator} from "../validators/index.js";
const router=Router()
router.post("/create",createProjectValidator(),validate,verifyJWT,createProject)
router.get("/getProjects",verifyJWT,getProjects)
router.get("/getproject/:projectId",verifyJWT,getProjectById)
router.post("/updateProject/:projectId",verifyJWT,updateProject)
router.delete("/deleteproject/:projectId",verifyJWT,deleteProject)
router.post("/addMember/:projectId",addMemberToProjectValidator(),validate,verifyJWT,addMemberToProject)
router.delete("/removeMember/:projectId",verifyJWT,removeMemberFromProject)
router.get("/getProjectMembers/:projectId",verifyJWT,getProjectMembers)
router.post("/updateMemberRole/:projectId/:memberId",verifyJWT,updateMemberRole)
export default router;