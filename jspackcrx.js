/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */

/* This script should probably be compiled by running build.js on
 * top of Node (see nodejs.org). However, it will still run as long
 * as you have worker.js and all of the libraries listed in INCLUDE
 * comments. kthxbye
 */


var JSCrx = (function(workerCode){

//lets not do anything just yet...
var support = {
	worker: !!window.Worker,
	filereader: window.File && window.Blob && window.FileList && window.FileReader,
	blobbuilder: !!window.BlobBuilder || !!window.MozBlobBuilder || !!window.WebKitBlobBuilder
};
var callbackStack = [];
function callbackRun(callback,_this) {
	if (callbackStack[callback]) {
		callbackStack[callback].call(_this);
		callbackStack[callback] = undefined;
	}
}
function addCallback(callback) {
	for (var i=0;i<=callbackStack.length;++i) { //index callbackStack.length will always be available
		if (typeof callbackStack[i] === "undefined") {
			callbackStack[i] = callback;
			break;
		}
	}
	return i;
}

function JSCrx() {
	if (this === window) { return new JSCrx(); }
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
	//this.crx.string = "";
	//this.crx.hex = "";
	//this.crx.base64 = "";

	this.worker = new Worker(workerCode);
	this.worker.onerror = function(e) { throw e; };

	this.worker.onmessage=(function(_this){
		return function(e) {
		switch(e.data.name) {
			case "generatePrivateKeySign":
				// _this.publicKey.modulus = e.data.modulus;
				// _this.publicKey.exponent = e.data.exponent;
				_this.publicKey.der = e.data.publicKey;
				// this.privateKey.string = e.data.privateKey;
				_this.sign.der = e.data.sign;
				callbackRun(e.data.callback,_this);
				break;
			//case "generateSignature":
			//	_this.sign.der = e.data.der;
			//	callbackRun(e.data.callback,_this);
			case "generateCRX":
				_this.crx.header = e.data.crxHeader;
				callbackRun(e.data.callback,_this);
				break;
			default:
				break;
		}
		};
	}(this));
}


JSCrx.prototype.addZip = function(zipData,encoding) {

	switch(encoding) {
		case "blob":
		case "file":
			var reader = new FileReader();
			reader.onload = function(e) {
				this.zip.string = e.target.result;
			};
			reader.readAsBinaryString();
			break;
		case "typedarray":
			var buffer = zipData.buffer || zipData;
			this.zip.string = String.fromCharCode.call(null,new Uint8Array(zipData));
			break;
		case "base64":
			this.zip.string = window.btoa(zipData);
			break;
		case "string":
			this.zip.string = zipData;
			break;
		default:
			this.zip.string = zipData.toString();
			break;
	}

	return this;
};
JSCrx.prototype.generatePrivateKeySignature = function(options,callback) {
	if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }

	var callbackIndex = addCallback(callback);
	this.worker.postMessage({
		name: "generatePrivateKeySign",
		exponent: options.exponent || 65537,
		zip: this.zip.string,
		callback: callbackIndex
	});
};
JSCrx.prototype.generateCrx = function(format,callback) {
	if (!this.publicKey.der) { throw new Error("Need public key in order to package"); }
	else if (!this.sign.der) { throw new Error("Need signature in order to package"); }
	else if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }

	var callbackIndex = addCallback(callback);
	this.worker.postMessage({
		name:"generateCrx",
		publicKey:this.publicKey.der,
		signature:this.sign.der,
		// zip:this.zip.string,
		callback:callbackIndex
	});
};
JSCrx.prototype.terminate = function(){
	//try {
		this.worker.terminate();
	//	this = null;
	//} catch(e) { } //swallowed! because it doesn't really matter
};

return JSCrx;

})(function(){

function worker() {
/* INSERT libs/jsbn.mod.js */
/* INSERT libs/jsbn2.mod.js */
/* INSERT libs/rng.min.js */
/* INSERT libs/rsa.mod.js */
/* INSERT libs/rsa2.mod.js */
/* INSERT libs/sha1.js */
/* INSERT libs/rsa-sign.mod.js */

/* INSERT worker.js */
}
function stringToObjectUrl(string) {
	function createBlobBuilder() {
		try { return new BlobBuilder(); } catch(e) {}
		try { return new WebKitBlobBuilder(); } catch(e) {}
		try { return new MozBlobBuilder(); } catch(e) {}
		throw new Error("No BlobBuilder support");
	}
	
	function makeObjectURL(f){
		try { return window.URL.createObjectURL(f); } catch(e) {}
		try { return window.webkitURL.createObjectURL(f); } catch(e) {}
		try { return window.createObjectURL(f); } catch(e) {}
		try { return window.createBlobURL(f); } catch(e) {}
		throw new Error("No support for creating object URLs");
	}
	
	var bb = createBlobBuilder();
	var array = new Uint8Array(string.split("").map(function(el) {
		return el.charCodeAt(0);
	}));
	bb.append(array.buffer);
	return makeObjectURL(bb.getBlob());
}
var debug = false; /**/ debug = true; /**/ // will be removed by compiler

if (debug) return "worker.js";
else return stringToObjectUrl("(" + worker.toString() + "())");
}());
