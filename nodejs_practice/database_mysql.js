var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111',
  database : 'o2'
});

conn.connect();

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows[0].solution);
// });

// var sql = 'SELECT * FROM topic';
// conn.query(sql,function(err,rows,fields){
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		for(var i=0; i<rows.length; i++)
// 		console.log(rows[i].description)
		

// 	}
// })

//파이썬에서 fomatting하는 방법이 javascript에서는 ?로하네..
// var sql = 'INSERT INTO topic (title,description, author) values(?,?,?)';
// var params = ['Supervisor', 'Watcher','graphittie']
// conn.query(sql, params,function(err, rows, fields){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(rows);
// 		//console.log(rows.insertId);
// 	}

// })

// var sql = 'UPDATE topic set title=?, author=? where id=?';
// var params = ['NPM', 'leezche',1]
// conn.query(sql, params,function(err, rows, fields){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(rows);
// 		//console.log(rows.insertId);
// 	}

// })


var sql = 'DELETE FROM topic WHERE id =?;'
var params = [1]
conn.query(sql, params,function(err, rows, fields){
	if(err){
		console.log(err);
	} else {
		console.log(rows);
		//console.log(rows.insertId);
	}

})


conn.end();