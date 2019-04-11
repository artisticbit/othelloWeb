
module.exports=function(io){

  io.on('connection', (socket) => {


    console.log('a user connected');


    socket.on('roomEnter', (msg) => {
      //msg is roomName;
      socket.join(msg);

      var room = io.sockets.adapter.rooms[msg];
      console.log("room test :: "+room);
      var roomLength = room.length;

      var data;


      console.log("user enter room :: "+msg);
      console.log("room users Num : "+  roomLength);

    });


    socket.on('chatMsg', (data) => {

      io.to(data.roomName).emit('chatMsg',data);
      console.log("roomName: "+data.roomName);
      console.log("nickName: "+data.nickName);
      console.log("chatMsg: "+data.msg);

    });


    socket.on('canvasData',(data)=>{

      //console.log(data.imageData);
      io.to(data.roomName).emit('canvasData',data);

    });


    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
  });


  ////test
  ///


  return io;


}

var firstTurn=1;
var listBoard=new Map();




////////////////////////gameManage//////////////////////////////////



//////////////////testCode
  //searchDropablePos(createBoard(),1);
  //dropStoneBoard(createBoard(),{"x":2,"y":4},1);
