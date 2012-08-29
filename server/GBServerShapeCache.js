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

var g_gbservershapecacheinstance = null;

var fs = require('fs'),
    xml2js = require('xml2js');

(function(){

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.server.GBServerShapeCache = function() {

    };

    GBox2D.server.GBServerShapeCache.prototype = {
        cache : null,
        start : false,
        cb : null,
        getInstance : function() {
            if (g_gbservershapecacheinstance == null)
            {
                g_gbservershapecacheinstance = new GBox2D.server.GBServerShapeCache();
                g_gbservershapecacheinstance.init();
            }

            return g_gbservershapecacheinstance;
        },
        init : function() {

            this.parser = new xml2js.Parser();

            this.parser.addListener('end', this.doneParsing);

        },

        loadFromFile : function(filename, instance, cb) {
            if (cb !== 'undefined') {
                instance.start = true;
                instance.cb = cb;
                console.log('start set');
            }

            fs.readFile(__dirname + '/' + filename + '.plist', function(err, data) {
                console.log(data);
                instance.parser.parseString(data);
            });

        },

        doneParsing : function(result) {
            console.dir(result);
            console.log('Done.');

            if (g_gbservershapecacheinstance.start) {
                g_gbservershapecacheinstance.cb();
            }
        }
    }
})();