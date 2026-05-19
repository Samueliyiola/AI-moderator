import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import contentRouter from "./modules/content/content.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use("/api/v1/content", contentRouter);






app.use(errorHandler);


export default app;