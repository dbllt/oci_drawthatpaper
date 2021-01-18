var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
      }
});

io.on('connection', function (socket) {
    console.log('a user is connected');
    socket.on('disconnect', function () {
        console.log("A user is disconnected");
    })

    socket.on('chat', function (msg) {
        console.log("message recu: " + msg);
        io.emit('chat', msg);
    })
});

http.listen(3000, function () {
    console.log("Server running on, 3000");
});