/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - functions
 */

function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

function createEnum(values, startValue) {
    if (!isArray(values))
        return null;
    if (!startValue)
        startValue = 0;

    var _enum = {};
    for(var k in values) {
        var v = values[k];
        var n = parseInt(k)+startValue;
        _enum[_enum[v] = n] = v;
    }
    _enum.getValues = function () {
        var values = [];
        for(var v in this) {
            if (this.hasOwnProperty(v) && !isNaN(v = parseInt(v)))
                values[v] = (this[v]);
        }
        return values;
    };
    return _enum;
}

function randInt(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min))+min;
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}