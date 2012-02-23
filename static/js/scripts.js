/***************************************************************************
 * Name:        scripts.js
 * Purpose:     Scripts for OSC Forwarder
 *
 * Author(s):   Andre Wiggins
 *
 * Created:    February 22, 2012
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

$(function() {
	var $send = $('#send').attr('disabled', 'disabled');
	var socket = io.connect('http://localhost');

	socket.on('connect', function() {
		socket.emit('config', location.pathname, function(status) {
			if (status = 'ready')
				$send.removeAttr('disabled');
			else
				$('body').css({'background-color': 'red'});
		});
	});

	socket.on('oscmessage', function(msg) {
		$('#messages').prepend('<p>'+msg.address+': '+msg.value+'</p>');
	});

	$('#sender').submit(function () {
		if ($send.attr('disabled') == undefined) {
			var msg = {};
			msg.address = location.pathname;
			msg.values = [$('#text').val()];
			
			socket.emit('send', msg);	

			$('#text').val('');
		}

		return false;
	});

	window.scrollTo(0, 1);
});
