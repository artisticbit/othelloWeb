
module.exports=function(io){

  var roomList={};

  io.on('connection', (socket) => {


    console.log('a user connected');


    socket.on('roomEnter', (data) => {
      //msg is roomName;
      socket.join(data.roomName);

      var room = io.sockets.adapter.rooms[data.roomName];
      console.log("room test :: "+room);
      var roomLength = room.length;

      let msgData={"nickName" : "system" , "msg" : data.nickName+"님이 입장하셨습니다."};
      io.to(data.roomName).emit('chatMsg',msgData);
      console.log("user enter room :: "+data.roomName);
      console.log("room users Num : "+  roomLength);

    });


    socket.on('chatMsg', (data) => {

      io.to(data.roomName).emit('chatMsg',data);
      console.log("roomName: "+data.roomName+"nickName: "+data.nickName+"chatMsg: "+data.msg);
    });

    socket.on('gameStart', (data) => {

      var roomInfo = roomList[data.roomNmae];
      var roomState = { 'state' : 'start' , "userList" :[]};
      var sendData={};
      if(roomInfo){
        console.log("Yes room");
        
      }else{
        roomList[data.roomName]=roomState;
        io.to(data.roomName).emit("gameStart",sendData);
        console.log("No Room");
      }
      
    });

    socket.on('sendRPS', (data) => {

      roomList[data.roomName].userList.push(data);
      
      let roomLength = io.sockets.adapter.rooms[data.roomName].length;
      
      if(roomList[data.roomName].userList.length == roomLength ){
        let resultData = {};
        let msgData = {"nickName": "system", "msg" :""}; 
        
        console.log("all user send hand")
        let userList = roomList[data.roomName].userList;
        if(userList.length==2){
          let type1 = userList[0].type;
          let type2 = userList[1].type;

          if(userList[0].type==userList[1].type){
            resultData.result="draw";
          }
          else{
            let result = checkWinner(type1,type2);
            if(result){ 
              userList[0].result="win"; 
              userList[1].result="lose";
            }
            else{
              userList[0].result="lose"; 
              userList[1].result="win";
            }
            resultData.result="end"
          }
        }
        //3명이상일때
        else{
          if(checkDraw(userList)){
            resultData.result="draw";
          }
          else{
            checkWinnerMulti(userList,resultData);
            resultData.result="end";
          }
        }
        
        for(let i=0; i<roomLength; i++){
          let userList = roomList[data.roomName].userList;
          msgData.nickName= userList[i].nickName;
          msgData.msg= userList[i].type==0 ? '가위' : userList[i].type==1? '바위': '보';
          io.to(data.roomName).emit('chatMsg',msgData);
        }
        /*
        for(let i=0; i<roomLength; i++){
          let userList = roomList[data.roomName].userList;
          msgData.nickName= userList[i].nickName;
          msgData.msg= userList[i].result=="win" ? '승리' : userList[i].result=='lose'? '패배': '무승부';
          io.to(data.roomName).emit('chatMsg',msgData);
        }
        */


        
        resultData.userList=roomList[data.roomName].userList;
        io.to(data.roomName).emit("endStart",resultData);
        delete roomList[data.roomName];
       
      }
      

    });

    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
  });

  return io;


}

function checkWinner(type1,type2){
  if(type1!=0 && type2!=0){
    if(type1<type2) return true;
    else return false;
  }
  else{
    if(type1>type2) return true;
    else return false;
  }
}

function checkDraw(userList){
  let flag=[false,false,false];
  for(let i=0; i< userList.length; i++){
    flag[userList[i].type]= true;
  }
  if((flag[0]&&flag[1]&&flag[2] )|| 
     (flag[0]&&!flag[1]&&!flag[2]) || (!flag[0]&&flag[1]&&!flag[2]) || (!flag[0]&&!flag[1]&&flag[2]))
    return true;
  else
    return false;
}

function checkWinnerMulti(userList,resultData){
  let length = userList.length;
  for(var i=0; i< length; i++){
    userList[i].result="lose";
    for(var j = 0; j< length;j++ ){
      if(userList[i].type==userList[j].type) continue;
      else{
        if(checkWinner(userList[i].type,userList[j].type)){
          userList[i].result="win";
          break;
        }
      }
    }
  }

}