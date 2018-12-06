var zmq = require('zmq');
var rp = zmq.socket('rep');

var pub = zmq.socket('pub');
var sub = zmq.socket('sub');

var host = process.argv[2];
var port = process.argv[3];
var portPUB = 9999;

var dm = require('./dm.js');

rp.bind('tcp://' + host + ':' + port,
    function (err) {
        if (err) {
            throw err
        } else {
            console.log('Listening request on ' + port)
        }
    });

pub.bind('tcp://*:' + portPUB, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening publisher on ' + portPUB)
    }
});

rp.on('message', function (data) {
    var str = data.toString();
    var arr = str.split('$$');

    arr.forEach(function (element) {
        if (element.toString() != "") {

            console.log("request comes in..." + element.toString());
            var invo = JSON.parse(element);
            var reply = { what: invo.what, invoId: invo.invoId };
            switch (invo.what) {
                case 'add user':
                    reply.obj = dm.addUser(invo.u, invo.p);
                    break;

                case 'add subject':
                    reply.obj = dm.addSubject(invo.s);
                    break;

                case 'get subject list':
                    reply.obj = dm.getSubjectList();
                    break;

                case 'get user list':
                    reply.obj = dm.getUserList(invo.sbj);
                    break;

                case 'login':
                    reply.obj = dm.login(invo.u, invo.p);
                    break;

                case 'message':
                    reply.obj = dm.addPrivateMessage(invo.msg);
                    break;

                case 'get private message list':
                    reply.obj = dm.getPrivateMessageList(invo.u1, invo.u2);
                    break;

                case 'add public message':
                    reply.obj = dm.addPublicMessage(invo.msg);

                    break;

                case 'get public message list':
                    reply.obj = dm.getPublicMessageList(invo.sbj);
                    break;
                default:
                    console.log("mensaje vacio");
            }
            console.log("reply is: " + JSON.stringify(reply));
            rp.send(JSON.stringify(reply) + "$$");
            console.log("estoy aqui!");
            pub.send(['WS', JSON.stringify(reply) + "$$"]);
        }
    });
});

// Add a 'close' event handler to this instance of socket
rp.on('close', function (data) {
    console.log('Connection closed');
});

// Error handler
rp.on("error", function (err) {
    console.log("server socket error: ");
    console.log(err.stack);
});




