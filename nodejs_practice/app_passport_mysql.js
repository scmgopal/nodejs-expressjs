var app = require('./config/mysql/express')();
//passport 관련 코드

var passport =  require('./config/mysql/passport')(app);


app.get('/welcome', function(req,res){
	if(req.user && req.user.displayName) {
		res.render('auth/logout',{displayName:req.user.displayName})
	} else {
		res.render('auth/welcome')
		
	}
	
})

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/',auth)


app.listen(3003,function(){
	console.log('connected 3003 port!!!')
})




