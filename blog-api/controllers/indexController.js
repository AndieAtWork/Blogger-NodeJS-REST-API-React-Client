const bcrypt = require("bcryptjs");
const passport = require("../passport-config");
const jwt = require("jsonwebtoken");

const pool = require("../db");

exports.adminlogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid credentials" // Unauthorized
      });
    }

    // if (user.admin !== 1){
    //   return res.status(403).json({
    //     message: "Non admin users can't use the admin client" // Forbidden
    //   });
    // }

    const token = jwt.sign(
      {
        user_id: user.user_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );
    return res.status(200).json({ // Success
      message: "Login successful",
      token: token,
      adminVisualization: user.admin === 1,
      user_id: user.user_id
    });
  })(req, res, next);
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid credentials" // Unauthorized
      });
    }
    const token = jwt.sign(
      {
        user_id: user.user_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );
    return res.status(200).json({ // Success
      message: "Login successful",
      token: token,
      adminVisualization: user.admin === 1,
      user_id: user.user_id
    });
  })(req, res, next);
};

exports.signUp = async (req, res, next) => {
  try {
    if (!req.body){
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    var { email, username, password } = req.body;

    if (typeof req.body.email !== "string" || typeof req.body.username !== "string" || typeof req.body.password !== "string") {
      return res.status(400).json({ // Bad request
        message: "Invalid input"
      });
    }

    email = email.trim();
    username = username.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;

    if (!(emailRegex.test(email) && usernameRegex.test(username) && passwordRegex.test(password))){
      return res.status(400).json({
        message: "Invalid credentials" // Bad request
      });
    }

    const usernameExists = await pool.query(
      "SELECT * FROM blog_user WHERE username = $1",
      [username]
    );
    if (usernameExists.rows.length > 0){
      return res.status(400).json({
        message: "Existing username" // Bad request
      });
    }

    const emailExists = await pool.query(
      "SELECT * FROM blog_user WHERE email = $1",
      [email]
    );
    if (emailExists.rows.length > 0){
      return res.status(400).json({
        message: "Existing email" // Bad request
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO blog_user (email, username, password, admin) VALUES ($1, $2, $3, $4) RETURNING *", 
      [
        email,
        username,
        hashedPassword,
        0
      ]
    );

    return res.status(201).json({
      message: "User created successfully" // 201 Created
    });
  } catch (err) {
    next(err);
  }
};
