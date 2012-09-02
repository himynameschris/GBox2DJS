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

var g_democlientengineinstance = null;

(function(){

    /**
     implementing the gbengine class, a singleton to handle management of the box2d world,
     compile movements of box2d bodies, register and fire a custom contact listener and
     remove bodies from a queue
     */
    GBox2D.client.DemoClientEngine = function() {
        this.init();
    };

    GBox2D.client.DemoClientEngine.prototype = {
        // Properties

        /**
         * Function to setup networking (instantiate client or server net)
         */
        setupNetwork : function() {
            GBox2D.client.DemoClientEngine.superclass.setupNetwork.call(this);
        },

        setViewDelegate : function(aDelegate) {
            GBox2D.client.DemoClientEngine.superclass.setViewDelegate.call(this, aDelegate);
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
            GBox2D.client.DemoClientEngine.superclass.init.call(this);
        },

        /**
         @return the singleton instance of gbengine
         */
        getInstance : function() {
            if(g_democlientengineinstance == null) {
                g_democlientengineinstance = new GBox2D.client.DemoClientEngine();
            }
            return g_democlientengineinstance;
        },

        /**
         this method will be scheduled to be called at the frame rate interval
         in the client, it will be responsible for updating the display
         */
        update : function() {
            GBox2D.client.DemoClientEngine.superclass.update.call(this);

        },

        renderAtTime : function(renderTime) {
            GBox2D.client.DemoClientEngine.superclass.renderAtTime.call(this, renderTime);

        },

        createNodeFromDescription : function (nodeDesc) {

            GBox2D.client.DemoClientEngine.superclass.createNodeFromDescription.call(this, nodeDesc);

        }


    };

    GBox2D.extend(GBox2D.client.DemoClientEngine, GBox2D.client.GBClientEngine, null);
})();