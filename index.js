var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var steinsGate = [
    {name: "岡部 倫太郎", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/0.png"},
    {name: "牧瀬 紅莉栖", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/1.png"},
    {name: "椎名 まゆり", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/2.png"},
    {name: "橋田 至", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/3.png"},
    {name: "阿万音 鈴羽", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/4.png"},
    {name: "フェイリス・ニャンニャン", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/5.png"},
    {name: "漆原 るか", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/6.png"},
    {name: "桐生 萌郁", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Steins-Gate-Avatar/7.png"}
];


var dollars = [
    {name: "セットン", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Dollars-Avatar/セットン.jpg"},
    {name: "巴裘拉", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Dollars-Avatar/巴裘拉.jpg"},
    {name: "甘樂", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Dollars-Avatar/甘樂.jpg"},
    {name: "田中太郎", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Dollars-Avatar/田中太郎.jpg"},
    {name: "罪歌", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Dollars-Avatar/罪歌.png"}
];

var fateZero = [
    {name: "archer", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/archer.jpg"},
    {name: "assassin", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/assassin.jpg"},
    {name: "berserker", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/berserker.jpg"},
    {name: "caster", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/caster.jpg"},
    {name: "lancer", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/lancer.jpg"},
    {name: "rider", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/rider.jpg"},
    {name: "saber", imgURL: "https://raw.githubusercontent.com/s3cy/Pictures/master/Fate-Zero-Avatar/saber.jpg"},
];

var data = [
    {name: "Dollars", roles: dollars, room: 'room0'},
    {name: "Ei Psy Congloo", roles: steinsGate, room: 'room1'},
    {name: "Fate Zero", roles: fateZero, room: 'room2'}
];

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
        socket.emit('identity', {nick:socket.nickname, imgURL:socket.imgURL, title: data[ith].name});
        io.in(room).emit('connect message', socket.nickname + " さが入室しました");
        socket.on('chat message', function(data) {
            socket.in(room).broadcast.emit('chat message', {msg:data, nick:socket.nickname, imgURL: socket.imgURL});
        });
        socket.on('disconnect', function() {
            io.in(room).emit('connect message', socket.nickname + " さが退室しました");
            roles.push({name: socket.nickname, imgURL: socket.imgURL});
        });
    }

    while (1) {
        if (data[n].roles.length != 0) {
            connectToRoom(n);
            break;
        } else {
            for (var i = 0; i < data.length; i++) {
                var clients = io.sockets.adapter.rooms[data[i].room];
                var j = 0;
                for (j in clients) {
                    j++;
                }
                if (j == 0) {
                    n = i;
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
});
