import {Router} from "express";
import { createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMembers,
    updateProjectMemberRole,
    removeMember  } from "../controllers/project.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authenticateUser);

router.route("/").post(createProject).get(getUserProjects);
router.route("/:projectId").get(getProjectById).put(updateProject).delete(deleteProject);
router.route("/:projectId/members").post(addProjectMembers);
router.route("/:projectId/members/:userId").put(updateProjectMemberRole).delete(removeMember);


export default router;  