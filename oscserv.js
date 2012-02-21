var express = require('express'),
app = express.createServer();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler());

app.get('/*', function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end(request.url);
});

console.log('Server running at http://localhost:8124/')
app.listen(8124);
