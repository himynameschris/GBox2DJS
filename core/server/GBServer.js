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

            var express = require('express'),
                http = require('http'),
                passport = require('passport'),
                LocalStrategy = require('passport-local').Strategy,
                server = express(),
                iolib = require('socket.io');

            if(this.routePath != null) {
                this.routes = require(this.routePath);
                server.get('/', this.routes.index);
            }

            var viewPath = this.viewPath;
            server.configure(function() {
                console.log("dirname: " + __dirname + " viewpath: " + viewPath);
                server.set('views', viewPath);
                server.set('view engine', 'jade');
                server.set('view options', {layout: false});
                server.use(express.bodyParser());
                //that.server.use(that.express.methodOverride());
                server.use(server.router);
                server.use(express.static(__dirname + '/public'));
            });

            var app = http.createServer(server).listen(GBox2D.constants.GBServerNet.SERVER_PORT);

            var io = iolib.listen(app);
            io.set("log level", 0);

            server.use('/', express.static(__dirname + '/../../') );

            server.get('/api/hello', function(req,res){
                res.send('Hello World');
            });

            var that = this;
            io.on('connection', function (client) {
                that.onSocketConnection(client);

                client.on('clientMessage', function (data) {
                    that.onReceiveMessage(client, data);
                });

                client.on('disconnect', function() {
                    that.onSocketClosed(client)
                });

            });

            this.express = express,
                this.server = server,
                this.iolib = iolib,
                this.io = io,
                this.passport = passport,
                this.http = http;

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