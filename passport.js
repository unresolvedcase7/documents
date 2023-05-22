const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          // Find the user by their username
          const user = await User.findOne({ username });

          // If the user is not found, return an error
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }

          // Validate the password
          if (password != "0000") {
            const isValidPassword = await user.comparePassword(password);
            // If the password is incorrect, return an error
            if (!isValidPassword) {
              return done(null, false, { message: "Incorrect password." });
            }
          }

          // Authentication successful
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
