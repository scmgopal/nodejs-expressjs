const http = require('http');
 
const hostname = '127.0.0.1';
const port = 1337;
 

 /*
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

/* 위의 코드와 동일한 코드, 위의 코드는 함축형이라고 볼 수 있음  */

var server = http.createServer(function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');

});

server.listen(port,hostname, function() {
	console.log(`Server running at http://${hostname}:${port}/`);


});
