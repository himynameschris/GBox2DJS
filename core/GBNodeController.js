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

(function() {

    GBox2D.core.GBNodeController = function() {
        this.nodes = new SortedLookupTable();
        this.players = new SortedLookupTable();
    };

    GBox2D.core.GBNodeController.prototype = {
        nodes								: null,					// A SortedLookupTable for all entities
        players									: null,					// A SortedLookupTable for players only, stored using client.getClientid()

        addNode: function(node) {
            this.nodes.setObjectForKey(node, node.nodeid);

        },

        updateNode: function(nodeid, newPosition, newRotation, newDescription) {
            var node = this.nodes.objectForKey( nodeid );

            if( node != null ) {
                node.position.x = newPosition.x;
                node.position.y = newPosition.y;
                node.rotation = newRotation;
                node.lastReceivedEntityDescription = newDescription;
            }
        },

        removeNode: function(nodeid) {
            var node = this.nodes.objectForKey( nodeid );

            node.dealloc();
            this.nodes.remove( nodeid );
        },

        addPlayer: function(player) {
            this.addNode( player );
            this.players.setObjectForKey( player, player.clientid );
        },

        removePlayer: function(nodeid) {
            var player = this.players.objectForKey(nodeid);
            if(!player) {
                console.log("(FieldController), No 'Character' with clientid " + nodeid + " ignoring...");
                return;
            }

            this.removeNode( player.nodeid );
            this.players.remove(player.clientid);
        },

        pruneNodes: function(activeNodes) {
            var nodesKeysArray = this.nodes._keys;
            var i = nodesKeysArray.length;
            var key;
            var totalRemoved = 0;

            while (i--)
            {
                key = nodesKeysArray[i];

                // This entity is still active. Move along.
                if( activeNodes[key] )
                    continue;

                // This entity is not active, check if it belongs to the server
                var node = this.nodes.objectForKey(key);
                var isPlayer = this.players.objectForKey( node.nodeid ) != null;


                // Remove special way if player (which calls removeEntity on itself as well), or just remove it as an entity
                if( isPlayer ) {
                    this.removePlayer( node.nodeid );
                } else {
                    this.removeNode( node.nodeid );
                }

                totalRemoved++;
            }
        },

        dealloc: function() {
            this.players.forEach( function(key, node){
                this.removePlayer(node.clientid);
            }, this );
            this.players.dealloc();
            this.players = null;

            this.nodes.forEach( function(key, node){
                this.removeNode(node.nodeid);
            }, this );
            this.nodes.dealloc();
            this.nodes = null;


            this.view = null;
        },

        getNodes: function() { return this.nodes },
        getPlayers: function() { return this.players; },
        getEntityWithid: function( anEntityid ) { return this.nodes.objectForKey(anEntityid); },
        getPlayerWithid: function( aClientid ) { return this.players.objectForKey(aClientid); }

    };

})();