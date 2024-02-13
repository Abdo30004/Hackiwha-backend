import express from "express";
import { config } from "dotenv";
import { mainRouterConfig } from "./routers/main";
import { apiRouterConfig } from "./routers/api";
import { Logger } from "./middlewares/logger";
import { Handler } from "./middlewares/handler";
import { renderFile } from "ejs";
import { initDB } from "./database/main";
config({
  path: ".env",
});

initDB(`${process.env.MONGO_URI}`);

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");
app.engine("html", renderFile);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(Logger.info);

app.use("/static", express.static("static"));

app.use(mainRouterConfig.path, mainRouterConfig.router);

app.use(apiRouterConfig.path, apiRouterConfig.router);

app.use(Handler.notFound);

app.use(Logger.error);

app.use(Handler.error);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
