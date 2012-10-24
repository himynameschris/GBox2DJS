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
    GBox2D.server.DemoServerNet = function(engine) {
        this.viewPath = "D:/workspace/GBox2DJS/demo/server/views";
        this.routePath = "../../demo/server/routes";
        this.init();
        this.clients = new SortedLookupTable();
        this.engineDelegate = engine;
    };

    GBox2D.server.DemoServerNet.prototype = {
        server : null,
        express : null,
        app : null,
        io : null,
        sockets : null,
        clients : null,
        viewPath : "",
        routePath : "",

        init : function() {

            GBox2D.server.DemoServerNet.superclass.init.call(this);

        },
        update : function(gameclock, data) {

            GBox2D.server.DemoServerNet.superclass.update.call(this, gameclock, data);

        },
        onSocketConnection : function (clientConnection) {

            GBox2D.server.DemoServerNet.superclass.onSocketConnection.call(this, clientConnection);

        },
        onSocketClosed : function (clientConnection) {

            var client = this.clients.objectForKey( clientConnection.sessionId );

            if(!client) {
                console.warn("(ServerNetChannel)::onSocketClosed - ERROR - Attempting to remove client that was not found in our list! ");
                return;
            }

            this.clients.remove( clientConnection.sessionId );
            client.dealloc();

            console.log("client disconnected");

        },
        onReceiveMessage : function(clientConnection, data) {

            var client = this.clients.objectForKey( clientConnection.sessionId );

            var msg = JSON.parse(data);

            this.engineDelegate.inputReceived(client, msg);

        },
        getNextClientID: function() { return ++nextClientID }
    }

    GBox2D.extend(GBox2D.server.DemoServerNet, GBox2D.server.GBServerNet);

})();