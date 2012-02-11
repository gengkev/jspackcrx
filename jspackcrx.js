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
//yeah, I never knew that was called a closure

/* Requirements:
 * Worker
 * opt.: FileReader, Blob, (Webkit|Moz|)BlobBuilder
 */
//lets not do anything just yet...
var support = {
	worker: !!window.Worker,
	filereader: window.File && window.Blob && window.FileList && window.FileReader,
	blobbuilder: !!window.BlobBuilder || !!window.MozBlobBuilder || !!window.WebKitBlobBuilder
};
var callbackStack = [];
function callbackRun(callback,_this) {
	if (!callbackStack[callback]) { return; }

	callbackStack[callback].call(_this);

	callbackStack[callback] = undefined;
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

	this.worker = new Worker("worker.js");
	this.worker.onerror = function(e) { throw e; };
	this.worker.postMessage({name:"Hello World!",libdir:JSCrx.libdir});

	this.worker.onmessage=(function(_this){
		return function(e) {
		switch(e.data.name) {
			case "World Hello!":
				break;
			case "generatePrivateKeySign":
				// _this.publicKey.modulus = e.data.modulus;
				// _this.publicKey.exponent = e.data.exponent;
				_this.publicKey.der = e.data.publicKey;
				// this.privateKey.string = e.data.privateKey;
				_this.sign.der = e.data.sign;
				callbackRun(e.data.callback,this);
				break;
			//case "generateSignature":
			//	_this.sign.der = e.data.der;
			//	callbackRun(e.data.callback,this);
			case "generateCRX":
				_this.crx.header = e.data.crxHeader;
				callbackRun(e.data.callback,this);
				break;
			default:
				break;
		}
		};
	}(this));
}
JSCrx.libdir = (location.protocol.length-4?"https":"http") + "://jspackcrx.googlecode.com/svn/trunk/libs/";


JSCrx.prototype.addZip = function(zipData,encoding) {
	//var rawZip="";

	switch(encoding) {
		case "blob":
		case "file":
			var reader = new FileReader();
			reader.onload = function(e) {
				this.zip.string = e.target.result;
			};
			reader.readAsBinaryString(); //???
			break;
		case "typedarray":
			var buffer = zipData.buffer || zipData;
			this.zip.string = String.fromCharCode.call(window,new Uint8Array(zipData));
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
};
JSCrx.prototype.generatePrivateKeySignature = function(options,callback) {
	if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }

	callbackStack.push(callback);
	this.worker.postMessage({
		name: "generatePrivateKeySign",
		exponent: options.exponent || 65537,
		zip: this.zip.string,
		callback: callbackStack.length-1
	});
};
/*
JSCrx.prototype.generateSignature = function(options,callback) {
	if (!this.privateKey.der) { throw new Error("Need private key in order to sign"); }
	else if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }

	callbackStack.push(callback);
	this.worker.postMessage({
		name:"generateSignature",
		privateKey:this.privateKey.der,
		zip:this.zip.string,
		callback:callbackStack.length-1
	});
}
*/
JSCrx.prototype.generateCrx = function(format,callback) {
	if (!this.publicKey.der) { throw new Error("Need public key in order to package"); }
	else if (!this.sign.der) { throw new Error("Need signature in order to package"); }
	else if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }

	callbackStack.push(callback);
	this.worker.postMessage({
		name:"generateCrx",
		publicKey:this.publicKey.der,
		signature:this.sign.der,
		// zip:this.zip.string,
		callback:callbackStack.length-1
	});
};
JSCrx.prototype.terminate = function(){
	try {
		this.worker.terminate();
		delete this.worker, this.zip, this.privateKey, this.publicKey, this.sign, this.crx;
		this = null;
	} catch(e) { } //swallowed! because it doesn't really matter
}

window.JSCrx = JSCrx;
}());
