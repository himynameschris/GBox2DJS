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

var g_gbserverinstance = null;

(function(){

    GBox2D.namespace("GBox2D.GBServerNet");

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.GBServerNet = function() {

    };

    GBox2D.GBServerNet.prototype = {
        server : null,
        express : null,
        app : null,
        io : null,
        sockets : null,
        getInstance : function() {
            if (g_gbserverinstance == null)
            {
                g_gbserverinstance = new GBox2D.GBServerNet();
                this.init();
            }

            return g_gbserverinstance;
        },
        init : function() {
            this.express = require('express'),
                this.server = this.express(),
                this.app = this.server.listen(3000),
                this.io = require('socket.io');

            this.sockets = this.io.listen(this.app);

            this.server.use('/', this.express.static(__dirname + '/../') );

            this.server.get('/api/hello', function(req,res){
                res.send('Hello World');
            });

            this.sockets.on('connection', function (socket) {
                socket.broadcast.emit('broadcast: user connected!');
                console.log('log: user connected');
            });

            this.sockets.on('update', function (socket) {
               console.log('update');
            });
        },
        sendUpdate : function(data) {

            console.log("updating! data: " + data);
            if(this.sockets === "undefined")
            {

            }else{
                GBox2D.GBServerNet.prototype.getInstance().sockets.sockets.emit('update', data);
                //this.sockets.emit('update');
            };

        }
    }

})();