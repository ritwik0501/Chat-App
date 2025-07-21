import { useState } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import {io} from 'socket.io-client';

export default function App(){
  const [message,setmessage]=useState("")
  const [room,setroom]=useState("");
  const[socketid,setsocketid]=useState("")
  const [customroom,setcustomroom]=useState("")
  const[receiveMessage,setReceiveMessage]=useState([]);
  const socket =useMemo(()=>io('http://localhost:3000'),[])
  // const socket= io('http://localhost:3000')


function handlesubmit(e){
e.preventDefault();
}

function joinroomhandelar(e){
e.preventDefault();
socket.emit("join-room",customroom);
setcustomroom('');
}

function submitMessage(){
  socket.emit("message",{message,room});
  setmessage("");
  console.log(message);
}

  useEffect(()=>{
socket.on("connect",()=>{
  setsocketid(socket.id);
  console.log("welcome TO Chat.com",socket.id);
})
socket.on("Welcome",(message)=>{
  console.log(message);
// setmessage(message);
})
socket.on("Message_from_Server",(message_data)=>{
setReceiveMessage((prevmsg)=>[...prevmsg,message_data.message]);
console.log("receive msg",receiveMessage);

})
return ()=>{
 socket.disconnect()
}
  },[])


  return <>
  <h1>Chatting App {socketid}</h1>
{/* Custom join room */}
<form onSubmit={joinroomhandelar}>
 <input type='text' 
    value={customroom}
    onChange={e=>setcustomroom(e.target.value)}
    placeholder='Enter Custom Room Name..'/>

   <button type='submit' onClick={joinroomhandelar}>Join Room</button>

</form>

  <form onSubmit={handlesubmit}>
    <input type='text' 
    value={message}
    onChange={e=>setmessage(e.target.value)}
    placeholder='Enter a message ...'/>
    {/* one to one chat  */}
    <input type='text' 
    value={room}
    onChange={e=>setroom(e.target.value)}
    placeholder='Enter RoomId'/>
    <button type='submit' onClick={submitMessage} >SEND</button>
  </form>
  <ul>
    {receiveMessage.map((msg, index) => (
      <li key={index}>{msg}</li>
    ))}
  </ul>
  </>
}