import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    getSingleTask,
    updateStatus,
    createSubTask,
    deleteSubTask,
    updateSubTask
} from "../controllers/tasks.controller.js";

const router = Router();

router.use(authenticateUser);

router.route("/projects/:projectId/tasks")
    .post(createTask)
    .get(getTasks);

router.route("/tasks/:taskId")
    .get(getSingleTask)
    .patch(updateTask)
    .delete(deleteTask);

router.route("/tasks/:taskId/status")
    .patch(updateStatus);

router.route("/tasks/:taskId/subtasks")
    .post(createSubTask);

router.route("/tasks/:taskId/subtasks/:subtaskId")
    .patch(updateSubTask)
    .delete(deleteSubTask);

export default router;
