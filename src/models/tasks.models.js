import mongoose from "mongoose"
import { TaskStatusENUM, AvailableTaskStatusENUM } from "../utils/constant.js";
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
    assginedBy : {
        type : Schema.Types.ObjectId,
        ref: "User"
    },
    status : {
        type:String,
        enum: AvailableTaskStatusENUM,
        default: TaskStatusENUM.TODO
    },
    attachment:{
        type: [{
            url:String,
            mimetype:String,
            size:Number
        }],
        default:[]
    }
},{timestamps:true});

export const Task = mongoose.model("Tasks", taskSchema)

