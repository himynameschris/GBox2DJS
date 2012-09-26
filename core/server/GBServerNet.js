/****************************************************************************
 Copyright (c) 2012 - Chris Hannon / http://www.channon.us

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

(function(){

    var nextClientID = 0;

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.server.GBServerNet = function() {
        this.init();
    };

    GBox2D.server.GBServerNet.prototype = {
        server : null,
        express : null,
        app : null,
        io : null,
        sockets : null,

        init : function() {
            this.express = require('express'),
                this.server = this.express(),
                this.app = this.server.listen(GBox2D.constants.GBServerNet.SERVER_PORT),
                this.iolib = require('socket.io');

            this.io = this.iolib.listen(this.app);
            this.io.set("log level", 0);

            this.server.use('/', this.express.static(__dirname + '/../../') );

            this.server.get('/api/hello', function(req,res){
                res.send('Hello World');
            });

            var that = this;
            this.io.on('connection', function (client) {
                that.onSocketConnection(client);

                client.on('clientMessage', function (data) {
                    that.onReceiveMessage(client, data);
                });

                client.on('disconnect', function() {
                    that.onSocketClosed(client)
                });

            });

        },
        update : function(gameclock, data) {

            //construct our payload
            var payload = JSON.stringify(data);

            if(this.io === "undefined")
            {

            }else{
                //TODO: compression by removing all non changes

                //TODO: throttle emits with update rate
                this.io.sockets.emit('update', payload);

            };

        },
        onSocketConnection : function (clientConnection) {


        },
        onSocketClosed : function (clientConnection) {


        },
        onReceiveMessage : function(clientConnection, data) {


        },
        getNextClientID: function() { return ++nextClientID }
    }

})();