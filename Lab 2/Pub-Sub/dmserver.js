var zmq = require("zmq");
var rp = zmq.socket("rep");
var pub = zmq.socket("pub");
var sub = zmq.socket("sub");
var dm = require("./dm.js");

var host = process.argv[2];
var port = process.argv[3];

var portPub = process.argv[4];

var serverOnline = process.argv[5];


pub.bind("tcp://*:"+ portPub);

rp.bind("tcp://" + host + ":" + port, function(err) {
  if (err) {
    throw err;
  } else {
    console.log("Listening on " + port);
  }
});

//rehacer
if (serverOnline == "" || serverOnline == null || serverOnline == undefined) {
    console.log("El unico servidor conectado es el actual.")
} else {
    var i;
    var aux = serverOnline.split(",");
    for (i = 0; i < aux.length; i++){
        sub.connect("tcp://" + aux[i]);
        sub.subscribe("cp");
        console.log ("subscrito al servidor : " +aux[i]);
    }
}

sub.on('message', function(msgStr){
    console.log("llegooooooooooo");
	var res = (msgStr.toString()).split("cp");
	for (i=0; i< res.length; i++) {
		if (res[i] != "" && res[i] != "cp"){
			console.log("Checkpoint recibido:" + res[i]);
            var datos = JSON.parse (res[i]);
            var reply = {what:datos.what, invoId:datos.invoId};
			switch (datos.what) {
                case 'add user': 
                    reply.obj = dm.addUser(datos.u, datos.p);
                    pub.send ("cambios" + res[i]);
                    break;
                case 'add subject': 
                    reply.obj = dm.addSubject(datos.s);
                    pub.send ("cambios" + res[i]);
                    break;
                case 'add private message': 
                    console.log(datos.msg);
                    console.log(res[i]);
                    reply.obj = dm.addPrivateMessage (datos.msg);
                    pub.send ("cambios" + res[i]);
                    break;
                case 'add public message': 
                    reply.obj = dm.addPublicMessage (datos.msg);
                    pub.send ("cambios" + res[i]);
                    break;
                default:
                    console.log ('error catastrofico: no ha accedido a ningun case valido');
                    break;
            }
		}	
	}
});


rp.on("message", function(data) {
  var str = data.toString();
  var arr = str.split("$$");
  
  arr.forEach(function(element) {
    if (element.toString() != "") {
      console.log("request comes in..." + element.toString());
      var invo = JSON.parse(element);
      var reply = { what: invo.what, invoId: invo.invoId };
      switch (invo.what) {
        case "add user":
          reply.obj = dm.addUser(invo.u, invo.p);
          pub.send("cambios" + element);
          pub.send("cp" + element);
          break;
        case "add subject":
          reply.obj = dm.addSubject(invo.s);
          pub.send("cambios" + element);
          pub.send("cp" + element);
          break;
        case "get subject list":
          reply.obj = dm.getSubjectList();
          break;
        case "get user list":
          reply.obj = dm.getUserList(invo.sbj);
          break;
        case "login":
          reply.obj = dm.login(invo.u, invo.p);
          break;
        case "add private message": //revisar
          reply.obj = dm.addPrivateMessage(invo.msg);
          pub.send("cambios" + element);
          pub.send("cp" + element);
          break;
        case "get private message list":
          reply.obj = dm.getPrivateMessageList(invo.u1, invo.u2);
          break;
        case "add public message":
          reply.obj = dm.addPublicMessage(invo.msg);
          pub.send ("cambios" + element);
          pub.send ("cp" + element);
          break;
        case "get public message list":
          reply.obj = dm.getPublicMessageList(invo.sbj);
          break;
        default:
          console.log("mensaje vacio");
          break;
      }
      console.log("reply is: " + JSON.stringify(reply));
      rp.send(JSON.stringify(reply) + "$$");
    }
  });
});

// Add a 'close' event handler to this instance of socket
rp.on("close", function(data) {
  console.log("Connection closed");
});

// Error handler
rp.on("error", function(err) {
  console.log("server socket error: ");
  console.log(err.stack);
});
