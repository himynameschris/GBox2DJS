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

/**
 *
 * @private
 */
var Box2D = require('./../../lib/cocos2d-html5/box2d/box2d.js');

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

    /**
     * Creates a new engine
     * @class Represents the base server game engine
     * @extends GBox2D.core.GBEngine
     * @param connection the socket connection to be used
     */
    GBox2D.server.GBServerEngine = function(connection) {
        this.init(connection);

    };

    GBox2D.server.GBServerEngine.prototype = {
        // Properties
        _world  : null,
        _contactListener : null,
        _velocityIterationsPerSecond    : 100,
        _positionIterationsPerSecond	: 300,
        nextEntityID			: -1,
        _nodeFactory : null,

        /**
         * Function to setup networking (instantiate client or server net)
         * @param connection the socket connection to be used
         */
        setupNetwork : function(connection) {
            this.netChannel = new GBox2D.server.GBServerNet(this, connection);
        },

        /**
         * Function to setup common command map if needed
         */
        setupCmdMap : function() { },

        /**
         * Initializes a new instance of the engine
         * @param connection the socket connection to be used
         */
        init : function(connection) {
            this.setupNetwork(connection);

            this.nodeController = new GBox2D.core.GBNodeController();

        },

        /**
         * Update at the desired frame rate
         */
        update : function() {
            var delta = 16 / 1000;
            this.step( delta );

            GBox2D.server.GBServerEngine.superclass.update.call(this);

            var graveyard = [];

            // Allow all entities to update their position
            this.nodeController.getNodes().forEach( function(key, node){
                if(node.shouldDelete == true) {
                    graveyard.push(node);
                } else {
                    node.updatePosition();
                }

            }, this );

            for (var node in graveyard) {
                var body = graveyard[node].box2dBody;
                this._world.DestroyBody(body);
                this.nodeController.removeNode(graveyard[node].nodeid);
            }

            var worldDescription = new GBox2D.core.GBWorldNodeDescription(this, this.nodeController.getNodes());
            worldDescription.createDescription();

            this.netChannel.update(this.gameClock, worldDescription);

            if( this.gameClock > this.gameDuration ) {
                this.stopGameClock();
            }

        },

        /**
         * Step the physics or object world, should be overridden
         * @param delta the change in world time
         */
        step: function( delta ) {
            //step the world

            //var delta = (typeof delta == "undefined") ? 1/this._fps : delta;

        },
        /**
         Method to handle the adding of a player, should be overrode
         @param client the client being added
         */
        addPlayerNode : function (client) {

        },

        ///// Accessors
        /**
         Method to get the next ID to assign to an entity
         */
        getNextEntityID: function() {
            return ++this.nextEntityID;
        }
    };

    GBox2D.extend(GBox2D.server.GBServerEngine, GBox2D.core.GBEngine, null);
})();