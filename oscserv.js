var express = require('express'),
    osc = require('osc4node'),
    url = require('url'),
    app = express.createServer();

var httpbinding_port = 8124,
    oscbinding_ip = 'localhost', 
    oscbinding_port = 11000,
    server = new osc.Server(oscbinding_port, oscbinding_ip),
    client = new osc.Client('localhost', 12000);

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

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

	var message = new osc.Message(path, params);
	server.send(message, client);

	response.writeHead(200, {'Content-Type': 'text/plain'});

	response.write(path);
	response.write('\n');
	response.write(params.toString());

	response.end();
});

console.log('OSC server listening on '+oscbinding_ip.toString()+':'+oscbinding_port.toString());
console.log('HTTP server running at http://localhost:'+httpbinding_port.toString()+'/');
app.listen(httpbinding_port);
