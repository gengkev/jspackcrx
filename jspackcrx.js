/**
 * @fileoverview The main script loaded into pages using JSPackCrx.
 *   It loads scripts and adds the generateCRX function to JSZip.
 * @author gengkev@gmail.com
 */


(function(){
if (!window.Worker) {
  throw new Error("Web Workers are not supported");
  return;
}

var libdir = "/libs/";

if (typeof libdir=="undefined") libdir=(location.protocol=="https")?"https":"http"+"://jspackcrx.googlecode.com/svn/trunk/libs/";
else if (!libdir.test(///$/)) libdir+="/";

//load script.js
(function(d,s){var t=d.createElement(s);f=d.getElementsByTagName(s)[0];t.async=!!t.type='text/javascript';
  t.src=libdir+"script.min.js";t.onload=function(){
    $script(libdir+"jszip.min.js");
	(loadDeflate)?$script(libdir+"jszipdeflate.min.js");
  }
  f.parentNode.insertBefore(t,f);
})(document,'script');


function JSCrx() {
  this.zip={};
  this.zip.string="";

  this.privateKey={};
  this.privateKey.string="";
  // this.privateKey.pem="";

  this.publicKey={};
  this.publicKey.modulus="";
  this.publicKey.exponent=0;
  this.publicKey.der="";

  this.sign={};
  this.sign.string="";
  this.sign.der="";

  this.worker = new Worker("worker.js");
  this.worker.postMessage({name:"Hello World!"});

  this.worker.onmessage=function(e) {
    switch(e.name) {
      case "World Hello!":
        break;
      case "generateRSAKey":
        this.publicKey.modulus = e.modulus;
        break;
      default:
        break;
  }
}
JSCrx.prototype.generateRSAKey = function(exponent) {
  if (exponent!==65537) throw new Error("Exponent not supported");
  
  this.worker.postMessage({name:"generateRSAKey",exponent:65537});
}
JSCrx.prototype.formatRSAKey = function() {
  if (!this.publicKey.modulus) throw new Error("Modulus must be generated!");

  this.worker.postMessage({name:"formatRSAKey",modulus:this.publicKey.modulus});
}
JSCrx.prototype.addZip = function(zipString,encoding) {
  var rawZip="";

  switch(encoding) {
    case "hex":
      break;
    case "base64":
      break;
    case "raw":
    default:
      rawZip = zipString;
      break;
  }

  this.zip.string = rawZip;
}
JSCrx.prototype.signZip = function() {
  if (!this.private

JSZip.prototype.generateCRX=function(asBytes,zipFile,pemFile,callback)
  //create RSA key, sign, append header, callback
  var worker=new Worker("genrsa.js");
  worker.onmessage=function(evt){
  switch(evt.name) {
    case "loadready":
	  worker.postMessage({name:"libdir",message:libdir});
	  break;
	case "processready":
	  worker.postMessage({name:"generateRSAKey",message:{
	    message:pemFile
	  }});
	  break;
	case "beginrsakeygen":
	  break;
	default:
	  break;
  }
  }
  
}

});