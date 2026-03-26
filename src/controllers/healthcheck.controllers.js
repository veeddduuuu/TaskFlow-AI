import { APIResponse } from "../utils/apiResponse.js";

const healthcheck = (req, res)=>{
    try{
        res
            .status(200)
            .json(new APIResponse(200, "Server is healthy"));
    }
    catch(error){
        console.error("Error in healthcheck:", error);
    }
}

export default healthcheck;