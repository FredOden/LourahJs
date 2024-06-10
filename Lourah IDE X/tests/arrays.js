((n) => {
    var a = [1, 2, 3, 4, 5, 6];
    var r = a.reduce((a,b) => n* a * b);
    console.log("r::" + r);
    })(4);
