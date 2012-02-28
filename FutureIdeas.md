Future Ideas
============

Generalize
----------

* generalize server such that someone can run server without
  having to write a webserver (it just forwards messages)
* provide javascript library to set event handlers on receiving
  osc message and to send osc message.

Server
------

* use `config.yaml` to define:
	+ location of static files (js/css/img)
	+ location of html files
	+ osc addresses to listen for
	+ custom server osc message handlers

Webpage
-------

Uses JavaScript library to set handlers.

	var osc = new osc.server();
	osc.setListener('/request', function() {
		osc.send('/resposne', ['value1', 'value2']);
	});
