/**
 * Created with JetBrains WebStorm.
 * User: Chris
 * Date: 8/12/12
 * Time: 5:35 PM
 */

var g_gbserverinstance = null;

(function(){

    GBox2D.namespace("GBox2D.GBServerNet");

    /**
     implmenting the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.GBServerNet = function() {

    };

    GBox2D.GBServerNet.prototype = {
        server : null,
        express : null,
        app : null,
        io : null,
        sockets : null,
        getInstance : function() {
            if (g_gbserverinstance == null)
            {
                g_gbserverinstance = new GBox2D.GBServerNet();
                g_gbserverinstance.init();

            }

            return g_gbserverinstance;
        },
        init : function() {
            this.express = require('express'),
                this.server = this.express(),
                this.app = this.server.listen(3000),
                this.io = require('socket.io');

            this.sockets = this.io.listen(this.app);

            this.server.use('/', this.express.static(__dirname + '/../') );

            this.server.get('/api/hello', function(req,res){
                res.send('Hello World');
            });

            this.sockets.on('connection', function (socket) {
                socket.broadcast.emit('broadcast: user connected!');
                console.log('log: user connected');
            });
        }
    }

})();