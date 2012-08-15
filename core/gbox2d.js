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
GBox2D = (typeof GBox2D === 'undefined') ? {} : GBox2D;

/**
 * Allows a package to create a namespace within GBox2D
 * From Javascript Patterns book
 * @param ns_string
 */
GBox2D.namespace = function(ns_string)
{
    var parts = ns_string.split('.'),
        parent = GBox2D,
        i = 0;

    // strip redundant leading global
    if (parts[0] === "GBox2D") {
        parts = parts.slice(1);
    }

    var len = parts.length,
        aPackage = null;
    for (i = 0; i < len; i += 1) {
        var singlePart = parts[i];
        // create a property if it doesn't exist
        if (typeof parent[singlePart] === "undefined") {
            parent[singlePart] = {};
        }
        parent = parent[singlePart];

    }
    return parent;
};

/**
 * Allows a simple inheritance model
 * based on http://www.kevs3d.co.uk/dev/canvask3d/scripts/mathlib.js
 */
GBox2D.extend = function(subc, superc, overrides)
{
    /**
     * @constructor
     */
    var F = function() {};
    var i;

    if (overrides) {
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor)   {
            superc.prototype.constructor = superc;
        }
        for (i in overrides) {
            if (overrides.hasOwnProperty(i)) {
                subc.prototype[i] = overrides[i];
            }
        }
    } else {

        subc.prototype.constructor = subc;
        subc.superclass= superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor)   {
            superc.prototype.constructor = superc;
        }
        for( i in superc.prototype ) {
            if ( false==subc.prototype.hasOwnProperty(i)) {
                subc.prototype[i]= superc.prototype[i];
            }
        }

    }
};