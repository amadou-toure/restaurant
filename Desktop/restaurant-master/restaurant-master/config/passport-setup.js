/**
 * appel des librairies
 */
const User = require("../models/User");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

/**
 * passport serializeUser
 */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/**
 * passport deserializeUser
 */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/**
 * enregistrer un utilisateur via passport
 */
passport.use(
  "local.new",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      if (req.body.password != req.body.confirm_password) {
        return done(
          null,
          false,
          req.flash("error", "Passwords ne correspond pas")
        );
      } else {
        // trouver utilisateur par email
        User.findOne({ email: email }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, req.flash("error", "email deja existant"));
          }
          if (!user) {
            // creation d'un objet utilisateur
            let newUser = new User();
            newUser.Fname = req.body.firstname;
            newUser.LName = req.body.lastname;
            newUser.Contact = req.body.contact;
            newUser.email = req.body.email;
            newUser.password = newUser.hashSyncPass(req.body.password);
            newUser.avatar = "profile.png";
            newUser.role = req.body.role;
            newUser.created_at = Date.now();
            newUser.save((err, user) => {
              if (!err) {
                return done(
                  null,
                  user,
                  req.flash("success", "Nouvel Utilisateur Ajouter")
                );
              } else {
                console.log(err);
              }
            });
          }
        });
      }
    }
  )
);

/**
 * gestion du login avec passport
 */
passport.use(
  "local.login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      // find user by email
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(null, false, req.flash("error", "Error..."));
        }
        if (!user) {
          return done(
            null,
            false,
            req.flash("error", "utilisateur non trouve")
          );
        }
        if (user) {
          // compare password
          if (user.compareSyncPass(password, user.password)) {
            return done(
              null,
              user,
              req.flash("success", "Bienvenue " + user.Fname)
            );
          } else {
            return done(
              null,
              false,
              req.flash("error", "pardon verifier votre password")
            );
          }
        }
      });
    }
  )
);
