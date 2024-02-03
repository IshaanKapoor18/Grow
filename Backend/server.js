const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const app = express();
dotenv.config();

connectDB();

app.use(express.json());        //to accept any json data

// app.get("/grow/chat", (req, res) => {
//     const data = [{name: "name1", id: "167"}, {name: "name2", id: "17"}]
//     res.send(data)
// })


app.get("/grow/chat/:id", (req, res) => {
    console.log(req.params.id);
    res.send(req.params.id);
})

app.get("/grow", (req, res) => {
    res.send("Get home ");
})

app.use("/grow/user", userRoutes);
app.use("/grow/chat", chatRoutes);
app.use("/grow/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server Running at port ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
})

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        // console.log(userData._id);
        socket.emit("connected")
    });
    socket.on('join chat', (room) => {
        socket.join(room)
        console.log(`user joined rooom ${room}`);
        // socket.emit("connected")
    });


    socket.on('typing', (room) => {
        socket.in(room).emit("typing")
    });
    socket.on('stop typing', (room) => {
        socket.in(room).emit("stop typing")
    });






    socket.on('new message', (newMessageRecived) => {
        // socket.join(room)
        // console.log(`user joined rooom ${room}`);
        let chat = newMessageRecived.chat;

        if (!chat.users) return console.log("chat,users not defined");
        
        chat.users.forEach(user => {
            if (user._id == newMessageRecived.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecived)
        })


        // socket.emit("connected")
    });


    socket.off("setup", () => {
        console.log("USER DISCONNECTED !!");
        socket.leave(userData._id);
    })


})