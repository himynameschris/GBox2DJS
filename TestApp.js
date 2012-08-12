/**
 * Created with JetBrains WebStorm.
 * User: Chris
 * Date: 8/3/12
 * Time: 7:21 PM
 */
require('./core/GBox2D.js');
require('./server/GBServerNet.js');
require('./core/GBEngine.js');
require('./core/GBNode.js');

var server = GBox2D.GBServerNet.prototype.getInstance();

var engine = GBox2D.GBEngine.prototype.getInstance();

var sendUpdate = function(data) {

    //console.log("updating! data: " + data);
    server.sockets.emit('update', data);

};

engine.registerReceiver(sendUpdate);
