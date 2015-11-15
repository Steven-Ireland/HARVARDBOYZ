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
			path: '/v1/devices/54ff6f066678574939320667/bttn?access_token=185968afbdb45cead3dc4d17d196a9a6b822fa29'
		},
		function(res) {
			res.on('data', function(chunk) {
				body+=chunk;
			});
			res.on('end', function() {

				var json = JSON.parse(body);
				io.emit('current_notes', json['return_value']);
				console.log("Left:" + json['return_value']);
				testSockets();
			});
		}
	);

	req.on('error', function(e) {
		console.log("An error occurred" + e);
		testSockets();
	});

	req.setTimeout(10000, function() {
		console.log("timed out");
		testSockets();
	});

	req.end();
}

function testSocketsRight() {

	var body="";
	var req = http.request(
		{
			method: 'POST',
			host: 'api.particle.io',
			path: '/v1/devices/54ff6c066667515139461467/bttn?access_token=185968afbdb45cead3dc4d17d196a9a6b822fa29'
		},
		function(res) {
			res.on('data', function(chunk) {
				body+=chunk;
			});
			res.on('end', function() {

				var json = JSON.parse(body);
				io.emit('current_notes_right', json['return_value']);
				console.log("Right:" + json['return_value']);
				testSocketsRight();
			});
		}
	);

	req.on('error', function(e) {
		console.log("An error occurred" + e);
		testSocketsRight();
	});

	req.setTimeout(10000, function() {
		console.log("timed out");
		testSocketsRight();
	});
	req.end();
}


testSockets();
//testSocketsRight();

//setInterval(testSockets, 75);