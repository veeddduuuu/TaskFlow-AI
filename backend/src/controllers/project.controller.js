import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/tasks.models.js";
import { APIResponse } from "../utils/apiResponse.js";
import { APIError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/async-handler.js";
import { request } from "express";

//some functions
const checkisAdmin = (project, userId) => {
    return(
        project.createdBy.toString() === userId.toString() || project.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin")
    );
};

// POST /projects
const createProject = asyncHandler(async(req, res) => {
    const { name, description } = req.body;

    if(!name){
        throw new APIError(400, "Project Name Required");
    }

    const userId = req.user._id

    const project = await Project.create({
        name,
        description,
        createdBy: userId,
        members: [{user : userId, role: "admin"}]
    })

    return res
        .status(201)
        .json(new APIResponse(201, "Project Created Successfully", project))
});

//DELETE /projects/:projectId
const deleteProject = asyncHandler(async(req, res) => {
    
    const {projectId} = req.params;
    const project = await Project.findOneAndDelete({
        id: projectId,
        createdBy: req.user._id
    });

    if(!project){
        throw new APIError(404, "Project not found");
    }

    if(!checkisAdmin(project, req.user._id)){
        throw new APIError(404, "User is not admin only admins can delete")
    }

    return res
        .status(200)    
        .json(new APIResponse(200, "Project Deleted Successfully", null))

});

//PUT /projects/:projectId
const updateProject = asyncHandler(async(req, res) => {
    const {name, description} = req.body;
    const {projectId} = req.params;
    if(!name && !description){
        throw new APIError(400, "At least one field (name or description) is required for update");
    }

    const project = await Project.findById(projectId);
    
    if(!project){
        throw new APIError(404, "Project not found");
    }

    if(!checkisAdmin(project, req.user._id)){
        throw new APIError(403, "Only admins can update the project");
    }

    if(name){
        project.name = name;
    }
    if(description){
        project.description = description;
    }

    await project.save();

    return res
        .status(200)
        .json(new APIResponse(200, "Project Updated Successfully", project))

})

const getUserProjects = asyncHandler(async(req, res) => {
    
    const userId = req.user._id;

    const projects = await Project
        .find({"members.user": userId})
        .populate("createdBy", "name email")

    return res
        .status(200)
        .json(new APIResponse(200, "Projects Fetched Successfully", projects))
});

//GET /projects/:projectId
const getProjectById = asyncHandler(async(req, res) => {
    const {projectId} = req.params;
    const project = await Project.findById(projectId)
    if(!project){
        throw new APIError(404, "Project not found");
    }
    return res
        .status(200)
        .json(new APIResponse(200, "Project Fetched Successfully", project))
})

//POST /projects/:projectId/members
const addProjectMembers = asyncHandler(async(req, res) => {
    const {projectId} = req.params;
    const {userId, role} = req.body;
    const project = await Project.findById(projectId);

    if(!project){
        throw new APIError(404, "Project not found");
    }

    if(!checkisAdmin(project, req.user._id)){
        throw new APIError(403, "Only admins can add members");
    }

    const user = await User.findById(userId);
    if(!user){
        throw new APIError(404, "User not found");
    }

    if(project.members.some(m => m.user.toString() === userId)){
        throw new APIError(400, "User is already a member of the project");
    }

    const allowedRoles = ["admin", "member"];
    if (role && !allowedRoles.includes(role)) {
        throw new APIError(400, "Invalid role");
    }
    
    project.members.push({user: userId, role: role || "member"});
    await project.save();

    return res
        .status(200)
        .json(new APIResponse(200, "Member Added Successfully", project))
    
})

//PUT /projects/:projectId/members/:userId
const updateProjectMemberRole = asyncHandler(async(req, res) => {
    const {projectId, userId} = req.params;
    const {role} = req.body;
    const currUserId = req.user._id;
    console.log(role);
    console.log("Current User ID:", currUserId);
    if(!role){
        throw new APIError(400, "Role is required");
    }

    const project = await Project.findById(projectId);
    
    if(!project){
        throw new APIError(404, "Project not found");
    }

    if(!checkisAdmin(project, currUserId)){
        throw new APIError(403, "Only admins can update member roles");
    }

    const user = await User.findById(userId);
    
    if(!user){
        throw new APIError(404, "User not found");
    }

    const member = project.members.find(m => m.user.toString() === userId);

    if(!member){
        throw new APIError(404, "User is not a member of the project");
    }

    if(member.role == role){
        throw new APIError(400, "User already has the specified role");
    }

    const admins = project.members.filter((m) => m.role === "admin");

    if (member.role === "admin" && role !== "admin" && admins.length === 1){ 
        throw new APIError(400, "Project must have at least one admin");
    }
    
    member.role = role;
    await project.save();

    return res
        .status(200)
        .json(new APIResponse(200, "Member Role Updated Successfully", project))
});

//DELETE /projects/:projectId/members/:userId
const removeMember = asyncHandler(async(req, res) => {
    const {projectId, userId} = req.params;
    const project = await Project.findById(projectId);
    const currUserId = req.user._id;
    if(!project){
        throw new APIError(404, "Project not found");
    }

    if(!checkisAdmin(project, currUserId)){
        throw new APIError(403, "Only admins can remove members");
    }

    const memberIndex = project.members.findIndex(m => m.user.toString() === userId);
    
    if(memberIndex === -1){
        throw new APIError(404, "User is not a member of the project");
    }

    const admins = project.members.filter((m) => m.role === "admin");

    if (project.members[memberIndex].role === "admin" && admins.length === 1){ 
        throw new APIError(400, "Project must have at least one admin");
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    return res
        .status(200)
        .json(new APIResponse(200, "Member Removed Successfully", project))
})


export {    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMembers,
    updateProjectMemberRole,
    removeMember
}