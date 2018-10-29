var net = require('net');
var HOST = process.argv[2];
var PORT = process.argv[3];

var dm = require ('./dm.js');

// Create the server socket, on client connections, bind event handlers
server = net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Conected: ' + sock.remoteAddress + ':' + sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('request comes in...' + data);
        var str = data.toString();
        var invo = JSON.parse (str);
        console.log('request is:' + invo.what + ':' + str);

        var reply = {what:invo.what, invoId:invo.invoId};
        var cmd = invo;
        switch (invo.what) {
            case 'add user': 
                reply.obj = dm.addUser (cmd.u, cmd.p);
                var result = reply
                break;
            case 'add Subject': 
                reply.obj = dm.addSubject (cmd.s);
                var result = reply
                break;
            case 'get subject list': 
                reply.obj = dm.getSubjectList();
                var result = reply
                break;
            case 'get user list': 
                reply.obj = dm.getUserList (cmd.sbj);
                var result = reply
                break;
            case 'login': 
                reply.obj = dm.login (cmd.u, cmd.p);
                var result = reply
                break;
            case 'message': 
                reply.obj = dm.addPrivateMessage (cmd.msg);
                var result = reply
                break;
            case 'get private message list': 
                reply.obj = dm.getPrivateMessageList (cmd.u1, cmd.u2);
                var result = reply
                break;
            case 'add public message': 
                reply.obj = dm.addPublicMessage (cmd.msg);
                var result = reply
            	break;
            case 'get public message list': 
                reply.obj = dm.getPublicMessageList (cmd.sbj);
                var result = reply
            	break;
        }
        sock.write (JSON.stringify(result));
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('Connection closed');
    });
    
});
    
server.listen(PORT, HOST, function () {
    console.log('Server listening on ' + HOST +':'+ PORT);
});


