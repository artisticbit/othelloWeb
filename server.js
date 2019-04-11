var express = require('express');
var app = express();
var router = require('./router/main') (app);



var io = require('socket.io').listen(app.listen(3001));
var io_omok = require('socket.io').listen(app.listen(3002));
var io_test = require('socket.io').listen(app.listen(3003));
var io_paint = require('socket.io').listen(app.listen(3004));
var io_ball = require('socket.io').listen(app.listen(3005));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//////////////////////////////////////////////////////////
//othello
require('./othello.js')(io);

//omok
require('./omok.js')(io_omok);
//
require('./test.js')(io_test);
//test
//
require('./paint.js')(io_paint);
//
//
require('./ball.js')(io_ball);
//
//////////////////////////////////////////////////////////
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})

app.use(express.static('public'));
