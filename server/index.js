const express= require('express')
const {Server}= require("socket.io")
const {createServer}= require("http")
const cors= require("cors");

const app=express();
const server= createServer(app);

const io= new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    },
});
// app.use(cors({
//         origin:"http://localhost:5173/",
//         methods:["GET","POST"],
//         credentials:true
//     }))

app.get("/",(req,res)=>{

res.send("Hellow world");
})

io.on('connection',(socket)=>{

    console.log("✔✔a new user is connected",socket.id);
    // socket.broadcast.emit("Welcome",`You are Connected to User${socket.id}`);

    socket.on("message",(message_from_Client)=>{
        console.log(message_from_Client);
        if(message_from_Client.room==""){
            io.emit("Message_from_Server",message_from_Client);
        }else{
        socket.to(message_from_Client.room).emit("Message_from_Server",message_from_Client);
        }
    })

    socket.on("disconnect",()=>{
        console.log("❌❌user is DisConnectd",socket.id);
    })
})

server.listen(3000,()=>{
console.log("App is running on Port 3000")
});