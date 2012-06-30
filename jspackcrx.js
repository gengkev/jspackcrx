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

function abConcat() {
	var arrayBuffers = [].slice.call(arguments);
	
	return arrayBuffers.reduce(function(prev,cur) {
		cur = new Uint8Array(cur);
		
		var newAb = new Uint8Array(prev.length + cur.length);
		newAb.set(prev,0);
		newAb.set(cur,prev.length);
		return newAb;
	},new Uint8Array(0)).buffer;
}
function abCopy(ab) {
	var arr = new Uint8Array(ab);
	var copy = new Uint8Array(ab.byteLength);
	
	for (var i=0;i<arr.length;i++) {
		copy[i] = arr[i];
	}
	return copy.buffer;
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
			return abConcat(this.crx.header,this.zip.full);
		}).bind(this),
		enumerable: true
	});

	this.worker = new Worker(workerCode);
	this.worker.onerror = function(e) { throw e; };

	this.worker.onmessage = (function(e) {
		switch(e.data.name) {
			case "generatePrivateKeySign":
				this.publicKey.der = e.data.publicKey;
				this.sign.der = e.data.sign;
				callbackStack.run(e.data.callback,this);
				break;
			case "generateCRX":
				this.crx.header = e.data.crxHeader;
				callbackStack.run(e.data.callback,this);
				break;
			default:
				console.log(e.data.name+": "+e.data.value);
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
			}).bind(this);
			reader.readAsArrayBuffer();
			break;
		case "string":
			this.zip.full = new Uint8Array(
				(zipData+ "").split("").map(function(n){
					return n.charCodeAt(0);
				})
			).buffer;
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
	
	var tempZipFull = abCopy(this.zip.full);
	
	var callbackIndex = callbackStack.add(callback);
	this.worker.postMessage({
		name:     "generatePrivateKeySign",
		exponent: options.exponent || 0x10001,
		zip:      tempZipFull,
		callback: callbackIndex
	}, [tempZipFull]);
};
JSCrx.prototype.generateCrx = function(callback) {
	if (!this.publicKey.der) { throw new Error("Need public key in order to package"); }
	else if (!this.sign.der) { throw new Error("Need signature in order to package"); }
	else if (!this.zip.full) { throw new Error("Need zip file in order to sign"); }
	
	var tempPublicKeyDer = abCopy(this.publicKey.der),
	    tempSignDer      = abCopy(this.sign.der);

	var callbackIndex = callbackStack.add(callback);
	this.worker.postMessage({
		name:      "generateCrx",
		publicKey: tempPublicKeyDer,
		signature: tempSignDer,
		callback:  callbackIndex
	}, [tempPublicKeyDer,tempSignDer]);
};
JSCrx.prototype.terminate = function(){
	this.worker.terminate();
};

return JSCrx;

})(function(){

function worker() {
/* INSERT libs/jsbn.mod.js */
/* INSERT libs/jsbn2.mod.js */
/* INSERT libs/rsa.mod.js */
/* INSERT libs/rsa2.mod.js */
/* INSERT libs/sha1.js */
/* INSERT libs/rsa-sign.mod.js */
/* INSERT libs/asn1hex-1.1.min.js */
/* INSERT libs/rsapem-1.1.min.js */
/* INSERT libs/rsasign-1.2.min.js */
/* INSERT libs/x509-1.1.min.js */
/* INSERT libs/filler.js */

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
