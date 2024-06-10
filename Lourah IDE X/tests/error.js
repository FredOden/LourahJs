var e = new Error("error object");
try {
  throw e;
  }
catch (err) {
  console.log("err::" + JSON.stringify(err));
  }