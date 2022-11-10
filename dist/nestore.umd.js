(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.nestore = factory());
})(this, (function () { 'use strict';

    function nestore() {
        const on = () => { };
        return {
            on
        };
    }

    return nestore;

}));
