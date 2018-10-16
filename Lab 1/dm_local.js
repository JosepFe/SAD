var dm = require('./dm.js');
                     
exports.getSubjectList = function (cb) {
	var res = dm.getSubjectList()
    cb(res);
}

// true on success
exports.addUser = function (u,p, cb) {
	var res = dm.addUser(u, p);
	cb(res);
}

// Adds a new subject to subject list. Returns -1 if already exists, id on success
exports.addSubject = function (s, cb) {
	var res = dm.addSubject(s);
	cb(res);
}

exports.getUserList = function (cb) {
	var res = dm.getUserList();
	cb(res);
}

// Tests if credentials are valid, returns true on success
exports.login = function (u, p, cb) {
    var res = dm.login(u, p);
    cb(res);
}

// adds a public message to storage
exports.addPublicMessage = function (msg, cb)
{
	dm.addPublicMessage(msg);
	cb();
}

exports.getPublicMessageList = function (sbj, cb) {
	var res = dm.getPublicMessageList(sbj);
	cb(res);
}

