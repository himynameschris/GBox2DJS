/**
 * Created with JetBrains WebStorm.
 * User: Chris
 * Date: 8/3/12
 * Time: 7:21 PM
 */
var express = require('express'),
    server = express(),
    app = server.listen(3000),
    io = require('socket.io');

var sockets = io.listen(app);

server.use('/', express.static(__dirname + '/') );

server.get('/', function(req,res){
    res.sendfile('index.html');

    console.log('Sent index.html');
});

server.get('/api/hello', function(req,res){
    res.send('Hello World');
});

sockets.on('connection', function (socket) {
    socket.broadcast.emit('broadcast: user connected!');
    console.log('log: user connected');
});

require('./core/gbox2d.js');
require('./core/gbengine.js');
require('./core/gbnode.js');

var engine = GBox2D.GBEngine.prototype.getInstance();

var sendUpdate = function(data) {

    console.log("updating! data: " + data);
    sockets.sockets.emit('update', data);

};

engine.registerReceiver(sendUpdate);
