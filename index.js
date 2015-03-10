var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data = require("./data.json");

var n = Math.floor(Math.random() * data.length);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    function connectToRoom(ith) {
        var room = data[ith].room;
        var roles = data[ith].roles;
        socket.join(room);
        var x = Math.floor(Math.random() * roles.length);
        socket.nickname = roles[x].name;
        socket.imgURL = roles[x].imgURL;
        roles.splice(x, 1);
        console.log(socket.nickname + " was created!");
        socket.emit('identity', {nick:socket.nickname, imgURL:socket.imgURL, title: data[ith].name});
        io.in(room).emit('connect message', socket.nickname + " さが入室しました");
        socket.on('chat message', function(data) {
            socket.in(room).broadcast.emit('chat message', {msg:data, nick:socket.nickname, imgURL: socket.imgURL});
        });
        socket.on('disconnect', function() {
            io.in(room).emit('connect message', socket.nickname + " さが退室しました");
            console.log(socket.nickname + " leaves the room " + data[ith].name);
            roles.push({name: socket.nickname, imgURL: socket.imgURL});
        });
    }

    while (1) {
        if (data[n].roles.length != 0) {
            connectToRoom(n);
            break;
        } else {
            console.log("room " + data[n].name + " is full")
            for (var i = 0; i < data.length; i++) {
                var clients = io.sockets.adapter.rooms[data[i].room];
                var j = 0;
                for (j in clients) {
                    j++;
                }
                if (j == 0) {
                    n = i;
                    console.log("room== " + data[n].name " ==room");
                    break;
                }
            }
            if (data[n].roles.length == 0) {
                socket.emit('sorry message');
                socket.disconnect();
                break;
            }
        }
    }
});

http.listen(3000, function() {
    console.log('listening on *:3000');
    console.log("room== " + data[n].name " ==room");
});
