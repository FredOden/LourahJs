(function () {
    Lourah.utils = Lourah.utils || {};
    Lourah.utils.qr = Lourah.utils.qr || {};
    if (Lourah.utils.qr.Tables) return;

    Lourah.utils.qr.Tables = function () {
      }


    Lourah.utils.qr.Tables.Type = {
      NUMERIC:0
      ,ALPHANUMERIC:1
      ,BYTE:2
      ,KANJI:3
      };

    Lourah.utils.qr.Tables.Capacities = {
      L: [
        [ 41, 25, 17, 10] // 1
        ,[77, 47, 32, 20]
        ,[127,77, 53, 32]
        ,[187,114,78,48]
        ,[255,154,106,65] // 5
        ,[322,195,134,82]
        ,[370,224,154,95] 
        ]
      ,M: {
        }
      ,Q: {
        }
      ,H: {
        }
      }
    
    
    var errorCorrections = ["L", "M", "Q", "H" ];

    var errorCorrectionLevels = {
      }

    for(var v = 1; v < 41; v++) {
      for(ec = 0; ec < errorCorrections.length; ec++) {
        errorCorrectionLevels[errorCorrections[ec] + v] = {
          integrity: {
            version: v
            ,errorCorrection: ec
            }
          };
        }
      }

    //console.log("errorCorrectionLevels::" + JSON.stringify(errorCorrectionLevels));

    errorCorrectionLevels.L1.C = [41, 25, 17, 10];

    }) ();
