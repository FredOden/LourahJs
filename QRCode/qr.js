
Activity.importScript(
  Lourah.jsFramework.parentDir()
  + "/Lourah.android.Overview.js"
  );


Activity.importScript(
    Lourah.jsFramework.dir()
    + "/Lourah.utils.qr.QRCode.js"
    );
  
  


var $screen = Lourah.android.Overview.buildFromSugar({
    $top: {
      class: android.widget.LinearLayout
      ,setOrientation: android.widget.LinearLayout.VERTICAL
      ,$lVersion : {
        class: android.widget.LinearLayout
        ,setOrientation: android.widget.LinearLayout.HORIZONTAL
        ,$eVersion: {
          class: android.widget.EditText
          , setText: "'2'"
          //, setInputType: android.text.InputType.TYPE_CLASS_NUMBER
          , setEnabled: true
          , setWidth: 100
          }
        }
      ,$bDrawQR: {
        class: android.widget.Button
        ,setText: "'Draw'"
        ,setOnClickListener: {
          onClick: drawQR
          }
        }
      ,$bComputeQR: {
        class: android.widget.Button
        ,setText: "'Compute'"
        ,setOnClickListener: {
          onClick: computeQR
          }
        }
      ,$sv: {
        class: android.widget.ScrollView
        ,$qr: {
          class: android.widget.ImageView
          }
        }
      }
    });

var qr;

function drawQR() {
  try {
    qr = new Lourah.utils.qr.QRCode(Number($screen.$eVersion.getText()));
    qr.draw($screen.$qr);
    } catch(e) {
    console.log("drawQR::" + e);
    }
  }

function computeQR() {
  try {
    qr.computeBytes();
    qr.draw($screen.$qr);
    } catch(e) {
    console.log("computeQR::" + e);
    }
  }

Activity. setTitle("Lourah QR Generator");
Activity. setContentView($screen.$top);

Lourah.jsFramework.setOnBackButtonListener(() => {
    return false;
    });


drawQR();






/**/
