
var express = require('express');

//body-parser 사용하기 위해서 써야하는 코드
var bodyParser = require('body-parser')
var app = express();

//jade template을 이쁘게 보이게 하는 코드
app.locals.pretty = true;

//템플릿 엔진 연결한느 방법, 이게 사실상 jinja templating이랑 비슷하다고 보면 되겠
app.set('view engine', 'jade');
//flask에서는 templates랑 비슷하다고 보면 되겠네!!
app.set('views','./views');

/* static 파일 폴더를 지정하는 방법 */
app.use(express.static('static'))

//body-parser 사용하기 위해서 써야하는 코드
app.use(bodyParser.urlencoded({extended:false}))
app.get('/form',function(req,res){
	res.render('form');
})

//get으로 전송하면 url에 표시가 된다.
app.get('/form_recevier', function(req,res){
	var title = req.query.title;
	var description = req.query.description
	res.send(title+','+description)

})
//POST방식으로 진행하면 URL에 나타나지 않는다.
app.post('/form_recevier', function(req,res){
	//post방식으로 넘어온 변수같은 경우에는 req.body.name으로 불러 올수 있는데
	//body를 사용하기 위해서는 body-parser 설치와 코드 작성 후에 써야 한다. 
	var title = req.body.title;
	var description = req.body.description;
	res.send(title+','+description)

})

//:id 같은 것이 flask에서 route <variable> 같은 느낌이네요!
app.get('/topic/:id',function(req,res){
	//req.query.name 를 활용해서 post되는 값을 url로 받을 수가 있는거군!
	//res.send(req.query.id+','+req.query.name);
	//두개의 query string을 넘기고 싶을 때는 위와 같이 할 수 있다.
	var topics = [
		'Javascipt is ....',
		'Nodejs is ...',
		'Express is ...'
	]
	var output = `
	<a href='/topic?id=0'>JavaScript</a></br>
	<a href='/topic?id=1'>Nodejs</a></br>
	<a href='/topic?id=2'>Express</a></br>
	${topics[req.params.id]}
	`
	//${topics[req.params.id]} << 이렇게 해야 url에서 path를 가져 오는 방식!!
	res.send(output);
})


//두개의 params도 가능하다. 아래와 같이!
app.get('/topic/:id/:mode',function(req,res){
	res.send(req.params.id +","+req.params.mode)
})


app.get('/templates',function(req,res){
	//flask의 render_template이랑 똑같은 거구나!!
	res.render('temp', {time:Date(), _title:'Jade'});

})

/* router, routing 이라고 부름, flask에서 app.route('/login') 같은 느낌이라고 보면 될 듯 */
/*res.send >> return 이라고 생각하면 되겠네*/
app.get('/', function(req,res){
	res.send('Hello homepage');
});


//${} 변수 넣기, for 함수의 사용
app.get('/dynamic', function(req,res){
	var lis = '';
	for(var i=0; i<5; i++){
		lis = lis + '<li>coding</li>'
	}
	var time = Date();
	var output = `<!DOCTYPE html>
<html>
	<head>
		<meta charset = "utf-8">
		<title></title>
	</head>
	<body>
		Hello. Dynamic
		${lis}
		${time}
	</body>
</html>`
	res.send(output)
})

app.get('/route', function(req,res) {
	res.send('Hello Router, <img src="/route.png">')

});

app.get('/login', function(req,res){
	res.send('login is required')
});

app.listen(3000, function(){
	console.log('Connected 3000 port')
}); // (port number, callback function)
