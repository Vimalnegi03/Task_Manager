import { Router } from "express";
import { UserRoleEnums,UserAvailableRoles } from "../utils/constants.js";
import { getNotes,getNotesById,createNote,updateNote,deleteNote } from "../controllers/note.controllers.js";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { validateProjectPermission } from "../middlewares/auth.middleware.js";
const router=Router()

router.route("/:projectId")
 .get(verifyJWT,validateProjectPermission(UserAvailableRoles),getNotes)
 .post(verifyJWT,validateProjectPermission([UserRoleEnums.ADMIN]),createNote)

 router.route("/:projectId/n/:noteId ")
 .get(verifyJWT,validateProjectPermission(UserAvailableRoles),getNotesById)
 .put(verifyJWT,validateProjectPermission([UserRoleEnums.ADMIN]),updateNote)
 .delete(verifyJWT,validateProjectPermission([UserRoleEnums.ADMIN]),deleteNote)
export default router;