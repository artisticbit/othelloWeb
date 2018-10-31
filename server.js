var express = require('express');
var app = express();
var router = require('./router/main') (app);

var io = require('socket.io').listen(app.listen(3001));



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//////////////////////////////////////////////////////////
var firstTurn="black";
var listBoard=new Map();


io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('roomEnter', (msg) => {
    //msg is roomName;
    socket.join(msg);
    var room = io.sockets.adapter.rooms[msg];
    console.log("room test :: "+room);
    var roomLength = room.length;

    var data;
    if(roomLength==1){
        data={"userColor":"white"};
        socket.emit("roomEnter",data);
    }
    else if(roomLength==2){
        data={"userColor":"black"};
        socket.emit("roomEnter",data);

    //game start send firstTurn;
        //create new board;
        listBoard.set(msg,createBoard());

        data={"currentTurn":firstTurn};
        io.to(msg).emit("gameStart",data);
    }
    else {
        data={"userColor":"none"};
        socket.emit("roomEnter",data);
    }


    console.log("user enter room :: "+msg);
    console.log("room users Num : "+  roomLength);

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

////////////////////////gameManage//////////////////////////////////

  function createBoard(roomName){
    var board=[0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,
               0,0,0,1,2,0,0,0,
               0,0,0,2,1,0,0,0,
               0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0];
    return board;

  }

  fuction searchDropablePos(board){
    for(var i=0; i<64; i++){


    }

  }
  fuction dropStoneBoard(board,pos,dropColor){

  }

  fuction checkFullDirection(board,pos,direction,dropStoneColor){
    var index=0;
    var flag=false;
    var currentPos=pos;
    var returnData={"flag":false,"indexArr":[]};
    while(true){
      switch (direction) {
        case 0:
          currentPos.x=currentPos.x+1;
          break;
        case 1:
          currentPos.x=currentPos.x-1;
          break;
        case 2:
          currentPos.y=currentPos.y+1;
          break;
        case 3:
          currentPos.y=currentPos.y-1;
          break;
        case 4:
          currentPos.x=currentPos.x+1;
          currentPos.y=currentPos.y+1;
          break;
        case 5:
          currentPos.x=currentPos.x-1;
          currentPos.y=currentPos.y-1;
          break;
        case 6:
          currentPos.x=currentPos.x+1;
          currentPos.y=currentPos.y-1;
          break;
        case 7:
          currentPos.x=currentPos.x-1;
          currentPos.y=currentPos.y+1;
          break;
      }

      index=currentPos.x+currentPos.y*8;
      var currentStoneColor=board[index];

      if(flag==false){ //before find diff color

          if(currentStoneColor==0 || currentStoneColor==dropStoneColor){
            // disable dropPos
            returnData.flag=false;
            return returnData;
          }
          else{
            //index push return array

            //continu search next pos
            flag=true;
          }

      }

      else{
          if(currentStoneColor==0){
            returnData.flag=false;
            return returnData;
          }
          if(currentStoneColor!=dropStoneColor){
            //index push retur array
            returnData.indexArr.push(index);
          }
          else{
            returnData.flag=true;
            return returnData;
          }
      }


    }

  }
//////////////////////////////////////////////////////////
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})

app.use(express.static('public'));
