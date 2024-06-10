var Lourah = Lourah || {};
(function() {
    Lourah.util = Lourah.util || {};

    Lourah.util.Zip = function(zipName) {
      var zipFile = new Packages.java.util.jar.JarFile(zipName);

      this.list = () => {
        var ret = [];
        var entries = zipFile.entries();
        while(entries.hasMoreElements()) {
          var entry = entries.nextElement();
          ret.push(entry);
          }
        return ret;
        };

      this.unzip = (hDirectory, hFile) => {
        var entries = this.list();
        entries.forEach(e => e.isDirectory()?hDirectory(e):hFile(e));
        };

      this.readManifest = () => {
        var is = zipFile.getInputStream(zipFile.getEntry("AndroidManifest.xml"));
        var xml = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, is.available());
        var br = is.read(xml);
        return decompressXML(xml);
        };
      };



    /*
    * To change this license header, choose License Headers in Project Properties.
    * To change this template file, choose Tools | Templates
    * and open the template in the editor.
    */
    /**
    * Binary XML doc ending Tag
    */

    var endDocTag = 0x00100101;

    /**
    * Binary XML start Tag
    */
    var startTag =  0x00100102;

    /**
    * Binary XML end Tag
    */
    var endTag =    0x00100103;


    /**
    * Reference var for spacing
    * Used in prtIndent()
    */
    var spaces = "                                             ";


    /**
    * Parse the 'compressed' binary form of Android XML docs
    * such as for AndroidManifest.xml in .apk files
    * Source: http://stackoverflow.com/questions/2097813/how-to-parse-the-androidmanifest-xml-file-inside-an-apk-package/4761689#4761689
    *
    * @param xml Encoded XML content to decompress
    */
    function decompressXML(xml) {

      var resultXml = "";

      // Compressed XML file/bytes starts with 24x bytes of data,
      // 9 32 bit words in little endian order (LSB first):
      //   0th word is 03 00 08 00
      //   3rd word SEEMS TO BE:  Offset at then of StringTable
      //   4th word is: Number of strings in string table
      // WARNING: Sometime I indiscriminently display or refer to word in
      //   little endian storage format, or in integer format (ie MSB first).
      var numbStrings = LEW(xml, 4*4);

      // StringIndexTable starts at offset 24x, an array of 32 bit LE offsets
      // of the length/string data in the StringTable.
      var sitOff = 0x24|0;  // Offset of start of StringIndexTable

      // StringTable, each string is represented with a 16 bit little endian
      // character count, followed by that number of 16 bit (LE) (Unicode) chars.
      var stOff = sitOff + numbStrings*4;  // StringTable follows StrIndexTable

      // XMLTags, The XML tag tree starts after some unknown content after the
      // StringTable.  There is some unknown data after the StringTable, scan
      // forward from this point to the flag for the start of an XML start tag.
      var xmlTagOff = LEW(xml, 3*4);  // Start from the offset in the 3rd word.
      // Scan forward until we find the bytes: 0x02011000(x00100102 in normal int)
      for (var ii=xmlTagOff; ii<xml.length-4; ii+=4) {
        if (LEW(xml, ii) === startTag) {
          xmlTagOff = ii;  break;
          }
        } // end of hack, scanning for start of first start tag

      // XML tags and attributes:
      // Every XML start and end tag consists of 6 32 bit words:
      //   0th word: 02011000 for startTag and 03011000 for endTag
      //   1st word: a flag?, like 38000000
      //   2nd word: Line of where this tag appeared in the original source file
      //   3rd word: FFFFFFFF ??
      //   4th word: StringIndex of NameSpace name, or FFFFFFFF for default NS
      //   5th word: StringIndex of Element Name
      //   (Note: 01011000 in 0th word means end of XML document, endDocTag)

      // Start tags (not end tags) contain 3 more words:
      //   6th word: 14001400 meaning??
      //   7th word: Number of Attributes that follow this tag(follow word 8th)
      //   8th word: 00000000 meaning??

      // Attributes consist of 5 words:
      //   0th word: StringIndex of Attribute Name's Namespace, or FFFFFFFF
      //   1st word: StringIndex of Attribute Name
      //   2nd word: StringIndex of Attribute Value, or FFFFFFF if ResourceId used
      //   3rd word: Flags?
      //   4th word: str ind of attr value again, or ResourceId of value

      // TMP, dump string table to tr for debugging
      //tr.addSelect("strings", null);
      //for (int ii=0; ii<numbStrings; ii++) {
        //  // Length of string starts at StringTable plus offset in StrIndTable
        //  String str = compXmlString(xml, sitOff, stOff, ii);
        //  tr.add(String.valueOf(ii), str);
        //}
      //tr.parent();

      // Step through the XML tree element tags and attributes
      var off = xmlTagOff;
      var indent = 0;
      var startTagLineNo = -2;
      while (off < xml.length) {
        var tag0 = LEW(xml, off);
        //int tag1 = LEW(xml, off+1*4);
        var lineNo = LEW(xml, off+2*4);
        //int tag3 = LEW(xml, off+3*4);
        var nameNsSi = LEW(xml, off+4*4);
        var nameSi = LEW(xml, off+5*4);

        if (tag0 === startTag) { // XML START TAG
          var tag6 = LEW(xml, off+6*4);  // Expected to be 14001400
          var numbAttrs = LEW(xml, off+7*4);  // Number of Attributes to follow
          //int tag8 = LEW(xml, off+8*4);  // Expected to be 00000000
          off += 9*4;  // Skip over 6+3 words of startTag data
          var name = compXmlString(xml, sitOff, stOff, nameSi);
          //tr.addSelect(name, null);
          startTagLineNo = lineNo;

          // Look for the Attributes
          var sb = "";
          for (var ii=0; ii<numbAttrs; ii++) {
            var attrNameNsSi = LEW(xml, off);  // AttrName Namespace Str Ind, or FFFFFFFF
            var attrNameSi = LEW(xml, off+1*4);  // AttrName String Index
            var attrValueSi = LEW(xml, off+2*4); // AttrValue Str Ind, or FFFFFFFF
            var attrFlags = LEW(xml, off+3*4);
            var attrResId = LEW(xml, off+4*4);  // AttrValue ResourceId or dup AttrValue StrInd
            off += 5*4;  // Skip over the 5 words of an attribute

            var attrName = compXmlString(xml, sitOff, stOff, attrNameSi);
            var attrValue = attrValueSi!==-1
            ? compXmlString(xml, sitOff, stOff, attrValueSi)
            : "resourceID 0x"+ (attrResId>>>0).toString(16);
            sb += " "+attrName+"=\""+attrValue+"\"";
            //tr.add(attrName, attrValue);
            }
          resultXml += prtIndent(indent, "<"+name+sb+">");
          indent++;

          } else if (tag0 === endTag) { // XML END TAG
          indent--;
          off += 6*4;  // Skip over 6 words of endTag data
          var name = compXmlString(xml, sitOff, stOff, nameSi);
          resultXml += prtIndent(indent, "</"+name+">  (line "+startTagLineNo+"-"+lineNo+")");
          //tr.parent();  // Step back up the NobTree

          } else if (tag0 === endDocTag) {  // END OF XML DOC TAG
          break;

          } else {
          Activity.reportError("decompressXML::" + "  Unrecognized tag code '"+tag0.toString(16)
            +"' at offset "+off);
          break;
          }
        } // end of while loop scanning tags and attributes of XML tree
      Activity.reportError("decompressXML::" + "    end at offset "+off);

      return resultXml;
      } // end of decompressXML


    /**
    * Tool Method for decompressXML();
    * Compute binary XML to its string format
    * Source: Source: http://stackoverflow.com/questions/2097813/how-to-parse-the-androidmanifest-xml-file-inside-an-apk-package/4761689#4761689
    *
    * @param xml Binary-formatted XML
    * @param sitOff
    * @param stOff
    * @param strInd
    * @return String-formatted XML
    */
    function compXmlString(xml, sitOff, stOff, strInd) {
      if (strInd < 0) return null;
      var strOff = stOff + LEW(xml, sitOff+strInd*4);
      return compXmlStringAt(xml, strOff);
      }


    /**
    * Tool Method for decompressXML();
    * Apply indentation
    *
    * @param indent Indentation level
    * @param str String to indent
    * @return Indented string
    */
    function prtIndent(indent, str) {

      return (spaces.substr(0, Math.min(indent*2, spaces.length))+str+"\n");
      }


    /**
    * Tool method for decompressXML()
    * Return the string stored in StringTable format at
    * offset strOff.  This offset points to the 16 bit string length, which
    * is followed by that number of 16 bit (Unicode) chars.
    *
    * @param arr StringTable array
    * @param strOff Offset to get string from
    * @return String from StringTable at offset strOff
    *
    */
    function compXmlStringAt(arr, strOff) {
      var strLen = arr[strOff+1]<<8&0xff00 | arr[strOff]&0xff;
      var chars = "";
      for (var ii=0; ii<strLen; ii++) {
        chars += String.fromCharCode(arr[strOff+2+ii*2]);
        }
      return chars;  // Hack, just use 8 byte chars
      } // end of compXmlStringAt


    /**
    * Return value of a Little Endian 32 bit word from the byte array
    *   at offset off.
    *
    * @param arr Byte array with 32 bit word
    * @param off Offset to get word from
    * @return Value of Little Endian 32 bit word specified
    */
    function LEW(arr, off) {
      return arr[off+3]<<24&0xff000000 | arr[off+2]<<16&0xff0000
      | arr[off+1]<<8&0xff00 | arr[off]&0xFF;
      } // end of LEW

    Activity.reportError("Zip::Loaded::" + JSON.stringify(Lourah));

    })();
