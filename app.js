var express= require('express');
var port = 1313;
var io = require('socket.io')(1314);
var app = express();
var http = require('https');


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + req.path);
});

io.on('connection', function(socket) {
	console.log('test');
});

app.listen(port, function() {
	console.log('listening on ' + port);
});


function testSockets() {

	var body="";
	var req = http.request(
		{
			method: 'POST',
			host: 'api.particle.io',
			path: '/v1/devices/54ff6e066678574938480467/bttn?access_token=185968afbdb45cead3dc4d17d196a9a6b822fa29'
		},
		function(res) {
			res.on('data', function(chunk) {
				body+=chunk;
			});
			res.on('end', function() {

				var json = JSON.parse(body);
				io.emit('current_notes', json['return_value']);
				console.log(json['return_value']);
				testSockets();
			});
		}
	);

	req.end();


}

testSockets();

//setInterval(testSockets, 75);