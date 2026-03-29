import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";

dotenv.config({
    path : "./.env"
});

const port = process.env.PORT || 3000;

connectDB()
    .then(()=>{
        app.listen(port, ()=>{
            console.log(`Server is running on http://localhost:${port}`)
        })
    })
    .catch((error)=>{
        console.error("Error connecting to the database:", error);
        process.exit(1);
    })



 