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
var Box2D = require('./box2d.js');

// Shorthand "imports"
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2AABB = Box2D.Collision.b2AABB,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;
b2ContactListener = Box2D.Dynamics.b2ContactListener;

(function(){

    GBox2D.namespace("GBox2D.GBEngine");

    /**
     implmenting the gbengine class, a singleton to handle management of the box2d world, compile movements of box2d bodies, register and fire a custom contact listener and remove bodies from a queue

     */
    GBox2D.GBEngine = function() {
        this.init();
    };

    GBox2D.GBEngine.prototype = {

        hello: function() {
            console.log("hello!");
        },

        /**
         initialize a new instance of gbengine
         */
        init : function() {
            var doSleep = true;

            this.world = new b2World(
                new b2Vec2(0, 10) //gravity
                , doSleep //allow sleep
            );

            //TODO: set world contact listener

            this.updateschedule = setInterval(function () {
                GBox2D.GBEngine.prototype.getInstance().update();
            },1000/30);

            this.receiver = null;

            this.update();
        },

        instance : null,

        /**
         @return the singleton instance of gbengine
         */
        getInstance : function() {
            if(this.instance == null) {
                this.instance = new GBox2D.GBEngine();
            }
            return this.instance;
        },

        /**
         this method steps the box2d world and calls the method to compile body positions into a JSON string
         */
        update : function() {
            this.world.Step(
                1 / 30 //frame-rate
                , 8 //velocity iterations
                , 1 //position iterations
            );

            if(this.receiver != null) {
                console.log("updating receiver");
                this.receiver(this.compileJSON());
            }
        },

        /**
         allows a node.js module to register a function and the receiver of the JSON
         */
        registerReceiver : function(r) {
            this.receiver = r;
        },

        /**
         compiles the relevant data into a JSON string to send to clients, including:
         :body positions
         */
        compileJSON : function() {

            var updates = { "bodies":[]};

            for(var b = this.world.m_bodyList; b; b = b.m_next) {
                console.log("x:"+ b.GetPosition().x);
                updates.bodies[updates.bodies.length] = {"x":b.GetPosition().x, "y":b.GetPosition().y};
            };

            return JSON.stringify(updates);

        }
    };
})();