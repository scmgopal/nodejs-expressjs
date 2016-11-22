module.exports = function(app) {
var conn = require('./db')()
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

app.use(passport.initialize());
app.use(passport.session());

//done(null, false가 아니라면) 아래의 함수가 실행됨, done의 두번째로 온 인자가 첫 번째 인자가 됩니다.
passport.serializeUser(function(user, done) {
   done(null, user.authId); //식발자를 써줘야함. user.username과 같이 (유저의 고유값으로 구별해야 합니다.)
})

//serializeUser에서 두번째 인자가 id로 들어오는 것!
passport.deserializeUser(function(id, done) {
	var sql = 'SELECT * FROM users WHERE authId=?'
	conn.query(sql, [id], function(err,results){
		if(err){
			console.log(err);
			done('There is no user');
		} else {
			done(null,results[0]);
		}
	})
  })


passport.use(new LocalStrategy(
	function(username, password, done) {
		var username = username;
		var pwd = password;
		var sql = 'SELECT * FROM users WHERE authId=?'
		conn.query(sql,['local:'+username], function(err,results){
			if(err){
				return done('There is no user');
			} else {
				var user = results[0]
				return hasher({password:pwd, salt:user.salt},function(err,pass,salt,hash){
					if(hash === user.password){
						//로그인 성공
						done(null,user);
						// req.session.displayName = user.displayName;
						// req.session.save(function(){
						// 	res.redirect('/welcome')
						// })
					} else {
						//로그인 실패
						done('wrong id or password');
						
					}
				})

			}
		})
	
}));


passport.use(new FacebookStrategy({
    clientID: '188347788237210',
    clientSecret: '1498d204352c2050356e536396dd4454',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName'] 
    // 더 많은 정보를 가져 오기 위해서는scope & profileFields까지 입력을 다해줘야 합니다!
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile);
  	var authId = 'facebook:'+profile.id;
  	var sql = 'select * from users where authId =?'
  	conn.query(sql,[authId],function(err,results){
  		if(results.length>0) {
  			done(null,results[0])
  		} else {
  			var newuser = {
  		'authId':authId,
  		'displayName':profile.displayName,
  		'email': profile.emails[0].value
  	};
  			var sql = 'insert into users set ?'
  			conn.query(sql,newuser,function(err,results){
  				if(err){
  					console.log(err);
  					done('Error');
  				} else {
  					done(null,newuser);
  				}
  			})
  		}
  	})
  }));
  return passport;

}