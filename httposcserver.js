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
    socket = require('socket.io');

/***** Globals *****/
var app = express.createServer(),
    httpbinding_port = 8124,
    oscbinding_ip = 'localhost', 
    oscbinding_port = 11000,
    server = new osc.Server(oscbinding_port, oscbinding_ip),
    client = new osc.Client('localhost', 12000),
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
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/static'));
	app.use(app.router);
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

/***** Routers *****/
app.get('/*', function (request, response) {
	var reqobj = url.parse(request.url, true);
  var path = reqobj.pathname;
	var params = values(reqobj.query);
	params = (params.length > 1) ? params : ['']

	var message = new osc.Message(path, params);
	server.send(message, client);

	response.render('layout.html');
});

/***** Start *****/
console.log('OSC server listening on '+oscbinding_ip.toString()+':'+oscbinding_port.toString());
console.log('HTTP server running at http://localhost:'+httpbinding_port.toString()+'/');
app.listen(httpbinding_port);
