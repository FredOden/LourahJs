var Lourah = Lourah || {};
(function () {
    Lourah.io = Lourah.io || {};

    if (!Lourah.io.string2OutputStream) {

      function string2OutputStream(string, outputStream, encoding) {
        var writer = null;

        try {
          writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(
              outputStream, encoding ? encoding :"utf-8"));
          writer.write(string);
          } catch (e) {
          // Report
          Activity.reportError("string2Path::" + path + "::" + e + "::" + e.stack);
          } finally {
          try {writer.close();} catch (e) {/*ignore*/}
          }
        }
      
      function string2Path(string, path, encoding) {
        string2OutputStream(string, new java.io.FileOutputStream(path), encoding);
        }

      Lourah.io.string2OutputStream = string2OutputStream;
      Lourah.io.string2Path = string2Path;
      }

	if (!Lourah.io.inputStream2String) {
		Lourah.io.inpuStream2String = Activity.inputStream2String;
		Lourah.io.path2Stream = Activity.path2Stream;
	}

	if (!Lourah.io.inputStream2Object) {
		function inputStream2Object(inputStream) {
			return Function("return " + Lourah.io.inputStream2String(inputStream))();
		}
		function path2Object(path) {
			return Function("return " + Lourah.io.path(inputStream))();
		}
		Lourah.io.inputStream2Object = inputStream2Object;
		Lourah.io.path2Object = path2Object;
	}

    })();
