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
     implmenting the gbengine class, a singleton to handle management of the box2d world, compile movements of box2d bodies, register and fire a custom contact listener and remove bodies from a queue

     */
    GBox2D.client.GBClientEngine = function() {
        this.init();
        this.setupNetwork();
        this.setupCmdMap();
    };

    GBox2D.client.GBClientEngine.prototype = {
        // Properties
        /**
         * Function to setup networking (instantiate client or server net)
         */
        setupNetwork : function() {
            this.netChannel = GBox2D.client.GBClientNet.prototype.getInstance();
        },

        /**
         * Function to setup common command map if needed
         */
        setupCmdMap : function() { },

        /**
         initialize a new instance of the engine
         */
        init : function() {

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



        }


    };

    GBox2D.extend(GBox2D.client.GBClientEngine, GBox2D.GBEngine, null);
})();