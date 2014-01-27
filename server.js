var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/client'));

server.listen(8080);
console.log('SERVER UP AND RUNNING');
/*

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/app.js', function(req, res) {
	res.sendfile(__dirname + '/app.js');
});

*/

io.sockets.on('connection', function (socket) {
	socket.on('broadcast message', function(message) {
		socket.broadcast.emit('new message', message);
	});
});