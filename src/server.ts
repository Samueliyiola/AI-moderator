import app from "./app";
import {createServer} from "http";
const server = createServer(app);
import dotenv from "dotenv";
import type {Request, Response} from "express";
import {connectDB, disconnectDB} from "./core/config/db"

dotenv.config();



const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response)=>{
    res.json({message : "Server is healthy!"});
})

server.listen(PORT, () =>{
    try {
        connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Error dey bro!")
    }
})