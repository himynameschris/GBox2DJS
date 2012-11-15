
module.exports = {

    index : function(req, res){

        var gameTable = [];

        var i = 0;

        req.server.games.forEach( function(key, game){
            gameTable[i] = game;
            i++;
        }, this );

        GBox2D.constants.findById(req.session.passport.user, function(v1, v2) {
            console.log("v1: " + v1 + " v2: " + v2);
            res.render('index', {
                title: 'GBox2DJS Demo',
                vars: {
                    message: 'Welcome ' + v2.username + "!",
                    navbar: 'GBox2DJS Demo',
                    serverGames: gameTable
                }
            });
        });
    },

    indexRedirect : function(req, res) {

        res.redirect("/");

    },

    login : function(req,res){
        res.render('login', {
            title: 'GBox2DJS Demo',
            vars: {
                message: '',
                navbar: 'GBox2DJS Demo'
            }
        });
    },

    game : function(req,res){

        res.render('game', {
            title: 'GBox2DJS Demo',
            vars: {
                message: '',
                navbar: 'GBox2DJS Demo',
                gameID: req.gameEngine.gameID
            }
        })

    }

};