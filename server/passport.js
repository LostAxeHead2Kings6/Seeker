const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('../configurations.js');
const db = require('../database/index.js');

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  db.getUser(id, function(err, results) {
    if (err) console.error(err)
    done(err, results[0])
  })
});

passport.use(
  new GoogleStrategy({
    callbackURL: '/google',
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret
  }, function (accessToken, refreshToken, profile, done) {
    db.getGoogleCredentials(profile.id, function(err, results) {
      if (err) console.error(err)
      if (results.length === 0) {
        db.createUser(null, null, profile.id, function(err, results) {
          if (err) console.error(err)
          db.addDefaultPhases(results.insertId, function(err) {
            if (err) console.error(err)
            db.updateToken(results.insertId, accessToken, refreshToken, function(err) {
              if (err) console.error(err)
              db.getUser(results.insertId, function(err, results) {
                if (err) console.error(err)
                done(err, results[0])
              })
            })
          })
        })
      } else {
        db.updateToken(results[0].id, accessToken, refreshToken, function(err) {
          if(err) console.error(err)
          db.getUser(results[0].id, function(err, results) {
            if (err) console.error(err)
            done(err, results[0])
          })
        })
      }
    })
  })
);
