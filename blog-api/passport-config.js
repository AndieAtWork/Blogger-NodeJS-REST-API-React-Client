const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");

const pool = require("./db");

//Passport es un framework de autenticacion.

// LocalStrategy: se usa cuando el usuario hace login
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM blog_user WHERE LOWER(email) = $1",
          [email.toLowerCase()]
        );
        const user = rows[0];
        if (!user) {
          return done(null, false, { message: "Email not yet registered." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JwtStrategy: se usa despues del login, en las rutas protegidas. comprueba el JWT que el cliente envia
// El rol de enviar el jwt es del controlador
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Quita el "Bearer " para conseguir el token limpio
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(
    jwtOptions,
    async (jwtPayload, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM blog_user WHERE user_id = $1",
          [jwtPayload.user_id]
        );
        const user = rows[0];
        if (!user) {
          return done(null, false);
        }
        return done(null, user);

      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;