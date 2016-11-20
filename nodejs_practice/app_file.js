var express = require('express');
var bodyParser = require('body-parser');

//file-upload를 도와주는 module
var multer = require('multer');
// upload가 될 destination을 정한다 및 파일이름을 정할 수 있다.
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	// 왜 이렇게 복잡하게 하는가? 더 복잡한 것을 가능하게 하기 위함이다.
  	// if(파일의 형식이 이미지면)
  	// cb(null, 'uploads/images');
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage:storage })

var fs = require('fs')
var app = express();
app.use('/user', express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.locals.pretty = true;
app.set('views','./views_file');
app.set('view engine', 'jade');



app.get('/upload', function(req,res){
	res.render('upload')

})

//middleware는 function이 실행되기 전에 실행이 된다.
app.post('/upload', upload.single('userfile'), function(req,res){
	console.log(req.file)
	res.send('Uploaded: '+ req.file.filename);

})

app.get('/topic/new', function(req,res){
	fs.readdir('data',function(err,files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error')
		}
	res.render('new',{topics:files});
});

})

//여러가지 route를 []안에 쓰면 사용가능하다.
app.get(['/topic','/topic/:id'],function(req,res){
	fs.readdir('data',function(err,files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error')
		}
	var id = req.params.id;
	if(id) {	
	// id 값이 있을 때
	fs.readFile('data/'+id,'utf8',function(err,data){
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error')
		}
		res.render('view',{topics:files,title:id, description: data});

		})
	}	else {

	//id값이 없을 
	res.render('view',{topics:files, title:'welcome', description:'hello, javascript for server'});
	}
})
	
})

app.post('/topic',function(req,res){
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('data/'+title, description, function(err){
		if(err){
			//errorhandler와 비슷한거구나
			res.status(500).send('Internal Server Error');

		}
		// flask에서 url_for(redirect())과 동일하다고 보면 될 듯 합니다!
		res.redirect('/topic/'+title);
	})


})


app.listen(3000,function(){
	console.log('connected 3000 port!')

})