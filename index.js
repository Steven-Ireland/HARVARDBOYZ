var express= require('express');
var app = express();

app.get('/', function(req, res) {
	res.write("Hello World");
	res.end();
});

app.listen(1337, function() {
	console.log('listening on 3000');
});