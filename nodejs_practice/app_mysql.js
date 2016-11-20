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

//mysql 넣는 방법
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111',
  database : 'o2'
});

conn.connect();

var app = express();
app.use('/user', express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.locals.pretty = true;
app.set('views','./views_mysql');
app.set('view engine', 'jade');



app.get('/upload', function(req,res){
	res.render('upload')

})

//middleware는 function이 실행되기 전에 실행이 된다.
app.post('/upload', upload.single('userfile'), function(req,res){
	console.log(req.file)
	res.send('Uploaded: '+ req.file.filename);

})

app.get('/topic/add', function(req,res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql,function(err,topics,fields){
				if(err){
			console.log(err);
			res.status(500).send('Internal Server Error')
		} else {
			res.render('add',{topics:topics});
		}
	});
});



app.get(['/topic/:id/edit'],function(req,res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql,function(err,topics,fields){
		var id = req.params.id;
		if (id) {
			var sql = 'SELECT * FROM topic WHERE id = ?';
			conn.query(sql, [id], function(err,topic,fileds){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('edit', {topics:topics,topic:topic[0]})
				}

			})
		} else {
			console.log('There is no id.');
			res.status(500).send('Internal Server Error')
		}
		
	})	
})

app.get(['/topic/:id/delete'],function(req,res){
	var sql = 'SELECT id, title FROM topic';
	var id = req.params.id;
	conn.query(sql,function(err,topics,fields){
		var sql = 'SELECT * FROM topic WHERE id = ?';
		conn.query(sql,[id], function(err, topic, fields){
			if (err){
				console.log('error detected')
				res.status(500).send('Internal Server Error')
			} else {
				if(topic.length ===0) {
					console.log('There is no record.')
					res.status(500).send('Internal Server Error')
				} else {
				res.render('delete',{topics:topics, topic:topic[0]});
				}
			}
		});
	});
});

app.post(['/topic/:id/delete'],function(req,res){
	var id = req.params.id;
	var sql = 'Delete FROM topic WHERE id=?';
	conn.query(sql,[id],function(err,result){
		res.redirect('/topic/')
	})

});
app.post(['/topic/:id/edit'],function(req,res){
	var title=req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var id = req.params.id
	var sql = 'UPDATE topic SET title=?, description=?, author=? where id=?';
	conn.query(sql, [title,description, author, id], function(err,rows,fields){
	if(err){
		console.log(err);
		res.status(500).send('Internal Server Error');
	} else {
		res.redirect('/topic/'+id);
	}
	})
})

app.post('/topic/add',function(req,res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
	conn.query(sql, [title,description,author], function(err,result,fields){
		if(err){
			//errorhandler와 비슷한거구나
			res.status(500).send('Internal Server Error');

		}
		// flask에서 url_for(redirect())과 동일하다고 보면 될 듯 합니다!
		res.redirect('/topic/'+result.insertId);
	})
	})
	
	


//여러가지 route를 []안에 쓰면 사용가능하다.
app.get(['/topic','/topic/:id'],function(req,res){

	var sql = 'SELECT id, title FROM topic';
	conn.query(sql,function(err,topics,fields){
		var id = req.params.id;
		if (id) {
			var sql = 'SELECT * FROM topic WHERE id = ?';
			conn.query(sql, [id], function(err,topic,fileds){
				if(err){
					console.log(err);
				} else {
					res.render('view', {topics:topics,topic:topic[0]})
				}

			} )
		} else {
			res.render('view', {topics:topics})
		}
		
	})	
})



app.listen(3000,function(){
	console.log('connected 3000 port!')

})