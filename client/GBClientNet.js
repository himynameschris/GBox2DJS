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

var g_gbclientinstance = null;

var g_socket = io.connect('http://localhost:3000');

(function(){

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.GBClientNet = function() {

    };

    GBox2D.GBClientNet.prototype = {
        socket : null,
        getInstance : function() {
            if(g_gbclientinstance == null) {
                g_gbclientinstance = new GBox2D.GBClientNet();
                g_gbclientinstance.init();
            }

            return g_gbclientinstance;
        },
        init : function() {

            g_socket.on('connect', function() { console.log('connected!')});

            g_socket.on('update', function(data) {
                    cc.log("caught! : " + data);
                    this.updates = JSON.parse(data);
                    for(var p = 0; p < this.updates.bodies.length; p++) {
                        console.log("body " + p + ": x = " + this.updates.bodies[p].x + " y = " + this.updates.bodies[p].y);
                    };
            });
        },
        update : function() {
        },
        ajax : function (url, ref, cb)
        {
            var xmlhttp;
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.open("GET",url,true);
            xmlhttp.send();

            xmlhttp.onreadystatechange=function()
            {
                cc.log(xmlhttp.responseText);
                ref[cb](xmlhttp.responseText);
            };
        }
    }
})();