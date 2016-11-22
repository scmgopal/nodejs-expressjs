module.exports = function(passport) {
	var bkfd2Password = require("pbkdf2-password");
	var hasher = bkfd2Password();
	var route = require('express').Router();
	var conn = require('../../config/mysql/db')()

route.get('/login', function(req,res){
	res.render('auth/login')

})


route.get('/register',function(req,res){
	res.render('auth/register')
})


route.post('/register', function(req,res){

	hasher({password:req.body.password},function(err,pass,salt,hash){
		var user = {
			authId:'local:'+req.body.username,
			username:req.body.username,
			password:hash,
			salt:salt,
			displayName:req.body.displayName
	};
	var sql = 'INSERT INTO users SET ?';
	conn.query(sql,user,function(err,results){
		if(err){
			console.log(err)
			res.status(500);
		} else {
	req.login(user,function(err){
		req.session.save(function(){
		res.redirect('/welcome');		
	})	
		}
	);
	
	};
})
})
})

route.get('/logout', function(req,res) {
	//flask에서 session.clear()와 같은 기능이라고 보면 되겠
	req.logout();
	req.session.save(function(){
		res.redirect('/welcome')	
	})
	// delete req.session.displayName;
	

})


route.post('/login',
	 passport.authenticate('local', 
	 	{ successRedirect: '/welcome',
	      failureRedirect: '/auth/login',
          failureFlash: false }) //flash 메시지 사용하는 부분
);

route.get('/facebook', passport.authenticate('facebook', {scope:'email'})); //더 많은 정보를 받아오고 싶으면 scope를 넣어야합니다. 

route.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/welcome',
                                      failureRedirect: '/auth/login' }));
	return route;
}