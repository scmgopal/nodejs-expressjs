

module.exports = function() {
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
app.set('views','./views/mysql');
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
        password: '1111',
        database : 'o2'

    })
}))




  return app;
}