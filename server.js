var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server);

var Channel = function(name) {
	this.name = name;
	this.clients = [];
}
//var channels = {def: new Channel('Default Channel')};

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
	//channels.def.push(socket);
	socket.on('broadcast message', function(message) {
		socket.broadcast.emit('new message', message);
	});

	socket.on('select channel', function(message) {
		socket.broadcast.emit('new message', message);
	});
});