$(document).ready(function() {
    var socket = io();
    var myname, myURL;
    $(window).scroll(function() {

    });
    socket.on('identity', function(data) {
        myname = data.nick;
        myURL = data.imgURL;
        $('.header h2').text(data.title);
    });
    
    $('.send').click(function() {
        var input = $('input').val();
        $('input').val('');
        if (input != '') {
            var box = $('<div class="message-box right-img">');
            var image = $('<img title="user name"/>').attr('src', myURL);
            var picture = $('<div class="picture">');
            box.append(picture);
            picture.append(image);
            var message = $('<div class="message">');
            box.append(message);
            message.append($('<span>').text(myname));
            message.append($('<p>').text(input));
            $('.chat-box').prepend(box);
            box.slideDown();
            socket.emit('chat message', input);
        }
    });
    $('input').keypress(function(key) {
        if (key.which == 13) {
            $('.send').click();
        }
    })

    socket.on('chat message', function(data) {
        var box = $('<div class="message-box left-img">');
        var image = $('<img title="user name"/>').attr('src', data.imgURL);
        var picture = $('<div class="picture">');
        box.append(picture);
        picture.append(image);
        var message = $('<div class="message">');
        box.append(message);
        message.append($('<span>').text(data.nick));
        message.append($('<p>').text(data.msg));
        $('.chat-box').prepend(box);
        box.slideDown();
    });
    socket.on('connect message', function(msg) {
        var box = $('<div class="connect-message">');
        box.append($('<p>').text(msg));
        $('.header').after(box);
        box.slideDown();
        box.delay(4000).slideUp();
    });
    socket.on('sorry message', function() {
        var box = $('<div class="connect-message">');
        box.append($('<p>').text("sorry you are late."));
        $('.header').after(box);
        box.slideDown();
    });
});
