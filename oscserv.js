var express = require('express'),
    osc = require('osc4node'),
    url = require('url'),
    app = express.createServer();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler());

var server = new osc.Server(1100, 'localhost'),
    client = new osc.Client('localhost', 12000);

var values = function (object) {
	var result = [];
	for (var key in object)
		result.push(object[key]);
	return result;
}

app.get('/*', function (request, response) {
	var reqobj = url.parse(request.url, true);
  var path = reqobj.pathname;
	var params = values(reqobj.query);

	response.writeHead(200, {'Content-Type': 'text/plain'});

	response.write(path);
	response.write('\n');
	response.write(params.toString());

	response.end();
});

console.log('Server running at http://localhost:8124/')
app.listen(8124);
