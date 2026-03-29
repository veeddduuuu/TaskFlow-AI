import mongoose from "mongoose"
import { Schema } from "mongoose";
const taskSchema = new Schema({
    title: {
        type : String,
        required : true,
        trim : true
    },
    description : String,
    project:{
        type : Schema.Types.ObjectId,
        ref : "Project",
        required: true
    },
    assignedTo : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    assignedBy : {
        type : Schema.Types.ObjectId,
        ref: "User"
    },
    createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    priority : {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status : {
        type:String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
    deadline : Date,
    attachment:{
        type: [{
            url:String,
            mimetype:String,
            size:Number
        }],
        default:[]
    },
    subTasks : [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    }]
},{timestamps:true});

taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ deadline: 1 });


export const Task = mongoose.model("Task", taskSchema)

