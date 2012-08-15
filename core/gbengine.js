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

var g_gbengineinstance = null;

(function(){

    /**
     implmenting the gbengine class, a singleton to handle management of the box2d world, compile movements of box2d bodies, register and fire a custom contact listener and remove bodies from a queue

     */
    GBox2D.GBEngine = function() {
        this.init();
        this.setupNetwork();
        this.setupCmdMap();
    };

    GBox2D.GBEngine.prototype = {
        // Properties
        gameClockReal  			: 0,											// Actual time via "new Date().getTime();"
        gameClock				: 0,											// Seconds since start
        gameTick				: 0,											// Ticks since start
        isRunning				: true,
        speedFactor				: 1,											// Used to create Framerate Independent Motion (FRIM) - 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
        intervalGameTick		: null,											// Setinterval for gametick
        intervalFramerate		: 60,											// Try to call our tick function this often, intervalFramerate, is used to determin how often to call settimeout - we can set to lower numbers for slower computers
        intervalTargetDelta		: NaN,	// this.targetDelta, milliseconds between frames. Normally it is 16ms or 60FPS. The framerate the game is designed against - used to create framerate independent motion
        gameDuration			: Number.MAX_VALUE,								// Gameduration

        netChannel				: null,											// ServerNetChannel / ClientNetChannel determined by subclass
        fieldController			: null,											// FieldController
        cmdMap: {},

        /**
         * Function to setup networking (instantiate client or server net)
         */
        setupNetwork : function() { },

        /**
         * Function to setup common command map if needed
         */
        setupCmdMap : function() { },

        /**
         initialize a new instance of the engine
         */
        init : function() {
            this.receiver = null;


        },

        /**
         * Start the engine and schedule updates
         * @return {*}
         */
        start : function() {
            var that = this;
            this.gameClockReal = new Date().getTime();
            this.intervalTargetDelta = Math.floor( 1000/this.intervalFramerate );
            this.intervalGameTick = setInterval( function(){ that.update() }, this.intervalTargetDelta);
        },

        /**
         @return the singleton instance of gbengine
         */
        getInstance : function() {
            if(g_gbengineinstance == null) {
                g_gbengineinstance = new GBox2D.GBEngine();
            }
            return g_gbengineinstance;
        },

        /**
         this method will be scheduled to be called at the frame rate interval
         */
        update : function() {
            // Store previous time and update current
            var oldTime = this.gameClockReal;
            this.gameClockReal = new Date().getTime();

            // Our clock is zero based, so if for example it says 10,000 - that means the game started 10 seconds ago
            var delta = this.gameClockReal - oldTime;
            this.gameClock += delta;
            this.gameTick++;

            // Framerate Independent Motion -
            // 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
            this.speedFactor = delta / ( this.intervalTargetDelta );
            if (this.speedFactor <= 0) this.speedFactor = 1;
        },

        /**
         * Stop the game tick
         */
        stopGameClock: function()
        {
            clearInterval( GBox2D.GBEngine.prototype.intervalGameTick  );
            clearTimeout( GBox2D.GBEngine.prototype.intervalGameTick  );
        },

        setGameDuration: function() {},

        // Memory
        dealloc: function() {
            if( this.netChannel ) this.netChannel.dealloc();
            this.netChannel = null;

            clearInterval( this.intervalGameTick );
        },

        ///// Accessors
        getGameClock: function() { return this.gameClock; },
        getGameTick: function() { return this.gameTick; }
    };
})();