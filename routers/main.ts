import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index.html", {
    title: "Home",
  });
});

let mainRouterConfig = {
  router,
  path: "/",
};

export { mainRouterConfig };
