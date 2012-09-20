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

(function() {

    GBox2D.server.DemoServerNodeFactory = function(serverEngine) {
        this._serverEngine = serverEngine;
        this._world = serverEngine._world;
    };

    GBox2D.server.DemoServerNodeFactory.prototype = {
        _world : null,
        _serverEngine : null,
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
            var aBox2DEntity = new GBox2D.server.DemoServerNode( this._serverEngine.getNextEntityID(), 0 );
            aBox2DEntity.setBody(body);
            aBox2DEntity.nodeType = 1;

            this._serverEngine.nodeController.addNode( aBox2DEntity );

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
            var aBox2DEntity = new GBox2D.server.DemoServerNode( this._serverEngine.getNextEntityID(), 0 );
            aBox2DEntity.setBody( body );
            aBox2DEntity.nodeType = 2;


            this._serverEngine.nodeController.addNode( aBox2DEntity );

            return body;
        }

    }

    GBox2D.extend(GBox2D.server.DemoServerNodeFactory, GBox2D.core.GBNodeFactory);

})();