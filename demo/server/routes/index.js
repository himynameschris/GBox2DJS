
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'GBox2DJS Demo', vars: {message: 'A Simple Demo', navbar: 'GBox2DJS Demo' }})
};