import { APIResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/async-handler.js";   
// const healthcheck = (req, res)=>{
//     try{
//         res
//             .status(200)
//             .json(new APIResponse(200, "Server is healthy"));
//     }
//     catch(error){
//         console.error("Error in healthcheck:", error);
//     }
// }

const healthcheck = asyncHandler(async (req, res) => {
    res
        .status(200)
        .json(new APIResponse(200, "Server is healthy"));
});

export default healthcheck;