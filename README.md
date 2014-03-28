interject
=========

[![Build Status](https://travis-ci.org/jasonpincin/interject.svg?branch=master)](https://travis-ci.org/jasonpincin/interject)
[![Coverage Status](https://coveralls.io/repos/jasonpincin/interject/badge.png?branch=master)](https://coveralls.io/r/jasonpincin/interject?branch=master)
[![NPM version](https://badge.fury.io/js/geval.png)](http://badge.fury.io/js/interject)
[![Davis Dependency Status](https://david-dm.org/jasonpincin/interject.png)](https://david-dm.org/jasonpincin/interject)

[![browser support](https://ci.testling.com/jasonpincin/interject.png)
](https://ci.testling.com/jasonpincin/interject)

Do something as an aside to a callback.

Potentially useful for logging calls to particular callbacks. Maybe other stuff too.

## example

```javascript
var interject = require('interject');

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
```

## api

### `var interjected = interject(func, function interjection () {})`

```javascript
interjected(function callback () {
    /* do something */
});
```

Assuming the implementation of `func` accepts a callback (as it's last parameter), the function returned by 
`interject` will invoke both the `interjection` (as an aside) and the `callback` provided to `interjected` at the 
time the `func` implementation would have executed it's callback. It's important to note that the `interjection` will be 
called just before the `callback`, but it is not gauranteed to complete before `callback` is called.

The `interjection` receives the same `arguments` as the `callback`.

Also of note - when nesting interjections, the interjections will be called in the order they are defined before the final 
`callback`. Example:

```javascript
var original = function (cb) { cb() };
var interjection1 = function () { /* I am called 1st */ };
var interjected = interject(original, interjection1);
var interjection2 = function () { /* I am called 2nd */ };
var interjected = interject(interjected, interjection2);
interjected();
```

## install

`npm install interject`

## license

MIT
