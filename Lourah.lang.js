var Lourah = Lourah || {};
Lourah.lang = Lourah.lang || {};

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(
  function(name) {
    Lourah.lang['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']'; 
      }; 
    }
  );

//console.log("window::" + Lourah.isRegExp(/hel/));
