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

(function(){

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.client.GBClientNet = function(aDelegate) {
        this.serverUpdateBuffer = [];
        this.delegate = aDelegate;
        this.firstUpdate = true;
    };

    GBox2D.client.GBClientNet.prototype = {
        delegate : null,
        socket : null,
        serverUpdateBuffer : [],
        firstUpdate : null,
        getInstance : function(aDelegate) {
            if(g_gbclientinstance == null) {
                g_gbclientinstance = new GBox2D.client.GBClientNet(aDelegate);
                g_gbclientinstance.init();
            }

            return g_gbclientinstance;
        },
        init : function() {

            this.socket = io.connect('http://192.168.1.125:3000');

            this.socket.on('connect', function() { console.log('connected!')});

            this.socket.on('update', this.serverUpdate);

        },
        serverUpdate : function(data) {

            if(GBox2D.client.GBClientNet.prototype.getInstance().firstUpdate == true)
            {
                var worldDescription = JSON.parse(data);

                GBox2D.client.GBClientNet.prototype.getInstance().delegate.gameClock = worldDescription.gameClock;

                console.log('setting world clock: ' + GBox2D.client.GBClientNet.prototype.getInstance().delegate.gameClock + ' from: ' + worldDescription.gameClock);

                GBox2D.client.GBClientNet.prototype.getInstance().firstUpdate = false;

            }

            if(GBox2D.client.GBClientNet.prototype.getInstance().firstUpdate == false)
            {

                //cc.log("caught! : " + data);
                var worldDescription = JSON.parse(data);

                //console.log("game clock: " + worldDescription.gameClock +
                //            " game tick: " + worldDescription.gameTick);

                GBox2D.client.GBClientNet.prototype.getInstance().serverUpdateBuffer.push(worldDescription);

                /*
                 this.updates = JSON.parse(data);
                 var dat = JSON.parse(this.updates.data);
                 for(var node in dat) {
                 console.log("body " + dat[node].nodeid + ": x = " + dat[node].x + " y = " + dat[node].y);
                 };
                 */

                console.log('push it!');

            }

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
        },
        setDelegate : function(aDelegate) {
            this.delegate = aDelegate;
        }
    };
})();