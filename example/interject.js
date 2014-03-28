var interject = require('..');

var say = function (msg, cb) {
    console.log(msg);
    if (cb) cb(null, msg);
};

var afterSay = function (err, msg) {
    console.log('You said: ' + msg +'\n');
};

var logMessage = function (err, msg) {
    console.log('On ' + (new Date()) + ', somebody said: ' + msg);
};

say('Interject me please.', afterSay);
// Output:
// Interject me please.
// You said: Interject me please.

var sayLogged = interject(say, logMessage);
sayLogged('Interject me please.', afterSay);
// Output:
// Interject me please.
// On Fri Mar 28 2014 18:20:41 GMT-0400 (EDT), somebody said: Interject me please.
// You said: Interject me please.
