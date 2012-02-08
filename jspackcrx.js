/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */

/**
 * @fileoverview The main script loaded into pages using JSPackCrx.
 *   It loads scripts and adds the generateCRX function to JSZip.
 * @author gengkev@gmail.com
 */

// 
;(function(){

/* Requirements:
 * Worker
 * opt.: FileReader, Blob, (Webkit|Moz|)BlobBuilder
 */
//lets not do anything just yet...
var support = {
  worker: !!window.Worker,
  filereader: window.File && window.Blob && window.FileList && window.FileReader,
  blobbuilder: !!window.BlobBuilder || !!window.MozBlobBuilder || !!window.WebKitBlobBuilder;
}
var callbackStack = [];
function callbackRun(callback,_this) {
  if (!callback || !callbackStack[callback]) return;

  callbackStack[callback].call(_this);

  callbackStack[callback] = undefined;
}


function JSCrx() {
  this.zip={};
  this.zip.string="";
  //this.zip.blob = null;

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
  this.worker.postMessage({name:"Hello World!",libdir:JSCrx.libdir});

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
JSCrx.libdir = (location.protocol=="https")?"https":"http" +
               "://jspackcrx.googlecode.com/svn/trunk/libs/";

JSCrx.prototype.add = {};
JSCrx.prototype.generate = {};

JSCrx.prototype.add.zip = function(zipData,encoding) {
  //var rawZip="";

  switch(encoding) {
    case "blob":
    case "file":
      var reader = new FileReader();
      reader.onload = function() {
        this.zip.string = e.target.result;
      }
      reader.readAsBinaryString(); //???
      break;
    case "typedarray":
      var buffer = zipData.buffer || zipData;
      this.zip.string = String.fromCharCode.call(null,new Uint8Array(zipData));
      break;
    case "base64":
      this.zip.string = window.btoa(zipData);
      break;
    case "string":
    default:
      this.zip.string = zipData;
      break;
  }

  //this.zip.string = rawZip;
  return this;
}
JSCrx.prototype.generate.privateKey = function(options,callback) {
  callbackStack.push(callback);
  this.worker.postMessage({
    name: "generatePrivateKey",
    exponent: options.exponent || 3,
    callback: callbackStack.length
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
