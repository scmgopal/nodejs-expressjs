var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var mysql      = require('mysql');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tjdgus2396',
  database : 'o2'
})
app = express();
app.set('views','./view_myself');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  //암호키를 지정하는 것
  secret: 'asdkjlsakdji128739812hjsadkd',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
        host:'localhost',
        port:3306,
        user : 'root',
        password: 'tjdgus2396',
        database : 'o2'

    })
}))
app.use(passport.initialize());
app.use(passport.session());
app.locals.pretty = true;


app.get('/auth/logout', function(req,res) {
	//flask에서 session.clear()와 같은 기능이라고 보면 되겠
	req.logout();
	req.session.save(function(){
		res.redirect('/topic')	
	})
	// delete req.session.displayName;
	

})

app.get('/auth/login', function(req,res){
	res.render('login')
})

app.post('/auth/login',
	 passport.authenticate('local', 
	 	{ successRedirect: '/topic',
	      failureRedirect: '/auth/login',
          failureFlash: false }) //flash 메시지 사용하는 부분
);

app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'})); //더 많은 정보를 받아오고 싶으면 scope를 넣어야합니다. 


app.get('/auth/register', function(req,res){
	res.render('register')
})

app.post('/auth/register',function(req,res){
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
		res.redirect('/topic');		
	})	
		}
	);
	
	};
})
})
})


app.get(['/topic','/topic/:id'], function(req,res){
	var sql = 'select id, title from topic'
	conn.query(sql,function(err,results){
		if (err) {
			done('err')
		} 
			var topics = results
			var user = req.user
			var id = req.params.id
			if (id) {
				var sql = 'select * from topic where id = ?'
				conn.query(sql,[id], function(err,results){
					if (results.length>0) {
						res.render('topic', {user:user, title:results[0].title, description:results[0].description, topics:topics,id:results[0].id})
					} else {
						done('error');
						res.redirect('topic')
					}

				})

			} else {
				res.render('topic', {user:user, topics:topics})
	}
	})	
	});


app.get('/topic/:id/delete', function(req,res){
	var id = req.params.id;
	var sql ='Delete FROM topic WHERE id=?'
	conn.query(sql,[id],function(err,results){
		if(err){
			res.send(err);
		} else{
			res.redirect('/topic')
		}

	})

})

app.get('/topic/:id/edit', function(req,res){
	var id = req.params.id;
	var sql = 'select * from topic where id =?'
	conn.query(sql,[id],function(err,results){
			if (err) {
			res.status(500);
		} else {
			console.log(results);
			res.render('edit',{topics:results[0]})		
		}
	});
});

app.post('/topic/:id/edit', function(req,res){
	var id = req.params.id;
	var description = req.body.description;
	var title = req.body.title;
	var author = req.body.author;
	var sql = 'UPDATE topic SET title=?, description=?, author=? where id=?';
	conn.query(sql, [title,description,author,id],function(err,results){
		if (err) {
			res.send(err);
		} else {
			res.redirect('/topic/'+id)

		}
	})

	
})




app.get('/add', function(req,res){
	res.render('add')
})

app.post('/add',function(req,res){
	var topic = {
		title:req.body.title,
		description : req.body.description,
		author : req.body.author
	}

	var sql = 'select * from topic where title = ?'
	conn.query(sql,[topic.title],function(err,results){
		if(results.length>0) {
			res.redirect('/add')
		} else {
			var sql ='INSERT INTO topic SET ?'
			conn.query(sql,topic,function(err,results){
				console.log(results);
				res.redirect('/topic/'+results.insertId)
			})


		}
	})
		
	});


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
    clientID: '138154053330847',
    clientSecret: '3e2f0817e3815d5c40edca5965c40c8a',
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


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/topic',
                                      failureRedirect: '/auth/login' }));




app.listen(3003,function(){
	console.log('connected 3003 port!!!')
})



