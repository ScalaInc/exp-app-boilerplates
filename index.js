var connect = require('connect');
var serveStatic = require('serve-static');
connect()
.use('/node_modules', serveStatic(__dirname + '/node_modules'))
.use('/examples', serveStatic(__dirname + '/examples'))
.use(serveStatic(__dirname + '/player'))
.listen(3000, function(){
  console.log('listening on port 3000, visit http://localhost:3000/index.html');
});
