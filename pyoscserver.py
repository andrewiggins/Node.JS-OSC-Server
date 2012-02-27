#!/usr/bin/env python
#-------------------------------------------------------------------------------
# Name:        printing_server.py
# Purpose:     An OSC server to test httposcserver.js
#
# Author(s):   Andre Wiggins
#
# Created:     February 10, 2012
# Copyright:   (c) Andre Wiggins 2011
# License:
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#-------------------------------------------------------------------------------

import OSC
import time
import thread
import random

def rm_addr(addr, tags, data, client_addr):
	print "OSCMessage '{}': {}".format(addr, str(data))
	if data[0] in addresses:
		addresses.remove(data[0])

def add_addr(addr, tags, data, client_addr):
	print "OSCMessage '{}': {}".format(addr, str(data))
	addresses.add(addr)

ip = ''
port = 12000
server = OSC.OSCServer((ip, port))
server.addMsgHandler('/disconnect', rm_addr)
server.addMsgHandler('default', add_addr)

clients = []

remote_ip = 'localhost'
remote_port = 11000
local_client = OSC.OSCClient()
local_client.connect((remote_ip, remote_port))
clients.append(local_client)

remote_client_ip = '173.253.164.143'
remote_client_port = 11000
remote_client = OSC.OSCClient()
remote_client.connect((remote_client_ip, remote_client_port));
clients.append(remote_client)


addresses = set(['/broadcast'])

if __name__ == '__main__':
	print "Server listening on " + str(port)
	thread.start_new_thread(server.serve_forever, ())

	while True:
		print '~'*20
		for addr in addresses:
			#msg = OSC.OSCMessage(addr, random.randint(1, 100))
			msg = OSC.OSCMessage(addr, [3])
			print "Sending {}: {}".format(msg.address, msg.values())
			for client in clients:
				client.send(msg)
		print '~'*20

		time.sleep(2)
