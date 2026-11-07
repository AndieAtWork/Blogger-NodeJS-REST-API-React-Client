const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.post("/login_admin", indexController.adminlogin)
indexRouter.post("/login", indexController.login)
indexRouter.post("/sign-up", indexController.signUp)

module.exports = indexRouter;