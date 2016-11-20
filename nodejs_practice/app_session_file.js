var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
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
			<a href="/auth/login">Login</a>
			`
			);
	}
	
})

app.get('/auth/logout', function(req,res) {
	//flask에서 session.clear()와 같은 기능이라고 보면 되겠
	delete req.session.displayName;
	res.redirect('/welcome')

});


app.post('/auth/login', function(req,res){
	var user = {
		username :'egoing',
		password : '111',
		displayName : 'Egoing'
	}
	var username = req.body.username;
	var pwd = req.body.password;
	if(username === user.username && pwd === user.password) {
		req.session.displayName = user.displayName;
		res.redirect('/welcome')
	} else {
		res.send('Who are you? <a href = "auth/login">login</a>')
	}
})



app.listen(3003,function(){
	console.log('connected 3003 port!!!')
})