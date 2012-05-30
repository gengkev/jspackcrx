/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */
if (self.webkitPostMessage) { self.postMessage = self.webkitPostMessage; }
self.onmessage=function(e) {
switch(e.data.name) {
	case "generatePrivateKeySign":
		var data = generatePrivateKeySign(e.data.exponent,e.data.zip);
		postMessage({
			name: "generatePrivateKeySign",
			publicKey:data.publicKey,
			// privateKey:data.privateKey,
			sign:data.sign,
			callback:e.data.callback
		}, [data.publicKey, data.sign]);
		break;
	case "generateCrx":
		var data = packageCRXStuffings(e.data.publicKey,e.data.signature);
		postMessage({
			name: "generateCRX", // Crx or CRX? lol
			crxHeader:data,
			callback:e.data.callback
		}, [data]);
		break;
	default:
		break;
}
};


function generatePrivateKeySign(exponent,zip) {
	var rsa = new RSAKey();
	// var publicKeyPEM,publicKeyRaw,privateKeyPEM = pemFile,privateKeyRaw;

	rsa.generate(1024,exponent.toString(16));
	
	// idk, zero-pad or not?!

	var modulus = rsa.n.toString(16);
	var exp = exponent.toString(16);
	var publicKey = formatSPKI(modulus,exp);

	// so time to sign?
	var sign = hex2ab(rsa.signString(zip,"sha1")); //umm...zip might be a little big
	
	return {publicKey:publicKey,sign:sign};
}
function formatSPKI(modulus,exponent) { //should be in string-hex format
	// waiting on a *real* js asn1 library
	
	modulus = "0281" + hexByteLength(modulus) + modulus;

	exponent = "02" + hexByteLength(exponent) + exponent;

	var sequence = "3081" + hexByteLength(modulus + exponent) + modulus + exponent;
	
	// idk why, is this needed for encapsulation? I guess
	sequence = "00" + sequence;
	
	var bitstring = "0381" + hexByteLength(sequence) + sequence;
	
	// some object id stuff blablabla
	var output = "300D06092A864886F70D0101010500" + bitstring;
	output = "3081" + hexByteLength(output) + output;

	return hex2ab(output);
}
function packageCRXStuffings(publicKey,signature) {
	var publicKeyLen = publicKey.byteLength, signatureLen = signature.byteLength;
	var arr = new Uint8Array(8 + 4 + 4 + publicKeyLen + signatureLen);
	
	arr.set(new Uint8Array(char2ab("Cr24\x02\x00\x00\x00")),0);
	
	arr.set(new Uint8Array(int2ab(publicKeyLen)),8);
	arr.set(new Uint8Array(int2ab(signatureLen)),8 + 4);
	
	
	arr.set(new Uint8Array(publicKey), 8 + 4 + 4);
	arr.set(new Uint8Array(signature), 8 + 4 + 4 + publicKeyLen);
	return arr.buffer;
}
function hexByteLength(str,pad) {
	var len = (str.length/2).toString(16);
	return hex_endian_swap(hexZeroPad(len,pad));
}
function hex2char(hex) { //me has to lol at this function
	hex = hex.match(/[0-9a-f]{2}/igm);
	hex = hex.map(function(el){
		return String.fromCharCode(parseInt(el,16));
	});
	return hex.join("");
}
function int2ab(n) {
	var arr = new Uint8Array(4);
	arr[0] = n >>>  0 & 0xff;
	arr[1] = n >>>  8 & 0xff;
	arr[2] = n >>> 16 & 0xff;
	arr[3] = n >>> 24 & 0xff;
	return arr.buffer;
}
function hex_endian_swap(x) {
	if (x.length % 2 !== 0) { x = "0" + x; }

	var output = "", pos = x.length;
	while (pos) {
		output += x.substr(pos-2,2);
		pos -= 2;
	}
	return output;
}
// @antimatter15
function endian_swap(x){
  return (
    (x>>>24) | 
    ((x<<8) & 0x00FF0000) |
    ((x>>>8) & 0x0000FF00) |
    (x<<24)
  )
}

function char2hex(chars,lowercase) { // also purty :)
	chars += "";

	var hexstring = chars.split("").map(function(el){
		el = el.charCodeAt(0) & 0xff; //two digits please?
		var hex = el.toString(16);
		if (hex.length<2) { hex = "0"+hex; }
		return hex;
	}).join("");
	if (lowercase) {
		return hexstring.toLowerCase();
	} else {
		return hexstring.toUpperCase();
	}
}
function char2ab(chars) {
	return new Uint8Array(chars.split("").map(function(n){return n.charCodeAt(0)})).buffer;
}
function hex2ab(hex) { //me has to lol at this function
	hex = hex.match(/[0-9a-f]{2}/igm);
	hex = hex.map(function(el){
		return parseInt(el,16);
	});
	return new Uint8Array(hex).buffer;
}
function hexZeroPad(hex,len) {
	hex += ""; //implicit toString
	while(hex.length < len) {
		hex = "0" + hex;
	}
	return hex;
}
function hex2b64(hex) {
	return window.btoa(hex2char(hex));
}
function b64tohex(b64) {
	return char2hex(window.atob(b64));
}
function b64toBA(string) {
	return window.atob(string).split("").map(function(x){return x.charCodeAt(0);});
}
function abConcat() {
	var arrayBuffers = [].slice.call(arguments);
	
	return arrayBuffers.reduce(function(prev,cur) {
		var newAb = new Uint8Array(prev.length + cur.length);
		newAb.set(prev,0);
		newAb.set(cur,prev.length);
		return newAb;
	},new Uint8Array());
}
	
/**/ // will exclude in build
if (!self.BigInteger || !self.RSAKey) { // :-/
	importScripts.apply(null,[
		"jsbn.mod",
		"jsbn2.mod",
		"rng.min",
		"rsa.mod",
		"rsa2.mod",
		"sha1",
		"rsa-sign.mod"
	].map(function(x){
		return "libs/" + x + ".js";
	}));
}
/**/
