import express from "express";
import { config } from "dotenv";
import { mainRouterConfig } from "./routers/main";
import { apiRouterConfig } from "./routers/api";
import { Logger } from "./middlewares/logger";
import { Handler } from "./middlewares/handler";
import { renderFile } from "ejs";
import { initDB } from "./database/main";
import process from "process";
import cors from "cors";
config({
  path: ".env",
});

initDB(`${process.env.MONGO_URI}`);

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");
app.engine("html", renderFile);

app.use(cors()); // Enable All CORS Requests

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.json()); // for parsing application/json

app.use(Logger.info); // Log all requests

app.use("/static", express.static("static")); // Serve static files

app.use(mainRouterConfig.path, mainRouterConfig.router); // Main router

app.use(apiRouterConfig.path, apiRouterConfig.router); // API router

app.use(Handler.notFound); // 404 handler

app.use(Logger.error); // Log all errors

app.use(Handler.error); // Error handler

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`); // Start server
});
