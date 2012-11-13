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

(function() {

    /**
     * A class to hold contact info
     * @class Creates a new contact with the given info
     * @param ownNode the main node in the collision
     * @param ownFixture the fixture that collided on the main node
     * @param otherNode the other node in the collision
     * @param otherFixture the fixture on the other node that collided
     * @param contact the original contact
     * @param contactType the type of the contact
     */
    GBox2D.core.GBContact = function(ownNode, ownFixture, otherNode, otherFixture, contact, contactType) {
        this.ownNode = ownNode;
        this.ownFixture = ownFixture;
        this.otherNode = otherNode;
        this.otherFixture = otherFixture;
        this.contact = contact;
        this.contactType = contactType;
    }

    GBox2D.core.GBContact.prototype = {
        ownNode : null,
        ownFixture : null,
        otherNode : null,
        otherFixture : null,
        contact : null,
        contactType : null
    }

})();