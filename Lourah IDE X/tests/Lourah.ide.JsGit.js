/**
JsGit : Using JGit for Lourah ide

By: fred.oden@gmail.com - 20210210
**/
var Lourah = Lourah || {};
try {
  (function () {
      Lourah.ide = Lourah.ide || {};
      if (Lourah.ide.JsGit) return;

      const jGit = {
        dex:"org.eclipse.jgit-5.10.0.202012080955-r.dex.jar"
        ,jar:"org.eclipse.jgit-5.10.0.202012080955-r.jar"
        ,location: Lourah.jsFramework.parentDir() + "/libs/"
        };

      const JGIT = {};

      console.log("jGit::" + jGit.location + jGit.jar);

      try {
        //let u = new java.net.URL("file:" + jGit.location + jGit.jar);
        let fJar = new java.io.File(jGit.location + jGit.jar);
        let fDex = new java.io.File(jGit.location + jGit.dex);
        let jarFile = new java.util.jar.JarFile(fJar);
        let loader = Packages.dalvik.system.DexClassLoader(fDex.getPath(), null, jGit.location, fJar.getClass().getClassLoader());
        let e = jarFile.entries();
        let loadedClasses = [];

        function __walk(obj, t, cn) {
          if (t.length === 1) {
            try {
               obj[t[0]] = java.lang.Class.forName(cn, false,  loader); //.loadClass(cn);
              }
            catch (e) {
              console.log("__walk::" + e);
              }
            //loadedClasses.push(obj[t[0]]);
            return;
            }
          if (!obj[t[0]]) {
            obj[t[0]] = {};
            }
          __walk(obj[t[0]], t.slice(1), cn);
          }

        while(e.hasMoreElements()) {
          let je = e.nextElement();

          if (je.isDirectory() || !je.getName().endsWith(".class")) {
            if (je.isDirectory()) {
              //console.log("::::" + je.getName());

              }
            continue;
            }
          let className = je.getName().substring(0, je.getName().length() - 6).replace('/', '.');
          let tree = ("" + className).split('.');
          //console.log("::::" + className);
          __walk(JGIT, tree, className);
          }
        
        console.log("loadedClasses::" +  loadedClasses.length);
        /*
        loadedClasses.forEach((item, i) => {
            console.log(
              "::::" + i
              + "::'" + item + "'"
              );
            })
        /**/

        /**
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        !!REMEMBER: Use CLASS.getConstructor().newInstance to create an object of imported CLASS!!
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        **/

        //console.log("jsgit::" + JSON.stringify(jsgit));
        let builder = JGIT.org.eclipse.jgit.storage.file.FileRepositoryBuilder.newInstance();
        let gitDir = new java.io.File(Lourah. jsFramework. dir() + "/.git")
        console.log("gitDir::'" + gitDir + "'::" + gitDir.exists());

        /*
        let repository = builder.setGitDir(gitDir) // [[[[[[[[[
                          .readEnvironment()
                          .findGitDir()
                          .build(); //]]]]]]]]]
        /**/
        builder.setGitDir(gitDir);
        builder.readEnvironment();
        //builder.findGitDir();
        //let  = builder.build();

        /*
        console.log("JGIT.org.eclipse.jgit.api.Git::" + JGIT.org.eclipse.jgit.api.Git);
        let fields = JGIT.org.eclipse.jgit.api.Git.getMethods();
        console.log("fields::length::" + fields.length);
        for (var i = 0; i < fields.length; i++) {
          console.log("::::" + fields[i]);
          }
        /**/
       let git = JGIT.org.eclipse.jgit.api.Git["open(java.io.File)"](gitDir); //.getConstructor().newInstance(null);
        }
      catch(e) {
        console.log("Lourah.ide.JsGit::error::" + e + "::" + e.stack);
        }

      })();
  } catch(e) {
  console.log("Lourah.ide.JsGit::" + e + "::" + e.stack);
  }
