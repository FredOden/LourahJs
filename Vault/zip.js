var Lourah = Lourah || {};

( function () {

    Lourah.util = Lourah.util || {};
    Lourah.util.zip = Lourah.util.zip || {};
    if (Lourah.util.zip.Zip) return;
    
    function zipFolder(srcFolder, destZipFile) {
      var fileWriter = new java.io.FileOutputStream(destZipFile);
      var zip = new java.util.zip.ZipOutputStream(fileWriter);
      addFolderToZip("", srcFolder, zip);
      zip.flush();
      zip.close();
      }

    function addFileToZip(path, srcFile, zip) {
      var folder = new java.io.File(srcFile);
      if (folder.isDirectory()) {
        addFolderToZip(path, srcFile, zip);
        } else {
        var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
         // new java.lang.byte[1024];
        var len;
        var input = new java.io.FileInputStream(srcFile);
        zip.putNextEntry(new java.util.zip.ZipEntry(path + "/" + folder.getName()));
        while ((len = input.read(buf)) > 0) {
          zip.write(buf, 0, len);
          }
        }
      }

    function addFolderToZip(path, srcFolder, zip) {
      var folder = new java.io.File(srcFolder);
      var list = folder.list();
      for (var i = 0; i < list.length(); i++) {
        filename = list[i];
        if (path.equals("")) {
          addFileToZip(folder.getName(), srcFolder + "/" + fileName, zip);
          } else {
          addFileToZip(path + "/" + folder.getName(), srcFolder + "/"
            + fileName, zip);
          }
        }
      }
    
    Lourah.util.zip.Zip = function () {
      }
    })();
