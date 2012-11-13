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
     * Creates a new client node
     * @class Represents the base client node class
     * @extends GBox2D.core.GBNode
     * @param nodeDesc the description of the node
     * @param sprite the node's sprite string
     */
    GBox2D.client.GBClientNode = function(nodeDesc, sprite) {
        this.init();
        this.nodeid = nodeDesc.nodeid;
        this.clientid = nodeDesc.clientid;
        this.sprite = sprite;
        this.x = nodeDesc.x;
        this.y = nodeDesc.y;
        this.nodeType = nodeDesc.nodeType;
        //this.position = Point.prototype.ZERO;
        return this;
    };

    GBox2D.client.GBClientNode.prototype = {
        sprite : null,

        /**
         * Initializes the client node
         */
        init : function() {

            GBox2D.client.GBClientNode.superclass.init.call(this);

        },

        /**
         * Update the client's sprite position
         */
        updateSprite : function() {
            //console.log('setting pos x: ' + this.x + ' y:' + this.y + ' for node: ' + this.nodeid);
            this.sprite.setPosition(cc.p(this.x, this.y));
            this.sprite.setRotation(-1 * cc.RADIANS_TO_DEGREES(this.rotation));
            //console.log('sprite x: ' + this.sprite.getPositionX() + ' y: ' + this.sprite.getPositionY());
        },

        /**
         * Clean up the node members if needed
         */
        dealloc: function() {
            this.sprite.removeFromParentAndCleanup(true);
        }

    };

    GBox2D.extend(GBox2D.client.GBClientNode, GBox2D.core.GBNode);

})();