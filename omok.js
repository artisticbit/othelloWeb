


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

        let doubleThreeFlag=false;

        let currentBoard=listBoard.get(data.roomName);

        let posIndex=data.pos.x+data.pos.y*15;
        currentBoard[posIndex]=data.dropColor;

        let nextTurnColor=data.dropColor==1?2:1;

        //33체크
        let threeFlag=checkThree(currentBoard,data.pos,data.dropColor);
         if(threeFlag){
           doubleThreeFlag=true;
           currentBoard[posIndex]=0;
           let nextTurnColor=data.dropColor==1?2:1;
         }
        //

        //listBoard.set(data.roomName,currentBoard);

        console.log("currentTurn::"+nextTurnColor);

        nextData={"board":currentBoard,
                  "currentTurn":nextTurnColor};

        io.to(data.roomName).emit('dropStone',nextData);
        //console.log("dropStone"+"x :"+data.pos.x+" y: "+data.pos.y);

        if(doubleThreeFlag){
          let message="쌍3ㄴㄴ"
          io.to(data.roomName).emit('doubleThree',{"message":message});
        }


        //종료판정
        var checkFlag = checkEnd(currentBoard,data.pos,data.dropColor);
        if(checkFlag){
          var endData={"winner":data.dropColor};
          io.to(data.roomName).emit('endGame',endData);
        }

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

  function checkEnd(currentBoard,dropPos,dropColor){

    for(let i=0; i<8; i=i+2){
      let sum=1;
      sum=sum+checkLine(currentBoard,dropPos,dropColor,i);
      sum=sum+checkLine(currentBoard,dropPos,dropColor,i+1);
      //console.log("current line sum::"+sum);
      if(sum>4){
        console.log("endGame");
        return true;
      }
    }

    }

  function checkLine(currentBoard,dropPos,dropColor,direction){
      let returnNum=0;
      let currentX=dropPos.x;
      let currentY=dropPos.y;
      let currentIndex=0;
      do{
        switch(direction){
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
            currentY++;
              break;
        }

        if(currentX>14 || currentX<0 || currentY>14 || currentY<0 ){
          break;
        }

        currentIndex=currentX+currentY*15;
        let currentColor=currentBoard[currentIndex];

        if(currentColor==dropColor){
          returnNum++;
        }else{
          break;
        }

      }while(true);

      return returnNum;
  }

  function checkThree(currentBoard,dropPos,dropColor){

    let lineCount=0;
    for(let i=0; i<8; i=i+2){
      let sum=1;
      let data1=checkThreeLine(currentBoard,dropPos,dropColor,i);
      let data2=checkThreeLine(currentBoard,dropPos,dropColor,i+1);
      sum=sum+data1.num+data2.num;
      console.log("33 line sum::"+sum);
      if(sum==3 && (data1.flag && data2.flag)){
        lineCount++;
      }
    }

    if(lineCount==2){
      return true;
    }else{
      return false;
    }

  }

  function checkThreeLine(currentBoard,dropPos,dropColor,direction){
      let returnFlag=false;
      let returnNum=0;
      let currentX=dropPos.x;
      let currentY=dropPos.y;
      let currentIndex=0;

      do{
        switch(direction){
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
            currentY++;
              break;
        }

        if(currentX>14 || currentX<0 || currentY>14 || currentY<0 ){
          break;
        }

        currentIndex=currentX+currentY*15;
        let currentColor=currentBoard[currentIndex];

        if(currentColor==dropColor){
          returnNum++;
        }else if(currentColor==0){
          returnFlag=true;
          break;
        }else{
          returnFlag=false;
          break;
        }

      }while(true);

      return {"flag":returnFlag,"num":returnNum};
  }


//////////////////testCode
  //searchDropablePos(createBoard(),1);
  //dropStoneBoard(createBoard(),{"x":2,"y":4},1);
