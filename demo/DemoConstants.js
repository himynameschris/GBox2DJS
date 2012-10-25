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

    GBox2D.namespace("GBox2D.Demo");
    GBox2D.namespace("GBox2D.Demo.server");
    GBox2D.namespace("GBox2D.Demo.client");
    GBox2D.namespace("GBox2D.Demo.constants");

    GBox2D.Demo.constants.Engine = {
        PHYSICS_SCALE			: 32,
        GAME_WIDTH				: 800,
        GAME_HEIGHT				: 450,

        ENTITY_TYPES: {

        }


    }

    GBox2D.Demo.constants.ServerNet = {

        VIEW_PATH : "D:/workspace/GBox2DJS/demo/server/views",
        ROUTE_PATH : "../../demo/server/routes" // should be relative to the GBServerNet unless you override

    }


})();