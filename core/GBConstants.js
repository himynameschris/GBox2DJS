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
     * GBox2D Constants
     * @class Holds GBox2D constants namespace
     */

    GBox2D.constants = function() {

    }

    GBox2D.namespace("GBox2D.constants");

    GBox2D.constants.GBEngine = {
        ENTITY_DEFAULT_RADIUS	: 8,
        ENTITY_BOX_SIZE			: 16,
        PHYSICS_SCALE			: 32,
        GAME_WIDTH				: 700,
        GAME_HEIGHT				: 450,
        MAX_OBJECTS				: 100,
        GAME_DURATION			: 1000*300,

        ENTITY_TYPES: {
            CIRCLE:			1 << 1,
            BOX:			1 << 2
        }
    }

    GBox2D.constants.GBClientNet = {
        MAX_UPDATES : 100

    }

    GBox2D.constants.GBServerNet = {
        SERVER_ADDRESS : "http://localhost",
        SERVER_PORT : 3000
    }

})();