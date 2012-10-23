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
require('../lib/SortedLookupTable.js');
require('../lib/Point.js');
require('../core/GBox2D.js');
require('../core/GBConstants.js');
require('../core/GBNodeController.js');
require('../core/GBEngine.js');
require('../core/server/GBServerNet.js');
require('../core/server/GBServerClient.js');
require('../core/GBContactListener.js');
require('../core/server/GBServerEngine.js');
require('./server/DemoServerEngine.js');
require('../core/GBNode.js');
require('../core/server/GBServerNode.js');
require('./server/DemoServerNode.js');
require('../core/GBNodeFactory.js');
require('./server/DemoServerNodeFactory.js');
require('../core/GBWorldNodeDescription.js');
require('../core/server/GBServerShapeCache.js');

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

var engine = new GBox2D.server.DemoServerEngine();

var shapeCache = GBox2D.server.GBServerShapeCache.prototype.getInstance();
shapeCache.setResourceDir(__dirname + "/server/res/");
shapeCache.loadFromFile("shapes", shapeCache, doneLoading);

function doneLoading() {
    engine.start();

    console.log('engine started');

    for(var i = 0; i < 50 ; i ++) {
        var x = (640/2) + Math.sin(i/5);
        var y = i * -1*3;

        // Make a square
        engine._nodeFactory.createBox(x / 32, y / 32, 0, .5);
    }
}


