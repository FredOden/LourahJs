var Lourah = Lourah || {};
(function () {
    Lourah.http = Lourah.http || {};
    Lourah.http.util = Lourah.http.util || {};
    
    if (Lourah.http.util.STATUS) return;

    Lourah.http.util.STATUS = {
      100 : "Continue"
      , 101 : "Switching Protocol"
      , 200 : "OK"
      , 201 : "Created"
      , 202 : "Accepted"
      , 203 : "Non-authorative Information"
      , 204 : "No Content"
      , 205 : "Reset Content"
      , 206 : "Partial Content"
      , 300 : "Multiple Choice"
      , 301 : "Moved Permanently"
      , 302 : "Found"
      , 303 : "See Other"
      , 304 : "Not Modified"
      , 305 : "Use Proxy"
      , 306 : "Unused (306 is deprecated)"
      , 307 : "Temporary Redirect"
      , 400 : "Bad Request"
      , 401 : "Unauthorized"
      , 402 : "Payment Required"
      , 403 : "Forbidden"
      , 404 : "Not Found"
      , 405 : "Method Not Allowed"
      , 406 : "Not Acceptable"
      , 407 : "Proxy Authentication Required"
      , 408 : "Request Timeout"
      , 409 : "Conflict"
      , 410 : "Gone"
      , 411 : "Length Required"
      , 412 : "Precondition Failed"
      , 413 : "Request Entity Too Large"
      , 414 : "Request-url Too Long"
      , 415 : "Unsupported Media Type"
      , 416 : "Requested Range Not Satisfiable"
      , 417 : "Expectation Failed"
      , 500 : "Internal Server Error"
      , 501 : "Not Implemented"
      , 502 : "Bad Gateway"
      , 503 : "Service Not Available"
      , 504 : "Gateway Timeout"
      , 505 : "HTTP Version Not Supported"
      };

    var CRLF = "\r\n";

    Lourah.http.util.VERSION = "0.1.0";

    var SERVER_DESCRIPTION = "Lourah/" + Lourah.http.util.VERSION + " (Powered by Lourah.http.util on Android)";

    function readLine(inputStream) {
      var baos = java.io.ByteArrayOutputStream();
      var b;
      for(b = inputStream.read(); b !== 10|0 && b !== -1; b = inputStream.read()) {
        baos.write(b);
        }
      if (b === -1 && baos.size() === 0) {
        return null;
        }
      return baos.toString("UTF-8");
      }



    function Headers() {
      var headers = {};
      this.put = (key, values) => {
        if (!Array.isArray(values)) {
          values = [ values ];
          }
        headers[key] = headers[key] || [];
        for (var i = 0; i < values.length; i++) {
          headers[key].push(values[i].trim());
          }
        return this;
        }

      this.add = (key, value) => {
        return this.put(key, [value]);
        }

      this.set = (key, value) => {
        headers[key] = [value.trim()];
        return this;
        }

      this.load = (js) => {
        for(var k in js) {
          this.put(k, js[k]);
          }
        return this;
        }
      
      
      
      this.containsKey = key => headers[key]?true:false;

      this.containsValue = value => {
        for (var k in headers) {
          if (headers[k].indexOf(value) < 0) return true;
          }
        return false;
        }

      this.get = key => headers[key] || null;
      this.getFirst = key => headers[key]?headers[key][0]:null;
      this.remove = key => headers[key] = undefined;
      this.clear = () => headers = {};
      this.toString = () => {
        var s = "Headers::{\n";
          for(k in headers) {
            s += "  " + k + ":\n";
            for(var i = 0; i < headers[k].length; i++) {
              s += "    " + headers[k][i] + "\n";
              }
            }
          s += "}::Headers\n";
        return s;
        }
      
      this.toHttp = () => {
        var sHttp = "";
        for(var k in headers) {
          sHttp += k + ": " + headers[k].join(", ") + CRLF;
          }
        return sHttp;
        }

      this.getFromHttpInputStream = (inputStream) => {
        var line;
        while(line = readLine(inputStream)){
          if (line.trim().equals("")) break;
          var separator = line.indexOf(":");
          var key = "" + line.substring(0, separator);
          var val = "" + line.substring(separator + 1).trim();
          if (separator > -1) {
            this.put(key, val.split(','));
            //console.log("<<<'" + key + "':'" + val + "'");
            }
          }
        }

      }


    Lourah.http.util.Headers = Headers;


    function MessageBuilder() {
      var command;
      var message;
      var headers = new Headers();
      var body;
      var inputStream;
      var outputStream;
      
      
      this.setInputStream = (is) => {
        inputStream = is;
        };
      this.getInputStream = () => inputStream;
      
      this.setOutputStream = (os) => {
        outputStream = os;
        };
      this.getOutputStream = () => outputStream;

      this.setCommand = (c) => {
        command = c;
        };

      this.setResponseCode = (code) => {
        this.setCommand("HTTP/1.1 " + code + " " + Lourah.http.util.STATUS[code]);
        }
      
      this.getCommand = () => command;

      this.setHeaders = (h) => {
        headers = h;
        };

      this.getHeaders = () => headers;

      this.getBody = () => body;

      this.setBody = (b) => {
        body = b;
        };

      this.send = () => {
        var bBody;

        if (!headers) {
          headers = new Headers();
          }

        if (body) {
          bBody = new java.lang.String(body).getBytes("UTF-8");
          var encodings = headers.get("Content-Encoding");
          if (encodings && encodings.indexOf("gzip") > -1) {
            console.log("will zip");
            var baos = new java.io.ByteArrayOutputStream();
            var gzipos = new java.util.zip.GZIPOutputStream(baos);
            gzipos.write(bBody);
            gzipos.finish();
            gzipos.close();
            bBody = baos.toByteArray();
            baos.close();
            }
          }

        message = command + CRLF;
        headers.set("Server", SERVER_DESCRIPTION);
        headers.set("Date", (new Date()).toGMTString());
        headers.set("Content-Length", "" + (bBody?bBody.length:-1));
        message += headers.toHttp();
        message += CRLF;
        bMessage = new java.lang.String(message).getBytes("UTF-8");
        outputStream.write(bMessage);
        if (bBody) {
          outputStream.write(bBody);
          }
        };


      this.load = () => {
        command = readLine(inputStream);
        if (!command) return;
        command = command.trim();
        headers = new Headers();
        headers.getFromHttpInputStream(inputStream);
        var contentLength = Number(headers.getFirst("Content-Length"));
        if (contentLength > 0) {
          var isGzip = false;
          var contentEncoding = headers.getFirst("Content-Encoding");

          var ba = (new java.lang.String("*".repeat(contentLength))).getBytes("UTF-8");
          var l = inputStream.read(ba, 0, contentLength);
          if (contentEncoding && contentEncoding.equals("gzip")) {
            var gzipInput = new java.io.BufferedReader(
              new java.io.InputStreamReader(
                new java.util.zip.GZIPInputStream(
                  new java.io.ByteArrayInputStream(
                    ba
                    )
                  )
                )
              );
            var sb = new java.lang.StringBuilder();
            var line;
            while(line = gzipInput.readLine()) {
              sb.append(line);
              sb.append('\n');
              }
            body = sb.toString();
            } else {
            body = "" +  new java.lang.String(ba);
            }
          }
        };
      this.toString = () => {
        var s = "MessageBuilder::{" + [
            command
            , headers
            , body
            ]
          + "}::MessageBuilder";
        return s;
        }
      }

    Lourah.http.util.buildResponse = (outputStream) => {
      var mb = new MessageBuilder();
      mb.setOutputStream(outputStream);
      return mb;
      }

    Lourah.http.util.buildRequest = (inputStream) => {
      var mb = new MessageBuilder();
      mb.setInputStream(inputStream);
      return mb;
      }
    })();
