import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());


//basic configuration
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

//cors configugration
app.use(cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.get("/", (req, res) => {
    console.log("Hello This is TaskFlow AI");
    res.send("Hello This is TaskFlow AI");
})

import healthcheckRoutes from "./routes/healthcheck.routes.js";

app.use("/api/v1/healthcheck", healthcheckRoutes);

import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRoutes);

import projectRoutes from "./routes/project.routes.js";

app.use("/api/v1/projects", projectRoutes);

import taskRoutes from "./routes/tasks.routes.js";

app.use("/api/v1/", taskRoutes);

// Global Error Handler
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export default app; 