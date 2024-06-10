
var d = (new Lourah.android.Overview({
	sv : {
		class : "android.widget.ScrollView"
		,content : {
			tv : {
				class : "android.widget.TextView"
				,attributes : {
					setText : "'text viee'"
					}
				}
			}
		}
	})).$();


function LourahDialog(title, view, positiveHandler, negativeHandler) {
    var builder = new android.app.AlertDialog.Builder(Activity);
    builder.setTitle(title)
           .setView(view)
           .setPositiveButton("Ok", {
               
               onClick: (dialog, id) => {
                   // sign in the user ...
                   positiveHandler(dialog, id);
               }
           })
           .setNegativeButton( "cancel", {
               onClick: (dialog, id) => {
                   //LoginDialogFragment.this.getDialog().cancel();
                   negativeHandler(dialog, id);
               } 
           });
    builder.show();
	}

ld = LourahDialog("test", d.sv);

