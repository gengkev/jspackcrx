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
callbackStack.run = function(callback,_this) {
	if (callbackStack[callback]) {
		callbackStack[callback].call(null,{target:_this});
		callbackStack[callback] = undefined;
	}
}
callbackStack.add = function(callback) {
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
	this.zip.full = null;

	this.privateKey={};
	this.privateKey.der = null;
	this.privateKey.pem = "";

	this.publicKey={};
	this.publicKey.modulus = null;
	this.publicKey.exponent = null;
	this.publicKey.der = null;
	this.publicKey.pem = "";

	this.sign={};
	this.sign.der = null;

	this.crx = {};
	this.crx.header = null;
	Object.defineProperty(this.crx,"full",{
		get: (function() {
			var crx = new Uint8Array(this.crx.header.byteLength + this.zip.full.byteLength);
			crx.set(this.crx.header,0);
			crx.set(this.zip.full,this.crx.header.byteLength);
			return crx.buffer;
		}).bind(this),
		enumerable: true
	});

	this.worker = new Worker(workerCode);
	this.worker.onerror = function(e) { throw e; };

	this.worker.onmessage = (function(e) {
		switch(e.data.name) {
			case "generatePrivateKeySign":
				// _this.publicKey.modulus = e.data.modulus;
				// _this.publicKey.exponent = e.data.exponent;
				this.publicKey.der = e.data.publicKey;
				// this.privateKey.string = e.data.privateKey;
				this.sign.der = e.data.sign;
				callbackStack.run(e.data.callback,this);
				break;
			case "generateCRX":
				this.crx.header = e.data.crxHeader;
				callbackStack.run(e.data.callback,this);
				break;
			default:
				break;
		}
	}).bind(this);
}


JSCrx.prototype.addZip = function(zipData,encoding) {

	switch(encoding) {
		case "blob":
		case "file":
			var reader = new FileReader();
			reader.onload = (function(e) {
				this.zip.full = e.target.result;
			}).bind(this); // make sure this is THIS
			reader.readAsArrayBuffer();
			break;
		case "base64":
			this.addZip(window.btoa(zipData));
			break;
		case "string":
			this.zip.full = new Uint8Array(
				zipData.toString().split("").map(function(n){
					return n.charCodeAt(0)
				})).buffer;
			break;
		case "typedarray":
			var buffer = zipData.buffer || zipData;
			this.zip.full = buffer;
			break;
		default:
			break;
	}

	return this;
};
JSCrx.prototype.generatePrivateKeySignature = function(options,callback) {
	if (!this.zip.full) { throw new Error("Need zip file in order to sign"); }

	var callbackIndex = callbackStack.add(callback);
	this.worker.postMessage({
		name: "generatePrivateKeySign",
		exponent: options.exponent || 0x10001,
		zip: this.zip.full,
		callback: callbackIndex
	}, [this.zip.full]);
};
JSCrx.prototype.generateCrx = function(callback) {
	if (!this.publicKey.der) { throw new Error("Need public key in order to package"); }
	else if (!this.sign.der) { throw new Error("Need signature in order to package"); }
	else if (!this.zip.full) { throw new Error("Need zip file in order to sign"); }

	var callbackIndex = callbackStack.add(callback);
	this.worker.postMessage({
		name:"generateCrx",
		publicKey:this.publicKey.der,
		signature:this.sign.der,
		callback:callbackIndex
	}, [this.publicKey.der, this.sign.der]);
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
/**/ return "worker.js"; /**/ // will be removed by compiler

return stringToObjectUrl("(" + worker.toString() + "())");
}());
