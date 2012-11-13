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

(function(){
    /**
     * Creates a new Server
     * @class Represents the back end server
     */

    GBox2D.server.GBServer = function() {
        this.init();
        this.clients = new SortedLookupTable();

    };

    GBox2D.server.GBServer.prototype = {
        server : null,
        express : null,
        app : null,
        io : null,
        sockets : null,
        clients : null,
        viewPath : null,
        routePath : null,

        /**
         * Setup the nodejs server with express, passport and socket.io
         *
         */
        init : function () {

            var express = require('express'),
                http = require('http'),
                passport = require('passport'),
                LocalStrategy = require('passport-local').Strategy,
                server = express(),
                iolib = require('socket.io');


            var users = [
                { id: 1, username: 'test', password: 'secret2', email: 'test@x.com' },
                { id: 2, username: 'test2', password: 'secret2', email: 'test@x.com' },
                { id: 3, username: 'test3', password: 'secret2', email: 'test@x.com' }
            ];

            function findById(id, fn) {
                var idx = id - 1;
                if (users[idx]) {
                    fn(null, users[idx]);
                } else {
                    fn(new Error('User ' + id + ' does not exist'));
                }
            }

            function findByUsername(username, fn) {
                for (var i = 0, len = users.length; i < len; i++) {
                    var user = users[i];
                    if (user.username === username) {
                        return fn(null, user);
                    }
                }
                return fn(null, null);
            }

            function checkAuth(req,res,next){
                if(req.user) next();//Forward the request so it can be handled by your router
                else res.redirect('/login');//res.send(403);//send access denied
            }

            // Passport session setup.
            //   To support persistent login sessions, Passport needs to be able to
            //   serialize users into and deserialize users out of the session.  Typically,
            //   this will be as simple as storing the user ID when serializing, and finding
            //   the user by ID when deserializing.
            passport.serializeUser(function(user, done) {
                done(null, user.id);
            });

            passport.deserializeUser(function(id, done) {
                findById(id, function (err, user) {
                    done(err, user);
                });
            });

            // Use the LocalStrategy within Passport.
            //   Strategies in passport require a `verify` function, which accept
            //   credentials (in this case, a username and password), and invoke a callback
            //   with a user object.  In the real world, this would query a database;
            //   however, in this example we are using a baked-in set of users.
            passport.use(new LocalStrategy(
                function(username, password, done) {
                    // asynchronous verification, for effect...
                    process.nextTick(function () {

                        // Find the user by username.  If there is no user with the given
                        // username, or the password is not correct, set the user to `false` to
                        // indicate failure and set a flash message.  Otherwise, return the
                        // authenticated `user`.
                        findByUsername(username, function(err, user) {
                            if (err) { return done(err); }
                            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                            if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                            return done(null, user);
                        })
                    });
                }
            ));

            var viewPath = this.viewPath;
            server.configure(function() {
                server.set('views', viewPath);
                server.set('view engine', 'jade');
                server.set('view options', {layout: false});
                //server.use(express.logger());
                server.use(express.cookieParser());
                server.use(express.bodyParser());
                //server.use(express.session({secret:'keyboard cat'}));
                server.use(express.cookieSession({secret:"thesecret"}));

                // Initialize Passport!  Also use passport.session() middleware, to support
                // persistent login sessions (recommended).
                server.use(passport.initialize());
                server.use(passport.session());

                server.use(server.router);
                server.use(express.static(__dirname + '/public'));
                server.use('/', express.static(__dirname + '/../../') );
            });

            if(this.routePath != null) {
                this.routes = require(this.routePath);

                server.get('/login', this.routes.login);

                server.post('/login',
                    passport.authenticate('local', { successRedirect: '/',
                        failureRedirect: '/login'})
                );

                server.get('/', checkAuth, this.routes.index);

            }

            server.get('/api/hello', function(req,res){
                res.send('Hello World');
            });

            var app = http.createServer(server).listen(GBox2D.constants.GBServerNet.SERVER_PORT);

            var io = iolib.listen(app);
            io.set("log level", 0);



            var that = this;
            io.on('connection', function (client) {
                that.onSocketConnection(client);

                client.on('clientMessage', function (data) {
                    that.onReceiveMessage(client, data);
                });

                client.on('disconnect', function() {
                    that.onSocketClosed(client)
                });

            });

            this.express = express,
                this.server = server,
                this.iolib = iolib,
                this.io = io,
                this.passport = passport,
                this.http = http;

        },

        /**
         * Code to start the game engine from the server
         *
         */

        createEngine : function () {



        },

        /**
         * Handle socket.io connections
         * This should be overridden
         */
        onSocketConnection : function (clientConnection) {


        },
        /**
         * Handle socket.io connections
         * This should be overridden
         */
        onSocketClosed : function (clientConnection) {


        },
        /**
         * Handle socket.io receive message
         * This should be overridden
         */
        onReceiveMessage : function(clientConnection, data) {


        }

    }

})();