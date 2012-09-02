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

var g_gbcontactlistenerinstance = null;

(function() {
    GBox2D.core.GBContact = function(nodeA, nodeB, contact, contactType) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.contact = contact;
        this.contactType = contactType;
    }

    GBox2D.core.GBContact.prototype = {
        nodeA : null,
        nodeB : null,
        contact : null,
        contactType : null
    }

})();

(function(){

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.core.GBContactListener = function() {
        this._contactListener = new Box2D.Dynamics.b2ContactListener();
        this._contactListener.BeginContact = this.BeginContact;
        this._contactListener.EndContact = this.EndContact;
        this._contactListener.PreSolve = this.PreSolve;
        this._contactListener.PostSolve = this.PostSolve;
    };

    GBox2D.core.GBContactListener.prototype = {
        _contactListener : null,
        /**
         @return the singleton instance of GBContactListener
         */
        getInstance : function() {
            if(g_gbcontactlistenerinstance == null) {
                g_gbcontactlistenerinstance = new GBox2D.core.GBContactListener();
            }
            return g_gbcontactlistenerinstance;
        },
        /*
         * this will notify the objects contained in 'contact' of the contact type, if they
         * have registered with the contactregistry
         */
        notifyObjects : function (contact, contactType) {

            var nodeA = contact.GetFixtureA().GetBody().GetUserData();
            var nodeB = contact.GetFixtureB().GetBody().GetUserData();

            var gbcontact = new GBox2D.core.GBContact(nodeA, nodeB, contact, contactType);

            if(nodeA != null && nodeB != null) {

               var nodeAstr1 = '' + contactType + 'ContactWith' + nodeB.nodeType;
               var nodeAstr2 = '' + contactType + 'ContactWithObject';

               var nodeBstr1 = '' + contactType + 'ContactWith' + nodeB.nodeType;
               var nodeBstr2 = '' + contactType + 'ContactWithObject';

               if(nodeA[nodeAstr1] !== undefined ) nodeA[nodeAstr1](gbcontact);
               if(nodeA[nodeAstr2] !== undefined ) nodeA[nodeAstr2](gbcontact);

               if(nodeB[nodeBstr1] !== undefined ) nodeB[nodeBstr1](gbcontact);
               if(nodeB[nodeBstr2] !== undefined ) nodeB[nodeBstr2](gbcontact);

            }

        },

        BeginContact : function (contact) {
            GBox2D.core.GBContactListener.prototype.getInstance().notifyObjects(contact, "begin");
        },

        EndContact : function (contact) {
            GBox2D.core.GBContactListener.prototype.getInstance().notifyObjects(contact, "end");
        },

        PreSolve : function (contact, manifold) {
            GBox2D.core.GBContactListener.prototype.getInstance().notifyObjects(contact, "pre");
        },

        PostSolve : function (contact, manifold) {
            GBox2D.core.GBContactListener.prototype.getInstance().notifyObjects(contact, "post");
        }
    }

})();
