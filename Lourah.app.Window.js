var Lourah = Lourah || {};
(function () {
    Lourah.app = Lourah.app || {};
    if (Lourah.app.Window) return;
    Lourah.app.Window = function Window(activity) {
      var dialog;
      var backButtonListener;

      var contentView;
      
      var builder;
      var context = {};
      
      this.getContext = () => context;

      this.setOnBackButtonListener = (f) => {
        try {
          // console.log("__setOnBackButtonListener::" + f);
          var bbl = {
            onKey: (d, keyCode, keyEvent) => {
              //console.log("cancelListener::call::" + f);
              if (keyCode === android.view.KeyEvent.KEYCODE_BACK
                && keyEvent.getAction() !== android.view.KeyEvent.ACTION_DOWN) {
                if (!f()) {
                  dialog.cancel();
                  //console.log("cancelListener::called::false");
                  return false;
                  } else {
                  //console.log("cancelListener::called:;true");
                  return true;
                  }
                }
              //console.log("cancelListener::called");
              return true;
              }
            };
          if (shown) dialog.setOnKeyListener(bbl);
          else backButtonListener = bbl;
          } catch(e) {
          console.log("AvtivityEmulator::__setOnBackButtonListener::error::" + e);
          }
        }
      
      // default is to collapse the window
      this.setOnBackButtonListener(() => false);

      this.init = () => {
        if (builder) return;
        builder = new android.app.AlertDialog.Builder(activity, android.R.style.Theme_DeviceDefault_DialogWhenLarge);
        }
      //_dialog = builder.create();

      this.setTitle = title => {
        this.init();
        builder.setTitle(title);
        return this;
        }
      
      this.setContentView = view => {
        this.init();
        if (contentView) {
          contentView.getParent().removeView(contentView);
          dialog.setContentView(view);
          //console.log("dialog.setContentView");
          } else {
          builder.setView(view)
          //console.log("bulder.setView");
          }
        contentView = view;
        return this;
        }
      
      this.getBuilder = () => builder;
      this.setButton = button => {
        builder[button.getKind()](
          button.getText()
          ,{
            onClick : (dialog, id) => {
              try {
                button.getOnClick()(this, button, dialog, id);
                } catch(e) {
                console.log("onClick::error::" + e + "::" + e.stack);
                }
              }
            }
          );
        };

      var shown = false;

      this.show = (f) =>  {
        if (contentView) {
          try {
            if (!dialog) dialog = builder.create();
            if (f) {
              f(this);
              }
            dialog.show();
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.background_light);
            if (!shown && backButtonListener) dialog.setOnKeyListener(backButtonListener);
            shown = true;
            try {
              //android.os.Looper.loop();
              } catch(ee) {
              //console.log("show::ee::" + ee);
              }
            } catch(e) {
            console.log("encapsulator::ActivityEmulator::show::error::" + e);
            }
          }
        }


      };
    })();
