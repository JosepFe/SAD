var zmq = require('zmq');

var rq = zmq.socket('req');

exports.Start = function (host, port, cb) {

	rq.connect('tcp://' + host + ':' + port);
	console.log('conected to port 8080');
	if (cb != null) cb();
}

var callbacks = {} // hash of callbacks. Key is invoId
var invoCounter = 0; // current invocation number is key to access "callbacks".

//
// When data comes from server. It is a reply from our previous request
// extract the reply, find the callback, and call it.
// Its useful to study "exports" functions before studying this one.
//

rq.on ('message', function (data) {
	
	var str = data.toString();
	var arr = str.split('$$');

	arr.forEach(function(element){
		if(element.toString() != ""){

			console.log("reply comes in..." + element.toString());
			var reply = JSON.parse (element);

			switch (reply.what) {
			case 'add user':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj); // call the stored callback, 0 argument
				delete callbacks [reply.invoId]; // remove from hash
				break;
			case 'add subject':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj); 
				delete callbacks [reply.invoId]; 
				break;
			case 'get subject list':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
				delete callbacks [reply.invoId]; 
				break;
			case 'get user list':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj); 
				delete callbacks [reply.invoId]; 
				break;
			case 'login':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj);
				delete callbacks [reply.invoId];
				break;
			case 'add private message':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] ();
				delete callbacks [reply.invoId];
				break;
			case 'get private message list':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj);
				delete callbacks [reply.invoId];
				break;
			case 'add public message':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] ();
				delete callbacks [reply.invoId];
				break;
			case 'get public message list':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj);
				delete callbacks [reply.invoId];
				break;
			default:
				console.log ("Panic: we got this: " + reply.what);
			}
		}
	});
});

// Add a 'close' event handler for the client socket
rq.on('close', function() {
	console.log('Connection closed');
});

// Error handler
rq.on("error", function(err){ 
	console.log("server socket error: ");
	console.log(err.stack);
});

//
// on each invocation we store the command to execute (what) and the invocation Id (invoId)
// InvoId is used to execute the proper callback when reply comes back.
//
function Invo (str, cb) {
	this.what = str;
	this.invoId = ++invoCounter;
	callbacks[invoCounter] = cb;
}

exports.addUser = function (u,p, cb) {
	var invo = new Invo('add user', cb);
	invo.u = u;
	invo.p = p;
	rq.send(JSON.stringify(invo));
}

exports.addSubject = function (s, cb) {
	var invo = new Invo('add subject', cb);
	invo.s = s;
	rq.send(JSON.stringify(invo));
}

exports.getSubjectList = function (cb) {
	rq.send (JSON.stringify(new Invo ('get subject list', cb)) + "$$");
}

exports.getUserList = function (cb) {
	rq.send (JSON.stringify(new Invo ('get user list', cb)) + "$$");
}

exports.login = function (u, p, cb) {
	var invo = new Invo('login', cb);
	invo.u = u;
	invo.p = p;
	rq.send(JSON.stringify(invo));
}

exports.addPrivateMessage = function (msg, cb) {
	var invo = new Invo('add private message', cb);
	invo.msg = msg;
	rq.send(JSON.stringify(invo));
}

exports.getPrivateMessageList = function (u1, u2, cb) {
	invo = new Invo ('get private message list', cb);
	invo.u1 = u1;
	invo.u2 = u2;
	rq.send (JSON.stringify(invo));
}

exports.addPublicMessage = function (msg, cb) {
	var invo = new Invo('add public message', cb);
	invo.msg = msg;
	rq.send(JSON.stringify(invo));
}

exports.getPublicMessageList = function  (sbj, cb) {
	var invo = new Invo ('get public message list', cb);	
	invo.sbj = sbj;
	rq.send (JSON.stringify(invo));
}

