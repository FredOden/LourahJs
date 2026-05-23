function whatsMyIP()  {
  console.log("enter");
  let url = new java.net.URL("https://api.ipify.org");

  let con = java.net.HttpURLConnection(url.openConnection());
  con.setRequestMethod("GET");
  console.log("con::" + con);
  let r = con.getResponseCode();
  console.log("call::" + r);
  let cis = con.getInputStream();
  console.log("Ok::" + cis);
  let input = new java.io.BufferedReader(
    new java.io.InputStreamReader(cis)
    );

  let ip = input.readLine();
  input.close();

  console.log("IP publique : " + ip);
  }

let t = new java.lang.Thread({
    run: whatsMyIP()
    });

t.start();
