const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


module.exports = function(passport) {
  //Local Startegy
  passport.use(new LocalStrategy(User.authenticate()));

  // JWT Strategy
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'EngWeb2025-GP15-SecretKey'; 

  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).select('-hash -salt');
      if (user) {
        return done(null, user); 
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

};
