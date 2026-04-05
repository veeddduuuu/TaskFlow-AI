import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/tasks.models.js";
import { APIResponse } from "../utils/apiResponse.js";
import { APIError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/async-handler.js";

// ==========================================
// HELPERS
// ==========================================

// Helper to validate MongoDB Object IDs to prevent app crashes on malformed params
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Centralized check if the user is a valid project member or the project creator
const checkProjectMembership = (project, userId) => {
    return (
        project.createdBy.toString() === userId.toString() ||
        project.members.some((m) => m.user.toString() === userId.toString())
    );
};

// Centralized check if the user is a project admin or the project creator
const checkAdmin = (project, userId) => {
    return (
        project.createdBy.toString() === userId.toString() ||
        project.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin")
    );
};

// ==========================================
// CONTROLLERS
// ==========================================

// POST /projects/:projectId/tasks
export const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, priority, deadline } = req.body;
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) throw new APIError(400, "Invalid Project ID");

    if (!title || title.trim() === "") {
        throw new APIError(400, "Title is required");
    }

    if (assignedTo && !isValidObjectId(assignedTo)) {
        throw new APIError(400, "Invalid Assigned User ID");
    }

    // Use .select() to only fetch required fields for authorization
    const project = await Project.findById(projectId).select("createdBy members");
    
    if (!project) throw new APIError(404, "Project not found");

    if (!checkAdmin(project, req.user._id)) {
        throw new APIError(403, "You are not authorized to create tasks for this project");
    }

    if (assignedTo) {
        if (!checkProjectMembership(project, assignedTo)) {
            throw new APIError(400, "Assigned user must be a member of the project");
        }
    }

    const taskData = {
        title,
        description,
        project: projectId,
        priority: priority || "medium",
        assignedBy: req.user._id,
        createdBy: req.user._id
    };

    if (assignedTo && assignedTo.trim() !== "") {
        taskData.assignedTo = assignedTo;
    }

    if (deadline && deadline.trim() !== "") {
        taskData.deadline = deadline;
    }

    const task = await Task.create(taskData);

    res.status(201).json(new APIResponse(201, "Task created successfully", task));
});

// PATCH /tasks/:taskId
export const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, priority, status, deadline } = req.body;

    if (!isValidObjectId(taskId)) throw new APIError(400, "Invalid Task ID");

    const task = await Task.findById(taskId);
    if (!task) throw new APIError(404, "Task not found");

    const project = await Project.findById(task.project).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");

    const isAdmin = checkAdmin(project, req.user._id);
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    // Only Admins, task creators, and assignees can update a task
    if (!isAdmin && !isAssignee && !isCreator) {
        throw new APIError(403, "Not authorized to update this task");
    }

    // Check if new assignee is a member of the project
    if (assignedTo) {
        if (!isValidObjectId(assignedTo)) throw new APIError(400, "Invalid Assigned User ID");
        if (!checkProjectMembership(project, assignedTo)) {
            throw new APIError(400, "Assigned user must be a member of the project");
        }
    }

    // Only Admins or Task Creators can update core task details
    if (isAdmin || isCreator) {
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (assignedTo !== undefined) {
             task.assignedTo = (assignedTo && assignedTo.trim() !== "") ? assignedTo : undefined;
        }
        if (priority !== undefined) task.priority = priority;
        if (deadline !== undefined) {
             task.deadline = (deadline && deadline.trim() !== "") ? deadline : undefined;
        }
    }

    // Assignee can update status (or admin/creator)
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json(new APIResponse(200, "Task updated successfully", task));
});

// DELETE /tasks/:taskId
export const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) throw new APIError(400, "Invalid Task ID");

    const task = await Task.findById(taskId);
    if (!task) throw new APIError(404, "Task not found");

    const project = await Project.findById(task.project).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");

    if (!checkProjectMembership(project, req.user._id)) {
        throw new APIError(403, "You are not a member of the project");
    }
    
    const isAdmin = checkAdmin(project, req.user._id);
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    
    if (!isAdmin && !isCreator) {
        throw new APIError(403, "Only Admins or Task Creator can delete a task");
    }

    await task.deleteOne();

    res.status(200).json(new APIResponse(200, "Task deleted successfully", null));
});

// GET /projects/:projectId/tasks
export const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;

    if (!isValidObjectId(projectId)) throw new APIError(400, "Invalid Project ID");

    const project = await Project.findById(projectId).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");

    if (!checkProjectMembership(project, req.user._id)) {
        throw new APIError(403, "You are not authorized to view tasks for this project");
    }

    // Build query filters dynamically
    const filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) {
        if (!isValidObjectId(assignedTo)) throw new APIError(400, "Invalid Assigned User ID");
        filter.assignedTo = assignedTo;
    }

    // Use .lean() to return raw JSON instead of expensive Mongoose documents
    const tasks = await Task.find(filter)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .lean();

    res.status(200).json(new APIResponse(200, "Tasks fetched successfully", tasks));
});

// GET /tasks/:taskId
export const getSingleTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) throw new APIError(400, "Invalid Task ID");

    const task = await Task.findById(taskId)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .lean();

    if (!task) throw new APIError(404, "Task not found");

    const project = await Project.findById(task.project).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");

    if (!checkProjectMembership(project, req.user._id)) {
        throw new APIError(403, "You are not authorized to view this task");
    }
    
    res.status(200).json(new APIResponse(200, "Task fetched successfully", task));
});

// PATCH /tasks/:taskId/status
export const updateStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(taskId)) throw new APIError(400, "Invalid Task ID");

    const task = await Task.findById(taskId);
    if (!task) throw new APIError(404, "Task not found");

    const project = await Project.findById(task.project).select("createdBy members");

    const isAdmin = checkAdmin(project, req.user._id);
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator && !isAssignee) {
        throw new APIError(403, "You are not authorized to update the status of this task");
    }

    if (status !== undefined) task.status = status;

    await task.save();
    
    res.status(200).json(new APIResponse(200, "Task status updated successfully", task));
});

// POST /tasks/:taskId/subtasks
export const createSubTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!isValidObjectId(taskId)) throw new APIError(400, "Invalid Task ID");

    if (!title || title.trim() === "") {
        throw new APIError(400, "Title is required for subtask");
    }

    const task = await Task.findById(taskId);
    if (!task) throw new APIError(404, "Task not found");

    const project = await Project.findById(task.project).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");
    
    const isAdmin = checkAdmin(project, req.user._id);
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
        throw new APIError(403, "Only Admins or Task Creator can add subtasks");
    }
    
    task.subTasks.push({ title });
    await task.save();

    res.status(201).json(new APIResponse(201, "Subtask created successfully", task));
});

// DELETE /tasks/:taskId/subtasks/:subtaskId
export const deleteSubTask = asyncHandler(async (req, res) => {
    const { taskId, subtaskId } = req.params;

    if (!isValidObjectId(taskId) || !isValidObjectId(subtaskId)) {
        throw new APIError(400, "Invalid Task ID or Subtask ID");
    }
    
    const task = await Task.findById(taskId);
    if (!task) throw new APIError(404, "Task not found");
    
    const project = await Project.findById(task.project).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");
    
    const isAdmin = checkAdmin(project, req.user._id);
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
        throw new APIError(403, "Only Admins or Task Creator can delete subtasks");
    }

    const subTask = task.subTasks.id(subtaskId);
    if (!subTask) throw new APIError(404, "Subtask not found");

    subTask.deleteOne();
    await task.save();

    res.status(200).json(new APIResponse(200, "Subtask deleted successfully", task));
});

// PATCH /tasks/:taskId/subtasks/:subtaskId
export const updateSubTask = asyncHandler(async (req, res) => {
    const { taskId, subtaskId } = req.params;
    const { isCompleted } = req.body;
    
    if (!isValidObjectId(taskId) || !isValidObjectId(subtaskId)) {
        throw new APIError(400, "Invalid Task ID or Subtask ID");
    }

    const task = await Task.findById(taskId);
    if (!task) throw new APIError(404, "Task not found");
    
    const project = await Project.findById(task.project).select("createdBy members");
    if (!project) throw new APIError(404, "Project not found");
    
    if (!checkProjectMembership(project, req.user._id)) {
        throw new APIError(403, "Only project members can update subtasks");
    }

    const subTask = task.subTasks.id(subtaskId);
    if (!subTask) throw new APIError(404, "Subtask not found");

    // Strictly check against undefined to avoid overriding with falsey values unintentionally
    if (isCompleted !== undefined) {
        subTask.isCompleted = isCompleted;
    }
    
    await task.save();

    res.status(200).json(new APIResponse(200, "Subtask updated successfully", task));
});