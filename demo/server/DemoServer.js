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

    /**
     implementing the gbengine class, a singleton to handle management of the box2d world, compile movements of box2d bodies, register and fire a custom contact listener and remove bodies from a queue

     */
    GBox2D.server.DemoServer = function() {
        this.viewPath = GBox2D.Demo.constants.ServerNet.VIEW_PATH;
        this.routePath = GBox2D.Demo.constants.ServerNet.ROUTE_PATH;

        this.init();
        this.clients = new SortedLookupTable();
        this.games = new SortedLookupTable();

    };

    GBox2D.server.DemoServer.prototype = {
        games : null,

        init : function () {

            GBox2D.server.DemoServer.superclass.init.call(this);

        },

        createEngine : function (req, res, next) {

            //Get the next Game Engine ID
            var gameID = req.server.getNextGameID();

            //This will serve as the socket.io address for the client to connect to
            var sock = req.server.io.of('/'+gameID);

            //create our new game engine and pass its socket.io namespace
            var engine = new GBox2D.server.DemoServerEngine(sock);

            //set the engine's gameID
            engine.gameID = gameID;

            req.server.games.setObjectForKey(engine, gameID);

            //pass the engine to the express req
            req.gameEngine = engine;



            for(var i = 0; i < 50 ; i ++) {
                var x = (640/2) + Math.sin(i/5);
                var y = i * -1*3;

                // Make a square
                engine._nodeFactory.createBox(x / 32, y / 32, 0, .5);
            }

            engine.start();

            next();

        },

        joinEngine : function (req, res, next) {

            var engine = req.server.games.objectForKey(req.gameID);

            engine.gameID = req.gameID;

            req.gameEngine = engine;

            next();

        },

        onSocketConnection : function (clientConnection) {

            console.log('log: user connected');

            var newClient = new GBox2D.server.GBServerClient( clientConnection, this.getNextClientID());

            this.clients.setObjectForKey(newClient, newClient.getSocketID() );

            clientConnection.emit("connected", {clientID : newClient.clientid});

        },
        onSocketClosed : function (clientConnection) {


        },
        onReceiveMessage : function(clientConnection, data) {


        }

    };

    GBox2D.extend(GBox2D.server.DemoServer, GBox2D.server.GBServer);

})();