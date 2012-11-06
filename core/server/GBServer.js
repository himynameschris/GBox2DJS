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

    GBox2D.server.GBServer = function(engine) {
        this.init();
        this.clients = new SortedLookupTable();

    };

    GBox2D.server.GBServer.prototype = {
        server : null,
        express : null,
        app : null,
        io : null,
        sockets : null,
        clients : null,
        viewPath : null,
        routePath : null,

        init : function () {

            this.express = require('express'),
                this.server = this.express(),
                this.app = this.server.listen(GBox2D.constants.GBServerNet.SERVER_PORT),
                this.iolib = require('socket.io');

            if(this.routePath != null) {
                this.routes = require(this.routePath);
                this.server.get('/', this.routes.index);
            }

            var that = this;
            this.server.configure(function() {
                console.log("dirname: " + __dirname + " viewpath: " + that.viewPath);
                that.server.set('views', that.viewPath);
                that.server.set('view engine', 'jade');
                that.server.set('view options', {layout: false});
                that.server.use(that.express.bodyParser());
                //that.server.use(that.express.methodOverride());
                that.server.use(that.server.router);
                that.server.use(that.express.static(__dirname + '/public'));
            });

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

        createEngine : function () {



        },

        onSocketConnection : function (clientConnection) {


        },
        onSocketClosed : function (clientConnection) {


        },
        onReceiveMessage : function(clientConnection, data) {


        }

    }

})();