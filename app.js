var express= require('express');
var port = 1313;
var io = require('socket.io')(port+1);
var app = express();
var http = require('https');

app.get('/', function(req, res) {
	res.send("Hello World");
	res.end();
});

io.on('connection', function(socket) {

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
			path: '/v1/devices/51ff65065067545726230187/bttn?access_token=185968afbdb45cead3dc4d17d196a9a6b822fa29'
		},
		function(res) {
			console.log('requesting');
			res.on('data', function(chunk) {
				console.log('got chunk');
				body+=chunk;
			});
			res.on('end', function() {

				var json = JSON.parse(body);

				console.log(json['return_value']);
			});
		}
	);

	req.end();


}

setInterval(testSockets, 100);