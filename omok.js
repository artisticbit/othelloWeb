


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
      if(roomLength==1){
          data={"userColor":1};
          socket.emit("roomEnter",data);
      }
      else if(roomLength==2){
          data={"userColor":2};
          socket.emit("roomEnter",data);

      //game start send firstTurn;
          //create new board;
          listBoard.set(msg,createBoard());
          let currentBoard=listBoard.get(msg);


          data={"currentTurn":firstTurn,
                "board":listBoard.get(msg)};

          io.to(msg).emit("gameStart",data);
      }
      else {
          data={"userColor":0};
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

        let currentBoard=listBoard.get(data.roomName);

        let posIndex=data.pos.x+data.pos.y*15;
        currentBoard[posIndex]=data.dropColor;
        console.log(currentBoard);

        let nextTurnColor=data.dropColor==1?2:1;

        //listBoard.set(data.roomName,currentBoard);

        console.log("currentTurn::"+nextTurnColor);

        nextData={"board":currentBoard,
                  "currentTurn":nextTurnColor};

        io.to(data.roomName).emit('dropStone',nextData);
        //console.log("dropStone"+"x :"+data.pos.x+" y: "+data.pos.y);
        //종료판정
        var checkFlag = checkLine(currentBoard,data.pos,data.dropColor);
    });


    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
  });

  return io;
}

var firstTurn=1;
var listBoard=new Map();




////////////////////////gameManage//////////////////////////////////

  function createBoard(roomName){
    var board=new Array();
    for(var i=0; i<15*15; i++){
      board[i]=0;
    }
    return board;
  }

  function checkLine(currentBoard,dropPos,currentTurn){

    for(let i=0; i<8; i++ ){
      var currentX=dropPos.x;
      var currentY=dropPos.y;
        switch(i){
          case 0:
            currentX++;
            break;
          case 1:
            currentX--;
            break;
          case 2:
            currentY++;
            break;
          case 3:
            currentY--;
              break;
          case 4:
            currentX++;
            currentY++;
              break;
          case 5:
            currentX--;
            currentY--;
              break;
          case 6:
            currentX++;
            currentY--;
              break;
          case 7:
            currentX--;
            currentY--;
              break;
        }

        
    }

  }

//////////////////testCode
  //searchDropablePos(createBoard(),1);
  //dropStoneBoard(createBoard(),{"x":2,"y":4},1);
