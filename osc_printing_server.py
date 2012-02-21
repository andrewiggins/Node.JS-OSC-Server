#!/usr/bin/env python
#-------------------------------------------------------------------------------
# Name:        printing_server.py
# Purpose:     An OSC server that listens on localhost:3333 and prints any
#              any message it receives
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

ip = ''
port = 12000
server = OSC.OSCServer((ip, port))
server.addMsgHandler('default', server.msgPrinter_handler)

if __name__ == '__main__':
	print "Server listening on " + str(port)
	server.serve_forever()
