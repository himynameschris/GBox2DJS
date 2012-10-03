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

var g_gbclientengineinstance = null;

(function(){

    /**
     implementing the gbengine class, a singleton to handle management of the box2d world,
     compile movements of box2d bodies, register and fire a custom contact listener and
     remove bodies from a queue
     */
    GBox2D.client.GBClientEngine = function() {
        this.init();
    };

    GBox2D.client.GBClientEngine.prototype = {
        // Properties
        viewDelegate : null,
        fails : 0,
        keysPressed : [],
        /**
         * Function to setup networking (instantiate client or server net)
         */
        setupNetwork : function() {
            this.netChannel = GBox2D.client.GBClientNet.prototype.getInstance(this);
        },

        setViewDelegate : function(aDelegate) {
            this.viewDelegate = aDelegate;
        },

        /*
         * set game clock to server clock on connect
         */
        netDidConnect : function() {

        },

        /**
         * Function to setup common command map if needed
         */
        setupCmdMap : function() { },

        /**
         initialize a new instance of the engine
         */
        init : function() {
            GBox2D.client.GBClientEngine.superclass.init.call(this);

            this.inputCommands = new SortedLookupTable();
        },

        /**
         @return the singleton instance of gbengine
         */
        getInstance : function() {
            if(g_gbclientengineinstance == null) {
                g_gbclientengineinstance = new GBox2D.client.GBClientEngine();
            }
            return g_gbclientengineinstance;
        },

        /**
         this method will be scheduled to be called at the frame rate interval
         in the client, it will be responsible for updating the display
         */
        update : function() {
            GBox2D.client.GBClientEngine.superclass.update.call(this);

            //console.log('clock: ' + this.gameClock + ' tick: ' + this.gameTick);

            this.nodeController.getNodes().forEach( function(key, node){
                node.updateSprite();
            }, this );

            this.compileInput();

            //update GBNode positions
            this.renderAtTime(this.gameClock - 75 );
            this.netChannel.update();

        },

        renderAtTime : function(renderTime) {

            /*
             Method:
             -get incoming update buffer, if smaller than 2 then return
             -iterate through updates, looking for update before and after rendertime
             -interpolate distance betw states
            */

            var buffer = this.netChannel.serverUpdateBuffer,
                len = buffer.length;

            //check for at least 2 updates
            if (len<2) return;
            var maxInterp = 150,
                maxInterpSQ = maxInterp * maxInterp;

            //use to store update before and after
            var nextUp = null,
                prevUp = null;

            var i = 0;
            while(++i < len)
            {
                var currUp = buffer[i];

                //we fall betw this and the prev
                if(currUp.gameClock >= renderTime) {
                    prevUp = buffer[i-1];
                    nextUp = currUp;
                    break;
                }

            }

            if(nextUp == null || prevUp == null) {
                console.log('sad day');
                this.fails++;
                if(this.fails > 30) {
                    this.netChannel.firstUpdate = true;
                    fails = 0;
                }
                return false;
            }

            var durBetwPoints = (nextUp.gameClock - prevUp.gameClock);
            var offsetTime = renderTime - prevUp.gameClock;
            var activeNodes = {};

            var t = offsetTime / (nextUp.gameClock - prevUp.gameClock);
            if(t > 1.0)  t = 1.0;
            else if(t < 0) t = 0.0;

            //var that = GBox2D.client.GBClientEngine.prototype.getInstance();

            var prevUpNodes = this.generateNodeTable(prevUp.nodes);
            var that = this;

            var newx = 0, newy = 0, newr = 0;

            //update nodes
            nextUp.nodes.forEach(function(nodeDesc, key) {

                //console.log('node desc: ' + JSON.stringify(nodeDesc));

                var nodeid = nodeDesc.nodeid;
                var node = that.nodeController.getNodeWithid(nodeid);

                //console.log('nodeid: ' + nodeid + ' node x: ' + nodeDesc.x + ' node y: ' + nodeDesc.y);

                if (!node) {

                    that.createNodeFromDescription(nodeDesc);

                }
                else
                {
                    var prevNodeDesc = prevUpNodes.objectForKey(nodeid);

                    if(!prevNodeDesc) return;

                    var x1 = prevNodeDesc.x;
                    var x2 = nodeDesc.x;

                    var y1 = prevNodeDesc.y;
                    var y2 = nodeDesc.y;

                    var r1 = prevNodeDesc.rotation;
                    var r2 = nodeDesc.rotation;

                    newx = ( (x2 - x1 ) * t) + x1;
                    newy = ( (y2 - y1 ) * t) + y1;
                    newr = ( (r2 - r2 ) * t) + r1;

                }

                that.nodeController.updateNode( nodeid, newx, newy, newr, nodeDesc );
                activeNodes[nodeid] = true;

            });

            that.nodeController.pruneNodes(activeNodes);

        },

        generateNodeTable : function (nodesDesc) {

            var table = new SortedLookupTable();

            //place nodes into sorted table, lookup by nodeid
            nodesDesc.forEach(function(nodeDesc, key) {

                table.setObjectForKey(nodeDesc, nodeDesc.nodeid);

            });

            return table;

        },

        createNodeFromDescription : function (nodeDesc) {

            console.log('create it!');

            var view,sprite = null;
            if(nodeDesc.nodeView != null) {
                sprite = this.viewDelegate.createSprite(nodeDesc.nodeView);
            } else {
                sprite = this.viewDelegate.createSprite(nodeDesc.nodeType);
            }

            sprite.setPosition(nodeDesc.x * 32, nodeDesc.y * 32);

            var node = new GBox2D.client.GBClientNode(nodeDesc, sprite);

            this.nodeController.addNode(node);
        },

        compileInput : function () {
            //Override this

        }


    };

    GBox2D.extend(GBox2D.client.GBClientEngine, GBox2D.core.GBEngine, null);
})();