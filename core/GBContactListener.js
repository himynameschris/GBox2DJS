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
        /*
         * this will notify the objects contained in 'contact' of the contact type, if they
         * have registered with the contactregistry
         */
        notifyObjects : function (contact, contactType) {
            //TODO: implement contact methods

        },

        BeginContact : function (contact) {
            console.log('BeginContact');
        },

        EndContact : function (contact) {
            console.log('EndContact');
        },

        PreSolve : function (contact, manifold) {
            console.log('PreSolve');
        },

        PostSolve : function (contact, manifold) {
            console.log('PostSolve');
        }
    }

})();
