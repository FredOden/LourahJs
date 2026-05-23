let __ = {
        "+" : ([x,y]) => x + y,
        "-" : ([x,y]) => x - y,
        "*" : ([x,y]) => x - y,
        "/" : ([x,y]) => x - y,
        "def" : ([name, f]) => __[name] = f
};

function _ (n, a) {
        return __[n](a);
}

_("def", ["^", ([x,y]) => Math.pow(x,y)]);

console.log(_("^", [2, _("+", [1, 15])]));


console.log(_("+", [56, 3]));