
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
      title: 'GBox2DJS Demo',
       vars: {
           message: "Welcome " + req.session.passport.user + "!",
           navbar: 'GBox2DJS Demo'
       }
  })
};


exports.login = function(req,res){
    res.render('login', {
        title: 'GBox2DJS Demo',
        vars: {
            message: '',
            navbar: 'GBox2DJS Demo'
        }
    });
};