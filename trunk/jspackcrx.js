/**
 * @fileoverview The main script loaded into pages using JSPackCrx.
 *   It loads scripts and adds the generateCRX function to JSZip.
 * @author gengkev@gmail.com
 */

// 
(function(){
if (!window.Worker) {
  throw new Error("Web Workers are not supported");
  return;
}


if (typeof libdir=="undefined") libdir=(location.protocol=="https")?"https":"http"+"://jspackcrx.googlecode.com/svn/trunk/libs/";
else if (!libdir.test(///$/)) libdir+="/";

var callbackStack = [];
function callbackRun(callback,_this) {
  if (!callback || !callbackStack[callback]) return;

  callbackStack[callback].call(_this);

  callbackStack[callback] = undefined;
}


function JSCrx() {
  this.zip={};
  this.zip.string="";

  this.privateKey={};
  // this.privateKey.string="";
  // this.privateKey.pem="";
  this.privateKey.der="";

  this.publicKey={};
  // this.publicKey.modulus="";
  // this.publicKey.exponent=0;
  this.publicKey.der="";

  this.sign={};
  // this.sign.string="";
  this.sign.der="";

  this.crx = {};
  this.crx.string = "";
  this.crx.hex = "";
  this.crx.base64 = "";

  this.worker = new Worker("worker.js");
  this.worker.postMessage({name:"Hello World!"});

  this.worker.onmessage=function(e) {
    switch(e.name) {
      case "World Hello!":
        break;
      case "generateRSAKey":
        // this.publicKey.modulus = e.modulus;
        // this.publicKey.exponent = e.exponent;
        this.publicKey.der = e.publicKey;
        this.privateKey.string = e.privateKey;
        callbackRun(e.callback,this);
        break;
      case "generateSignature":
        this.sign.der = e.der;
        callbackRun(e.callback,this);
      default:
        break;
  }
}
JSCrx.prototype.libdir = "http://jspackcrx.googlecode.com/svn/trunk/libs/";
JSCrx.prototype.add = {};
JSCrx.prototype.generate = {};

JSCrx.prototype.add.zip = function(zipString,encoding) {
  var rawZip="";

  switch(encoding) {
    case "hex":
      break;
    case "base64":
      break;
    case "string":
    default:
      rawZip = zipString;
      break;
  }

  this.zip.string = rawZip;
  return this;
}
JSCrx.prototype.generate.privateKey = function(options,callback) {
  callbackStack.push(callback);
  this.worker.postMessage({
    name:"generatePrivateKey",
    exponent:65537,
    callback:callbackStack.length
  });
}
JSCrx.prototype.generate.signature = function(options,callback) {
  if (!this.privateKey.der) throw new Error("Need private key in order to sign");
  else if (!this.zip.string) throw new Error("Need zip file in order to sign");

  callbackStack.push(callback);
  this.worker.postMessage({
    name:"generateSignature",
    privateKey:this.privateKey.der,
    zip:this.zip.string,
    callback:callbackStack.length;
  });
}
JSCrx.prototype.generate.crx = function(format,callback) {
  if (!this.publicKey.der) throw new Error("Need public key in order to package");
  else if (!this.sign.der) throw new Error("Need signature in order to package");
  else if (!this.zip.string) throw new Error("Need zip file in order to sign");

  callbackStack.push(callback);
  this.worker.postMessage({
    name:"generateCrx",
    publicKey:this.publicKey.der,
    signature:this.sign.der,
    zip:this.zip.string,
    callback:callbackStack.length;
  });
}

/*
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
*/

window.JSCrx = JSCrx;
});
