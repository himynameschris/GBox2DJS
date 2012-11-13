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
    /**
     * Creates a node controller instance
     * @class Manages nodes for either the server or the client
     */
    GBox2D.core.GBNodeController = function() {
        this.nodes = new SortedLookupTable();
        this.players = new SortedLookupTable();
    };

    GBox2D.core.GBNodeController.prototype = {
        nodes								: null,					// A SortedLookupTable for all entities
        players									: null,					// A SortedLookupTable for players only, stored using client.getClientid()

        /**
         * Adds a node to the registry
         * @param node the node to add
         */
        addNode: function(node) {
            this.nodes.setObjectForKey(node, node.nodeid);

        },
        /**
         * Updates a node by calling update description for the corresponding node
         * @param nodeid the id of the node to update
         * @param newDescription the description of the update
         */
        updateNode: function(nodeid, newDescription) {
            var node = this.nodes.objectForKey( nodeid );

            if( node != null ) {

                //call update from description instead for better sub-classing
                node.updateFromDescription(newDescription);

            }

        },
        /**
         * Removes a node from the registry and destroys it
         * @param nodeid the id of the node to remove and dealloc
         */
        removeNode: function(nodeid) {
            var node = this.nodes.objectForKey( nodeid );

            node.dealloc();
            this.nodes.remove( nodeid );
        },
        /**
         * Adds a player to the player registry
         * @param player the player to add
         */
        addPlayer: function(player) {
            this.players.setObjectForKey( player, player.getClientID() );
        },
        /**
         * Removes a player from the player registry and removes the players node
         * @param clientid the id of the player
         */
        removePlayer: function(clientid) {
            var player = this.players.objectForKey(clientid);
            if(!player) {
                console.log("(FieldController), No 'Character' with clientid " + clientid + " ignoring...");
                return;
            }

            this.removeNode( player._node.nodeid );
            this.players.remove(player.clientid);
        },
        /**
         * Prune the nodes the do not exist in the world state from the server
         * @param activeNodes the active nodes, any existing node not on the list will be pruned
         */
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
                    console.log("removing nodeid:" + node.nodeid);
                }

                totalRemoved++;
            }
        },
        /**
         * Clean up members (all nodes and players)
         */
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
        /**
         * Get the node registry
         * @return {SortedLookupTable} the current node registry
         */
        getNodes: function() { return this.nodes },
        /**
         * Get the player registry
         * @return {SortedLookupTable} the current player registry
         */
        getPlayers: function() { return this.players; },
        /**
         * Lookup the node by id
         * @param anEntityid the id to lookup
         * @return {GBNode} the desired node or 'undefined'
         */
        getNodeWithid: function( anEntityid ) { return this.nodes.objectForKey(anEntityid); },
        /**
         * Lookup the node by id
         * @param anEntityid the id to lookup
         * @return {GBNode} the desired node or 'undefined'
         */
        getPlayerWithid: function( aClientid ) { return this.players.objectForKey(aClientid); }

    };

})();