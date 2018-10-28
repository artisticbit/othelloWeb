var express = require('express');
var app = express();
var router = require('./router/main') (app);

var io = require('socket.io').listen(app.listen(3001));



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//////////////////////////////////////////////////////////

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('roomEnter', (msg) => {

    socket.join(msg);
    var room = io.sockets.adapter.rooms[msg];

    console.log("user enter room :: "+msg);
    console.log("room users Num : "+   room.length);

  });

  socket.on('chatMsg', (data) => {

    io.to(data.roomName).emit('chatMsg',data);
    console.log("roomName: "+data.roomName);
    console.log("nickName: "+data.nickName);
    console.log("chatMsg: "+data.msg);

  });

  socket.on('dropStone', (data) => {
      console.log("dropStone"+"x :"+data.pos.x+" y: "+data.pos.y);
  });

  socket.on('disconnect', () => {
  console.log('user disconnected');
  });
});
//////////////////////////////////////////////////////////
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})

app.use(express.static('public'));
