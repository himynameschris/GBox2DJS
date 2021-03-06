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
var Box2D = require('./../lib/cocos2d-html5/box2d/box2d.js');

(function(){

    /**
     * A Box2D contact listener
     * @class Creates a new Box2D contact listener
     */
    GBox2D.core.GBContactListener = function() {
        this._contactListener = new Box2D.Dynamics.b2ContactListener();
        this._contactListener.BeginContact = this.BeginContact;
        this._contactListener.EndContact = this.EndContact;
        this._contactListener.PreSolve = this.PreSolve;
        this._contactListener.PostSolve = this.PostSolve;
        this._contactListener.notifyObjects = this.notifyObjects;
    };

    GBox2D.core.GBContactListener.prototype = {
        _contactListener : null,
        /**
         * This will notify the objects contained in 'contact' of the contact type, if they
         * have registered with the contactregistry
         */
        notifyObjects : function (contact, contactType) {

            var nodeA = contact.GetFixtureA().GetBody().GetUserData();
            var nodeB = contact.GetFixtureB().GetBody().GetUserData();

            var gbcontactA = new GBox2D.core.GBContact(nodeA, contact.GetFixtureA(),
                nodeB, contact.GetFixtureB(), contact, contactType);
            var gbcontactB = new GBox2D.core.GBContact(nodeB, contact.GetFixtureB(),
                nodeA, contact.GetFixtureA(), contact, contactType);

            if(nodeA != null && nodeB != null) {

               var nodeAstr1 = '' + contactType + 'ContactWith' + nodeB.nodeType;
               var nodeAstr2 = '' + contactType + 'ContactWithObject';

               var nodeBstr1 = '' + contactType + 'ContactWith' + nodeA.nodeType;
               var nodeBstr2 = '' + contactType + 'ContactWithObject';

               if(nodeA[nodeAstr1] !== undefined ) nodeA[nodeAstr1](gbcontactA);
               if(nodeA[nodeAstr2] !== undefined ) nodeA[nodeAstr2](gbcontactA);

               if(nodeB[nodeBstr1] !== undefined ) nodeB[nodeBstr1](gbcontactB);
               if(nodeB[nodeBstr2] !== undefined ) nodeB[nodeBstr2](gbcontactB);

            }

        },
        /**
         * The callback used by Box2D at the beginning of a collision
         */
        BeginContact : function (contact) {
            this.notifyObjects(contact, "begin");
        },
        /**
         * The callback used by Box2D at the end of a collision
         */
        EndContact : function (contact) {
            this.notifyObjects(contact, "end");
        },
        /**
         * The callback used by Box2D before a collision
         */
        PreSolve : function (contact, manifold) {
            this.notifyObjects(contact, "pre");
        },
        /**
         * The callback used by Box2D after a collision
         */
        PostSolve : function (contact, manifold) {
            this.notifyObjects(contact, "post");
        }
    }

})();
