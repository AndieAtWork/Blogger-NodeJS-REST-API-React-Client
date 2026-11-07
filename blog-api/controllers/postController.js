const pool = require("../db");
const { sendEmail } = require("../services/gmailService")

exports.postsGet = async (req, res, next) => {
  try{
    const user = req.user;

    const { rows: userRows } = await pool.query("SELECT * FROM blog_user WHERE admin = 1");
    const idAdmin = userRows[0].user_id;

    let postRows = [];
    if (user.admin !== 1){
      ({ rows: postRows } = await pool.query(`SELECT post.*, count(comment.comment_id) as count, blog_user.username FROM post 
        INNER JOIN blog_user ON blog_user.user_id = post.user_id
        LEFT JOIN comment ON post.post_id = comment.post_id
        WHERE post.user_id = $1 and date_published is not null
        GROUP BY post.post_id, blog_user.username
        `,
        [idAdmin]
      ))
    }else{
      ({ rows: postRows } = await pool.query(`SELECT post.*, count(comment.comment_id) as count, blog_user.username FROM post 
        INNER JOIN blog_user ON blog_user.user_id = post.user_id
        LEFT JOIN comment ON post.post_id = comment.post_id
        WHERE post.user_id = $1
        GROUP BY post.post_id, blog_user.username
        `,
        [idAdmin]
      ))
    }
    return res.status(200).json(postRows); // OK
  }catch (err) {
    next(err);
  }
};

exports.postsPost = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.admin !== 1){
      return res.status(403).json({
        message: "Non admin users can't create posts." // Forbidden
      });
    }

    if (!req.body){
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    if (typeof req.body.title !== "string" || typeof req.body.content !== "string") {
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    const title = req.body.title.trim();
    const content = req.body.content.trim();

    if (!((title.length > 0 && title.length <= 100) && (content.length > 0 && content.length <= 5000))){
      return res.status(400).json({
        message: "Invalid input" // Bad request
      });
    }

    await pool.query(
      "INSERT INTO post (title, content, user_id, date_created) VALUES ($1, $2, $3, NOW()) RETURNING *", 
      [
        title,
        content,
        user.user_id
      ]
    );
    return res.status(201).json({
      message: "Post posted successfully." // Created
    });; // Created

  } catch (err) {
    next(err);
  }
};

exports.postGet = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    var { rows } = await pool.query(`SELECT post.*, blog_user.username FROM post 
      INNER JOIN blog_user ON blog_user.user_id = post.user_id
      WHERE post_id = $1`, [id])

    if (rows.length == 0) {
      return res.status(404).json({ // Not found
        message: "Post not found."
      });
    }

    var post = rows[0];

    if (post.date_published == null && user.admin !== 1){
      return res.status(403).json({
        message: "Post not available for readers." // Forbidden
      });
    }

    const { rows: comments } = await pool.query(`
      SELECT comment.*, blog_user.username, blog_user.user_id FROM comment
      INNER JOIN blog_user ON blog_user.user_id = comment.user_id
      WHERE comment.post_id = $1
      `, [post.post_id])

    return res.status(200).json({ // Success
      "post": post,
      "comments": comments
    });

  } catch (err) {
    next(err);
  }
};

exports.postEdit = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.admin !== 1){
      return res.status(403).json({
        message: "Non admin users can't edit posts." // Forbidden
      });
    }

    if (!req.body){
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    if (typeof req.body.title !== "string" || typeof req.body.content !== "string") {
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    const title = req.body.title.trim();
    const content = req.body.content.trim();

    if (!((title.length > 0 && title.length <= 100) && (content.length > 0 && content.length <= 5000))){
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    const id = req.params.id;
    var { rows } = await pool.query(`SELECT * FROM post WHERE post_id = $1`, [id])

    if (rows.length == 0) {
      return res.status(404).json({ // Not found
        message: "Post not found."
      });
    }

    var post = rows[0];
    await pool.query(`
      UPDATE post 
      SET 
        title = $1, 
        content = $2, 
        date_updated = NOW()
      WHERE post_id = $3`,
    [title, content, post.post_id])

    return res.status(200).json({
      message: "Post updated successfully." // Success
    });

  } catch (err) {
    next(err);
  }
};

exports.postPublish = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.admin !== 1){
      return res.status(403).json({
        message: "Non admin users can't publish posts." // Forbidden
      });
    }

    const id = req.params.id;
    var { rows } = await pool.query(`SELECT * FROM post WHERE post_id = $1`, [id])

    if (rows.length == 0) {
      return res.status(404).json({
        message: "Post not found." // Not found
      });
    }

    await pool.query(`
      UPDATE post 
      SET 
        date_published = NOW()
      WHERE post_id = $1`,
    [id])

    const publishedPost = rows[0];
    const { rows: users } = await pool.query("SELECT email FROM blog_user WHERE admin = 0")
    for (var u of users){
      await sendEmail(u.email, "New Post Published", publishedPost)
    }

    return res.status(200).json({
      message: "Post published successfully." // Success
    });

  } catch (err) {
    next(err);
  }
};

exports.postDelete = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.admin !== 1){
      return res.status(403).json({
        message: "Non admin users can't delete posts." // Forbidden
      });
    }

    const id = req.params.id;
    var { rows } = await pool.query(`SELECT * FROM post WHERE post_id = $1`, [id])

    if (rows.length == 0) {
      return res.status(404).json({ // Not found
        message: "Post not found."
      });
    }

    await pool.query("DELETE FROM post WHERE post_id = $1", [id])

    return res.status(200).json({
      message: "Post deleted successfully." // Success
    });

  } catch (err) {
    next(err);
  }
};

exports.commentPost = async (req, res, next) => {
  try {
    const user = req.user;
    const idPost = req.params.idPost;

    var { rows: postRows } = await pool.query("SELECT * FROM post WHERE post_id = $1", [idPost])
    if (postRows.length == 0){
      return res.status(404).json({ // Not found
        message: "Post not found."
      });
    }

    if (!req.body){
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    if (typeof req.body.content !== "string") {
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    var content = req.body.content.trim();

    if (!(content.length > 0 && content.length <= 1000)) {
      return res.status(400).json({
        message: "Invalid input" // Bad request
      });
    }

    await pool.query("INSERT INTO comment (user_id, post_id, content, date_posted) VALUES ($1, $2, $3, NOW()) RETURNING *", 
      [user.user_id, idPost, content]);

    return res.status(201).json({
      message: "Comment published successfully." // Success
    });

  } catch (err) {
    next(err);
  }
};

exports.commentDelete = async (req, res, next) => {
  try {
    const user = req.user;
    const idPost = req.params.idPost;
    const idComment = req.params.idComment;

    if ((!Number.isInteger(Number(idComment)) || idComment <= 0) && (!Number.isInteger(Number(idPost)) || idPost <= 0)) {
      return res.status(400).json({
          message: "Bad Request"
      });
    }

    var { rows: postRows } = await pool.query("SELECT * FROM post WHERE post_id = $1", [idPost])
    if (postRows.length == 0){
      return res.status(404).json({ // Not found
        message: "Post not found."
      });
    }

    var { rows: commentRows } = await pool.query("SELECT * FROM comment WHERE comment_id = $1 AND post_id = $2", 
      [idComment, idPost])
    if (commentRows.length == 0){
      return res.status(404).json({ // Not found
        message: "Comment not found in post."
      });
    }

    var comment = commentRows[0];

    if (user.admin !== 1 && (comment.user_id != user.user_id)){
      return res.status(403).json({ // Forbidden
        message: "Non admin users can't delete other user's comments."
      });
    }

    await pool.query("DELETE FROM comment WHERE comment_id = $1", [idComment])

    return res.status(200).json({
      message: "Comment deleted successfully." // Success
    });

  } catch (err) {
    next(err);
  }
};