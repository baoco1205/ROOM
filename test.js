passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username })
      .then(function (user) {
        if (!user) {
          return done(null, false);
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(function (err) {
        return done(err);
      });
  })
);
