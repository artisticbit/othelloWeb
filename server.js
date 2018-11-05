var express = require('express');
var app = express();
var router = require('./router/main') (app);

var io = require('socket.io').listen(app.listen(3001));



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//////////////////////////////////////////////////////////
var firstTurn=1;
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
        let dropableIndexList=searchDropablePos(currentBoard,firstTurn);

        data={"currentTurn":firstTurn,
              "board":listBoard.get(msg),
              "dropableIndexList":dropableIndexList};

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
      let flipStones=dropStoneBoard(currentBoard, data.pos, data.dropColor);

      console.log("DropStone flipStrones::"+flipStones);

      for(let i=0; i< flipStones.length; i++){
        let index=flipStones[i];
        currentBoard[index]=data.dropColor;
      }


      let nextTurnColor=data.dropColor==1?2:1;
      let nextDropables=searchDropablePos(currentBoard, nextTurnColor);

      //listBoard.set(data.roomName,currentBoard);

      console.log("currentTurn::"+nextTurnColor);
      //  둘곳이 없을때 처리 추가필요
      //
      nextData={"board":currentBoard,
                "dropableIndexList":nextDropables,
                "currentTurn":nextTurnColor};

      io.to(data.roomName).emit('dropStone',nextData);
      //console.log("dropStone"+"x :"+data.pos.x+" y: "+data.pos.y);
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

  function searchDropablePos(board,dropStoneColor){

    var x=0;
    var y=0;
    var dropablePosArr=[];

    for(var i=0; i<64; i++){

      x=Math.floor(i%8);
      y=Math.floor(i/8);
      //console.log("searchPos"+"x::"+x+" y::"+y);

      if(board[i]!=0){
        //console.log("!!!!!!!!!already dropStone::::"+board[i]);
        continue;
      }

      for(var j=0; j<8; j++){
        var returnData=checkFullDirection(board,{"x":x,"y":y},j,dropStoneColor);

        if(returnData.flag){
          //if find dropablePos  push index and continue next index loof
          dropablePosArr.push(i);
          break;
          //console.log(returnData.indexArr);
        }
        //console.log(returnData.flag);
        //console.log(returnData.indexArr);
      }

    }

    return dropablePosArr;

  }
  function dropStoneBoard(board,pos,dropColor){
    var flipArr=[];

    flipArr.push(pos.x+pos.y*8);

    for(var i=0; i<8; i++){

      var returnData;
      returnData=checkFullDirection(board,pos,i,dropColor);

      for(var j=0; j<returnData.indexArr.length; j++){

        flipArr.push(returnData.indexArr[j]);
        console.log("flip push:"+returnData.indexArr[j]);
      }

    }

    //console.log("flipIndex::"+flipArr);
    return flipArr;


  }

  function checkFullDirection(board,pos,direction,dropStoneColor){
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

      if(direction==1){
      console.log("D::"+direction+",currentPos "+"X::"+currentPos.x+" Y::"+currentPos.y);
      }

      if(currentPos.x>8||currentPos.x<0||currentPos.y<0||currentPos.y>8){
        returnData.flag=false;
        return returnData;
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
            returnData.indexArr.push(index);
            //continu search next pos
            flag=true;

            continue;
          }

      }

      else{
          if(currentStoneColor==0){
            returnData.flag=false;
            returnData.indexArr=[];
            return returnData;
          }
          if(currentStoneColor!=dropStoneColor){
            //index push retur array
            returnData.indexArr.push(index);
            continue;
          }
          else{
            returnData.flag=true;
            return returnData;
          }
      }


    }

  }
//////////////////testCode
  //searchDropablePos(createBoard(),1);
  //dropStoneBoard(createBoard(),{"x":2,"y":4},1);


//////////////////////////////////////////////////////////
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})

app.use(express.static('public'));
