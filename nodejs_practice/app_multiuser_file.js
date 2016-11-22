var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  //암호키를 지정하는 것
  secret: 'asdkjlsakdji128739812hjsadkd',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

app.get('/count', function(req,res){
	if (req.session.count) {
		req.session.count++
	} else {
		req.session.count =1
	}
	res.send('count : ' + req.session.count)
})

app.get('/auth/login', function(req,res){
	var output = `
	<h1>Login</h1>
	<form action='/auth/login' method='post'>
		<p><input type="text" name="username" placeholder="username"></p>
		<p><input type="password" name="password" placeholder="password"></p>
		<p><input type="submit"></p>
	</form>
	`
	res.send(output)
})


app.get('/welcome', function(req,res){
	if(req.session.displayName) {
		res.send(`
				<h1>Hello, ${req.session.displayName}</h1>
				<a href="/auth/logout">logout</a>
			`)
	} else {
		res.send(
			`
			<h1>Welcome</h1>
			<ul>
				<li><a href="/auth/login">Login</a></li>
				<li><a href="/auth/resgister">register</a></li>
			</ul>
			`
			);
	}
	
})


app.get('/auth/register',function(req,res){
	var output = `
	<h1>Register</h1>
	<form action='/auth/register' method='post'>
		<p><input type="text" name="username" placeholder="username"></p>
		<p><input type="password" name="password" placeholder="password"></p>
		<p><input type="test" name="displayName" placeholder="displayName"></p>
		<p><input type="submit"></p>
	</form>
	`
	res.send(output)
})

//salt값을 유저마다 다르게 주게 되면 좀 더 보안이 가능하겠죠?!!!
var salt = 'asdhsadhu12e912987jshfashf73'
var users =[{
	username:'egoing',
	password:'EW+JFuBI8DYCJ+EAtIj47eO3rIZK/WhUouTleRWUaug0mybQ3OU4++yMLfkGl/HXzjH+KYHy/21njnxXoyUNBatJNTFwz73B8YFGUi9+U0lVqcjoDePILwJy8imDKBbWNQAq+gOhWCO5iN781PdA9SD5o20VoJ6Pk2k2dZ/MKqY=',
	salt :'WhDklsG3tL/vW6RQR2e1/ApHJ6ILgXu8kR837E9oyH9sOCLtHmaWbDy8kA+XfWuwz7AYrTk+ItptXfcRhXAmZg==',
	displayName: 'Egoing'
},
];



app.post('/auth/register', function(req,res){

	hasher({password:req.body.password},function(err,pass,salt,hash){
	var user = {
		username:req.body.username,
		password:hash,
		salt:salt,
		displayName:req.body.displayName
	};

	users.push(user);
	req.session.displayName = req.body.displayName;
	req.session.save(function(){
		res.redirect('/welcome');	

	});
	});
	
});

app.get('/auth/logout', function(req,res) {
	//flask에서 session.clear()와 같은 기능이라고 보면 되겠
	delete req.session.displayName;
	res.redirect('/welcome')

});


app.post('/auth/login', function(req,res){
	var username = req.body.username;
	var pwd = req.body.password;
	for(var i=0; i<users.length; i++){
		var user = users[i];
		if(username === user.username) {
			return hasher({password:pwd,salt:user.salt},function(err,pass,salt,hash){
				if(hash === user.password){
					req.session.displayName = user.displayName;
					req.session.save(function(){
						res.redirect('/welcome')
					})
				} else {
					res.send('Who are you? <a href="/auth/login">login</a>');
				}
			});
		}
	// 	var user = users[i];
	// 	if(username === user.username && sha256(pwd+user.salt) === user.password) {
	// 	req.session.displayName = user.displayName;
	// 	return req.session.save(function(){
	// 		res.redirect('/welcome')	
	// 	})
	// } 
	}

	res.send('Who are you? <a href="/auth/login">login</a>');
	});

app.listen(3003,function(){
	console.log('connected 3003 port!!!')
})