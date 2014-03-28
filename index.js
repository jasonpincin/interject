module.exports = function (f, cb) {
    var interjected = function () {
        var args = Array.prototype.slice.apply(arguments);
        if (typeof args[args.length - 1] === 'function') {
            var _cb = args.pop();
            var interject = function () {
                cb.apply(cb, arguments);
                _cb.apply(_cb, arguments);
            };
            args.push(interject);
        }
        else {
            args.push(cb)
        }
        f.apply(f, args);
    };
    return interjected;
};
