/***************************************************************************
 * Name:        httposcserver.py
 * Purpose:     HTTP OSC Forwarder
 *
 * Author(s):   Andre Wiggins
 *
 * Created:    February 21, 2012
 * Copyright:  (c) Andre Wiggins 2012
 * License:
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ***************************************************************************/

/***** Packages ******/
var express = require('express'),
    osc = require('osc4node'),
    url = require('url'),
    socket = require('socket.io'),
		util = require('util');

/***** Globals *****/
var app = express.createServer(),
    httpbinding_port = 80,
    oscbinding_ip = 'localhost', 
    oscbinding_port = 11000,
    oscServer = new osc.Server(oscbinding_port, oscbinding_ip),
    oscClient = new osc.Client('localhost', 12000),
    io = socket.listen(app);

var values = function (object) {
	var result = [];
	for (var key in object)
		result.push(object[key]);
	return result;
}

/***** Application Setup *****/
app.configure(function() {
	app.register('.html', require('ejs'));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('view options', {layout: false});
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/static'));
	app.use(app.router);
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

io.configure(function() {
	io.set('browser client minification', true);
});

/***** Routers *****/
app.get('/', function (request, response) {
	response.render('login.html');
});

app.get('/login', function (request, response) {
	var params = url.parse(request.url, true).query;
	response.redirect('/'+params.username);
});

app.get('/:userid', function (request, response) {
	var message = new osc.Message('/'+request.params.userid, [""]);
	oscServer.send(message, oscClient);

	response.render('user.html');
});

/***** WebSocket Callbacks *****/
io.sockets.on('connection', function (websocket) {
	websocket.on('config', function(msg, callback) {
		console.log("Websocket "+msg+" ("+websocket.id+") connected!");
		websocket.set('addr', msg, callback('ready'));
	});

	websocket.on('send', function(msg) {
		console.log('Sending ' + util.inspect(msg));
		oscmsg = new osc.Message(msg.address, msg.values);
		oscServer.send(oscmsg, oscClient);
	});

	websocket.on('disconnect', function() {
		websocket.get('addr', function(err, addr) {
			if (addr != null) {
				console.log("sending /disconnect to "+addr+" (" + websocket.id+")");
				oscmsg = new osc.Message('/disconnect', [addr]);
				oscServer.send(oscmsg, oscClient);
			}
		});
	});

	/***** OSC Server Callbacks *****/
	oscServer.on('oscmessage', function(msg, rinfo) {
		websocket.get('addr', function(err, addr) {
			if (msg.address == addr || msg.address == '/broadcast')
				websocket.emit('oscmessage', {address: msg.address, value: msg.arguments[0].value});
		});
	});

});

oscServer.on('oscmessage', function(msg, rinfo) {
	console.log('Message for ' + msg.address + ': ' + util.inspect(msg.arguments));
});

/***** Start *****/
console.log('OSC server listening on '+oscbinding_ip.toString()+':'+oscbinding_port.toString());
console.log('HTTP server running at http://localhost:'+httpbinding_port.toString()+'/');
app.listen(httpbinding_port);
