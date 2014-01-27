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
function getRooms(socket) {
	return io.sockets.manager.roomClients[socket.id];
}

io.sockets.on('connection', function (socket) {
	socket.join('Default room');
	socket.on('broadcast message', function(message) {
		socket.broadcast.to(getRooms(socket)[0]).emit('new message', message);
	});

	socket.on('select room', function(room) {
		var rooms = getRooms(socket);
		for(var room in rooms) {
			socket.leave(rooms[room]);
		}
		socket.join(room);
	});
});