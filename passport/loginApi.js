var LocalStrategy   = require('passport-local-token').Strategy;
var User = require('../website/models/user');

module.exports = function(passport){
	passport.use('local-token', new LocalStrategy(
      function(token, done) {
        AccessToken.findOne({
          id: token
        }, function(error, accessToken) {
          if (error) {
            return done(error);
          }

          if (accessToken) {
            if (!token.isValid(accessToken)) {
              return done(null, false);
            }

            User.findOne({
              id: accessToken.userId
            }, function(error, user) {
              if (error) {
                return done(error);
              }

              if (!user) {
                return done(null, false);
              }

              return done(null, user);
            });
          } else {
            return done(null);
          }
        });
      }
    ));   
}