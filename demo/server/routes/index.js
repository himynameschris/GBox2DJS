
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'GBox2DJS Demo', message: '', navbar: 'GBox2DJS Demo' })
};