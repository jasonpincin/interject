var test = require('tape');
var interject = require('..');

var f = function () {
    var cb = arguments[arguments.length - 1];
    if (typeof cb === 'function') {
        var args = Array.prototype.slice.apply(arguments);
        args = args.slice(0, -1);
        cb.apply(cb, args);
    }
};

test('interject a callback', function (t) {
    t.plan(2);
    
    var cb1Called = false;
    var cb2Called = false;

    var cb1 = function () {
        cb1Called = true;
        t.ok(cb2Called === true, 'cb1 called after cb2');
    };
    // cb2 will interject cb1
    var cb2 = function () {
        cb2Called = true;
        t.ok(cb1Called === false, 'cb2 called before cb1');
    };

    var interjected = interject(f, cb2);
    interjected(cb1);
});

test('interject a callback with args', function (t) {
    t.plan(10);
    
    var cb1Called = false;
    var cb2Called = false;

    var cb1 = function (a, b, c) {
        cb1Called = true;
        t.ok(cb2Called === true, 'cb1 called after cb2');
        t.ok(arguments.length === 3, 'arguments length correct')
        t.ok(a === 'a', 'arg0 correct');
        t.ok(b === 'b', 'arg1 correct');
        t.ok(c === 'c', 'arg2 correct');
    };
    // cb2 will interject cb1
    var cb2 = function (a, b, c) {
        cb2Called = true;
        t.ok(cb1Called === false, 'cb2 called before cb1');
        t.ok(arguments.length === 3, 'arguments length correct')
        t.ok(a === 'a', 'arg0 correct');
        t.ok(b === 'b', 'arg1 correct');
        t.ok(c === 'c', 'arg2 correct');
    };

    var interjected = interject(f, cb2);
    interjected('a', 'b', 'c', cb1);
});

test('nested interject a callback with args', function (t) {
    t.plan(16);
    
    var cb0Called = false;
    var cb1Called = false;
    var cb2Called = false;

    var cb0 = function (a, b, c) {
        cb0Called = true;
        t.ok(cb0Called === true, 'cb0 called after cb1');
        t.ok(arguments.length === 3, 'cb0 arguments length correct')
        t.ok(a === 'a', 'cb0 arg0 correct');
        t.ok(b === 'b', 'cb0 arg1 correct');
        t.ok(c === 'c', 'cb0 arg2 correct');
    };
    // cb2 will interject cb0
    var cb1 = function (a, b, c) {
        cb1Called = true;
        t.ok(cb0Called === false, 'cb1 called before cb0');
        t.ok(arguments.length === 3, 'cb1 arguments length correct')
        t.ok(a === 'a', 'cb1 arg0 correct');
        t.ok(b === 'b', 'cb1 arg1 correct');
        t.ok(c === 'c', 'cb1 arg2 correct');
    };
    // cb2 will interject cb1
    var cb2 = function (a, b, c) {
        cb2Called = true;
        t.ok(cb0Called === false, 'cb2 called before cb0');
        t.ok(cb1Called === true, 'cb2 called after cb1');
        t.ok(arguments.length === 3, 'cb2 arguments length correct')
        t.ok(a === 'a', 'cb2 arg0 correct');
        t.ok(b === 'b', 'cb2 arg1 correct');
        t.ok(c === 'c', 'cb2 arg2 correct');
    };

    var interjected = interject(f, cb1);
    var interjected = interject(interjected, cb2);
    interjected('a', 'b', 'c', cb0);
});

test('interject without a callback', function (t) {
    t.plan(1);
    
    var cb0Called = false;
    var cb1Called = false;

    // cb2 will be called in spite of no cb being provided
    var cb1 = function () {
        cb1Called = true;
        t.ok(cb0Called === false, 'cb1 called');
    };

    var interjected = interject(f, cb1);
    interjected();
});

test('interject without a callback with args', function (t) {
    t.plan(5);
    
    var cb0Called = false;
    var cb1Called = false;

    // cb1 will be called in spite of no cb being provided
    var cb1 = function (a, b, c) {
        cb1Called = true;
        t.ok(cb0Called === false, 'cb1 called');
        t.ok(arguments.length === 3, 'cb1 arguments length correct')
        t.ok(a === 'a', 'cb1 arg0 correct');
        t.ok(b === 'b', 'cb1 arg1 correct');
        t.ok(c === 'c', 'cb1 arg2 correct');
    };

    var interjected = interject(f, cb1);
    interjected('a', 'b', 'c');
});
