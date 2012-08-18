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
var Box2D = require('./../lib/box2d/box2d.js');

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

var g_gbserverengineinstance = null;

(function(){

    /**
     implmenting the gbengine class, a singleton to handle management of the box2d world, compile movements of box2d bodies, register and fire a custom contact listener and remove bodies from a queue

     */
    GBox2D.server.GBServerEngine = function() {
        this.init();

    };

    GBox2D.server.GBServerEngine.prototype = {
        _world  : null,
        _velocityIterationsPerSecond    : 100,
        _positionIterationsPerSecond	: 300,
        nextEntityID			: 0,

        // Properties
        /**
         * Function to setup networking (instantiate client or server net)
         */
        setupNetwork : function() {
            this.netChannel = GBox2D.server.GBServerNet.prototype.getInstance();
        },

        /**
         * Function to setup common command map if needed
         */
        setupCmdMap : function() { },

        /**
         initialize a new instance of the engine
         */
        init : function() {
            GBox2D.server.GBServerEngine.superclass.init.call(this);

            var doSleep = true;

            this.createBox2dWorld();


        },

        /**
         * Creates the Box2D world with 4 walls around the edges
         */
        createBox2dWorld: function() {
            var m_world = new b2World(new b2Vec2(0, -10), true);
            m_world.SetWarmStarting(true);

            /*
            // Create border of boxes
            var wall = new b2PolygonShape();
            var wallBd = new b2BodyDef();

            // Left
            wallBd.position.Set(-1.5, GBox2D.Constants.GAME_HEIGHT/2);
            wall.SetAsBox(1, GBox2D.Constants.GAME_HEIGHT*10);
            this._wallLeft = m_world.CreateBody(wallBd);
            this._wallLeft.CreateFixture2(wall);
            // Right
            wallBd.position.Set(GBox2D.Constants.GAME_WIDTH + 0.55, GBox2D.Constants.GAME_HEIGHT/2);
            wall.SetAsBox(1, GBox2D.Constants.GAME_HEIGHT*10);
            this._wallRight = m_world.CreateBody(wallBd);
            this._wallRight.CreateFixture2(wall);
            // BOTTOM
            wallBd.position.Set(GBox2D.Constants.GAME_WIDTH/2, GBox2D.Constants.GAME_HEIGHT+0.55);
            wall.SetAsBox(GBox2D.Constants.GAME_WIDTH/2, 1);
            this._wallTop = m_world.CreateBody(wallBd);
            this._wallTop.CreateFixture2(wall);
            // TOP
            wallBd.position.Set(GBox2D.Constants.GAME_WIDTH/2, 1);
            wall.SetAsBox(GBox2D.Constants.GAME_WIDTH/2, 1);
            this._wallBottom = m_world.CreateBody(wallBd);
            this._wallBottom.CreateFixture2(wall);
            */

            this._world = m_world;
        },

        /**
         @return the singleton instance of gbengine
         */
        getInstance : function() {
            if(g_gbserverengineinstance == null) {
                g_gbserverengineinstance = new GBox2D.server.GBServerEngine();
            }
            return g_gbserverengineinstance;
        },

        /**
         this method will be scheduled to be called at the frame rate interval
         in the server, it will be responsible for stepping the physics world and pushing the world states
         */
        update : function() {
            var delta = 16 / 1000;
            this.step( delta );

            GBox2D.server.GBServerEngine.superclass.update.call(this);

            // Allow all entities to update their position
            this.nodeController.getNodes().forEach( function(key, node){
                node.updatePosition();
            }, this );

            var worldDescription = [];//= new GBox2D.core.GBWorldNodeDescription(this, this.nodeController.getNodes());

            this.nodeController.getNodes().forEach( function(key, node) {
                worldDescription.push(node.constructDescription(node));
            }, this );

            this.netChannel.sendUpdate(JSON.stringify(worldDescription));

            if( this.gameClock > this.gameDuration ) {
                this.stopGameClock();
            }

        },
        step: function( delta ) {
            //this._world.ClearForces();
            //var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
            this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
        },
        /**
         * Creates a Box2D circular body
         * @param {Number} x	Body position on X axis
         * @param {Number} y    Body position on Y axis
         * @param {Number} radius Body radius
         * @return {b2Body}	A Box2D body
         */
        createBall: function(x, y, radius) {
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = new b2CircleShape(radius);
            fixtureDef.friction = 0.4;
            fixtureDef.restitution = 0.6;
            fixtureDef.density = 1.0;

            var ballBd = new b2BodyDef();
            ballBd.type = b2Body.b2_dynamicBody;
            ballBd.position.Set(x,y);
            var body = this._world.CreateBody(ballBd);
            body.CreateFixture(fixtureDef);

            // Create the entity for it in
            var aBox2DEntity = new GBox2D.server.GBServerNode( this.getNextEntityID(), 0 );
            aBox2DEntity.setBody(body);
            aBox2DEntity.nodeType = 1;

            this.nodeController.addNode( aBox2DEntity );

            return body;
        },

        /**
         * Creates a Box2D square body
         * @param {Number} x	Body position on X axis
         * @param {Number} y    Body position on Y axis
         * @param {Number} rotation	Body rotation
         * @param {Number} size Body size
         * @return {b2Body}	A Box2D body
         */
        createBox: function(x, y, rotation, size) {
            var bodyDef = new b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(x, y);
            bodyDef.angle = rotation;

            var body = this._world.CreateBody(bodyDef);
            var shape = new b2PolygonShape.AsBox(size, size);
            var fixtureDef = new b2FixtureDef();
            fixtureDef.restitution = 0.1;
            fixtureDef.density = 1.0;
            fixtureDef.friction = 1.0;
            fixtureDef.shape = shape;
            body.CreateFixture(fixtureDef);

            // Create the entity for it in RealTimeMultiplayerNodeJS
            var aBox2DEntity = new GBox2D.server.GBServerNode( this.getNextEntityID(), 0 );
            aBox2DEntity.setBody( body );
            aBox2DEntity.nodeType = 2;


            this.nodeController.addNode( aBox2DEntity );

            return body;
        },
        ///// Accessors
        getNextEntityID: function() {
            return ++this.nextEntityID;
        }
    };

    GBox2D.extend(GBox2D.server.GBServerEngine, GBox2D.core.GBEngine, null);
})();