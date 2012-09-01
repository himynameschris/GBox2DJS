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
var Box2D = require('./../lib/cocos2d-html5/box2d/box2d.js');

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

var g_demoserverengineinstance = null;

(function(){

    /**
     implementing the gbengine class, a singleton to handle management of the box2d world, compile movements of box2d bodies, register and fire a custom contact listener and remove bodies from a queue

     */
    GBox2D.server.DemoServerEngine = function() {
        this.init();

    };

    GBox2D.server.DemoServerEngine.prototype = {

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
            GBox2D.server.DemoServerEngine.superclass.init.call(this);


        },

        /**
         * Creates the Box2D world with 4 walls around the edges
         */
        createBox2dWorld: function() {

            var m_world = new b2World(new b2Vec2(0, -10), true);
            m_world.SetWarmStarting(true);


            // Create border of boxes
            var wall = new b2PolygonShape();
            var wallBd = new b2BodyDef();

            var width = GBox2D.constants.GBEngine.GAME_WIDTH;
            var height = GBox2D.constants.GBEngine.GAME_HEIGHT;

            // Left
            wallBd.position.Set(-1.5, height/2);
            wall.SetAsBox(1, height*10);
            this._wallLeft = m_world.CreateBody(wallBd);
            this._wallLeft.CreateFixture2(wall);
            // Right
            wallBd.position.Set(width + 0.55, height/2);
            wall.SetAsBox(1, height*10);
            this._wallRight = m_world.CreateBody(wallBd);
            this._wallRight.CreateFixture2(wall);
            // BOTTOM
            wallBd.position.Set(width/2, height+0.55);
            wall.SetAsBox(width/2, 1);
            this._wallTop = m_world.CreateBody(wallBd);
            this._wallTop.CreateFixture2(wall);
            // TOP
            wallBd.position.Set(width/2, 1);
            wall.SetAsBox(width/2, 1);
            this._wallBottom = m_world.CreateBody(wallBd);
            this._wallBottom.CreateFixture2(wall);


            this._world = m_world;
        },

        /**
         @return the singleton instance of gbengine
         */
        getInstance : function() {
            if(g_demoserverengineinstance == null) {
                g_demoserverengineinstance = new GBox2D.server.DemoServerEngine();
            }
            return g_demoserverengineinstance;
        },

        /**
         this method will be scheduled to be called at the frame rate interval
         in the server, it will be responsible for stepping the physics world and pushing the world states
         */
        update : function() {

            GBox2D.server.DemoServerEngine.superclass.update.call(this);

            if(this.gameTick % 30 == 0)
            {
                this.resetRandomBody();
            }

        },
        step: function( delta ) {

            GBox2D.server.DemoServerEngine.superclass.step.call(this, delta);

        },
        /**
         * Resets an entity and drops it from the sky
         */
        resetRandomBody: function() {
            // Retrieve a random key, and use it to retreive an entity
            var allEntities = this.nodeController.getNodes();
            var randomKeyIndex = Math.floor(Math.random() * allEntities._keys.length);
            var entity = allEntities.objectForKey( allEntities._keys[randomKeyIndex] );

            var x = Math.random() * 640 + 1;
            var y = Math.random() * 320 + 200;
            entity.box2dBody.SetPosition( new b2Vec2( x / 32, y / 32 ) );
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

            // Create the node for it
            var aBox2DEntity = new GBox2D.server.GBServerNode( this.getNextEntityID(), 0 );
            aBox2DEntity.setBody( body );
            aBox2DEntity.nodeType = 2;


            this.nodeController.addNode( aBox2DEntity );

            return body;
        }

    };

    GBox2D.extend(GBox2D.server.DemoServerEngine, GBox2D.server.GBServerEngine, null);
})();