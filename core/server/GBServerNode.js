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
     * Creates a new client node
     * @class Represents the base client node class
     * @extends GBox2D.core.GBNode
     * @param nodeid the id of the node
     * @param clientid the client id for clients
     */
    GBox2D.server.GBServerNode = function(nodeid, clientid) {
        this.nodeid = nodeid;
        this.clientid = clientid;
        //this.position = Point.prototype.ZERO;
        return this;
    };

    GBox2D.server.GBServerNode.prototype = {
        box2dBody   :   null,
        shouldDelete : false,

        /**
         * Update the position of the node based on the physics body
         */
        updatePosition : function() {
            var pos = this.box2dBody.GetPosition();
            this.x = pos.x * GBox2D.constants.GBEngine.PHYSICS_SCALE;
            this.y = pos.y * GBox2D.constants.GBEngine.PHYSICS_SCALE;

            this.rotation = this.box2dBody.GetAngle();

        },

        /**
         * Sets the physics body to be used by the node
         */
        setBody : function(body) {
            this.box2dBody = body;
            body.SetUserData(this);
        },

        /**
         * Sets collision mask bits to enable/disable collisions by object type
         */
        setCollisionMaskBits : function (bits) {

            var f = this.box2dBody.GetFixtureList();
            while(f != null) {
                var filter = f.GetFilterData();
                filter.maskBits = bits;
                f.SetFilterData(filter);

                f = f.GetNext();
            }



        },

        /**
         * Clean up the node's members on destruction
         */
        dealloc : function() {

            delete this.box2dBody;

        }


    };

    GBox2D.extend(GBox2D.server.GBServerNode, GBox2D.core.GBNode);

})();