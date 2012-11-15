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
     * Creates a new net channel
     * @class Represents the base server net channel class
     * @param engine the engine delegate
     * @param connection the connection to be used by the engine and net channel
     */
    GBox2D.server.GBServerNet = function(engine, connection) {
        this.init(connection);
        this.clients = new SortedLookupTable();
        this.engineDelegate = engine;
    };

    GBox2D.server.GBServerNet.prototype = {
        server : null,
        express : null,
        app : null,
        sockets : null,

        io : null,
        clients : null,

        /**
         * Initializes the server net channel, setting methods to handle socket connects, disconnects and messages
         * @param connection the connection to be used by the net channel
         */
        init : function(connection) {
            this.io = connection;

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
        /**
         * The update method called by the engine at the desired rate to emit updates to the clients
         * @param gameclock the clock position (optional)
         * @param data the update payload
         */
        update : function(gameclock, data) {

            //construct our payload
            var payload = JSON.stringify(data);

            if(this.io === "undefined")
            {

            }else{
                //TODO: compression by removing all non changes

                //TODO: throttle emits with update rate
                this.io.emit('update', payload);

            };

        },
        /**
         * The update method called by the engine at the desired rate to emit updates to the clients
         * @param clientConnection the client socket that connected
         */
        onSocketConnection : function (clientConnection) {

            console.log('log: user connected');

            var newClient = new GBox2D.server.GBServerClient( clientConnection, this.getNextClientID());

            this.clients.setObjectForKey(newClient, newClient.getSocketID() );

            this.engineDelegate.addPlayerNode(newClient);

            clientConnection.emit("connected", {clientID : newClient.clientid});

        },
        /**
         * The update method called by the engine at the desired rate to emit updates to the clients
         * @param clientConnection the client socket that disconnected
         */
        onSocketClosed : function (clientConnection) {


        },
        /**
         * The update method called by the engine at the desired rate to emit updates to the clients
         * @param clientConnection the client socket that disconnected
         * @param data the data received
         */
        onReceiveMessage : function(clientConnection, data) {


        },
        /**
         * Return the next incremented client ID
         */
        getNextClientID: function() { return ++nextClientID }
    }

})();