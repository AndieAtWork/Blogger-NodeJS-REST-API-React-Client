const { Router } = require("express");
const postController = require("../controllers/postController");
const passport = require("../passport-config");

const postRouter = Router();

const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
            code: "AUTH_SESSION_INVALID",
            message: "Expired"
        });
      }
      req.user = user;
      next();
  })(req, res, next);
};

postRouter.use(authenticateJwt);

postRouter.get("/", postController.postsGet) // Get all posts
postRouter.post("/", postController.postsPost) // Create posts

postRouter.get("/:id", postController.postGet) // Get specific post
postRouter.put("/:id/", postController.postEdit) // Edit post
postRouter.put("/:id/publish", postController.postPublish) // Publish post
postRouter.delete("/:id", postController.postDelete) // Delete post

postRouter.post("/:idPost/comment", postController.commentPost) // Publish comment
postRouter.delete("/:idPost/comment/:idComment", postController.commentDelete) // Delete comment

module.exports = postRouter;