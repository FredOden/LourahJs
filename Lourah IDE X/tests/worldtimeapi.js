Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.http.GET.js');


var endPoint = "http://worldtimeapi.org/api/";

function request(path, cb, txt) {
  Lourah.http.GET(
    endPoint + path + (txt?".txt":"")
    ,cb
    );
  }

var tz;

request("timezone",
  s => tz = JSON.parse(s)
  ,false
  );

request("ip", s => {
    try {
      json = JSON.parse(s);
      var now = json.datetime.split(/[\-T,:\+]/);
      console.log(s);
      console.log(json.timezone + "::" + now[3] + ":" + now[4] + ":" + now[5]);
      } catch(e) {
      console.log("ip::error::" + e + "::" + e.stack);
      }
    }
  );
