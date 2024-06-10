var Lourah = Lourah || {};
( function () {
    Lourah. widget = Lourah. widget || {};
    if (android.widget.AutoCompleteTextView) return;
    function AutoCompleteTextView() {};
    AutoCompleteTextView.Handler = function (tokenizer) {
      var arrayList = new java.util.ArrayList();
      this. toString = () => {
        var toString = tokenizer
        ? "android.widget.MultiAutoCompleteTextView"
        : "android.widget.AutoCompleteTextView"
        ;
        return toString; 
        };
      this.getArrayList = () => { return arrayList; };
      
      }
    })();