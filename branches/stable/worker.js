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
		var data = generatePrivateKeySign(
			e.data.exponent,
			e.data.zip
		);
		
		postMessage({
			name:       "generatePrivateKeySign",
			publicKey:  data.publicKey,
			// privateKey: data.privateKey,
			sign:       data.sign,
			callback:   e.data.callback
		}, [data.publicKey, data.sign]);
		break;
	case "generateCrx":
		var data = packageCRXStuffings(
			e.data.publicKey,
			e.data.signature
		);
		
		postMessage({
			name:     "generateCRX", // Crx or CRX? lol
			crxHeader: data,
			callback:  e.data.callback
		}, [data]);
		break;
	default:
		break;
}
};


function generatePrivateKeySign(exponent,zip) {
	var rsa = new RSAKey();

	rsa.generate(1024,exponent.toString(16));
	
	// idk, zero-pad or not?!

	var modulus = padToByte(rsa.n.toString(16));
	var exp = padToByte(exponent.toString(16));
	var publicKey = formatSPKI(modulus,exp);
	// DEBUG
	postMessage({name:"log",value:modulus});
	postMessage({name:"log",value:exp});

	// so time to sign?
	var sign = hex2ui8( // convert result to Uint8Array
		rsa.signString( // sign string
			ui82char( new Uint8Array(zip) ) // convert arraybuffer to string
		,"sha1")
	);
	
	return {publicKey:publicKey.buffer,sign:sign.buffer};
}
function formatSPKI(modulus,exponent) { //should be in string-hex format
	// waiting on a *real* js asn1 library
	
	modulus = padToByte(modulus);
	exponent = padToByte(exponent);

	modulus = "0281" + hexByteLength(modulus) + modulus;

	exponent = "02" + hexByteLength(exponent) + exponent;

	var sequence = "3081" + hexByteLength(modulus + exponent) + modulus + exponent;
	
	// idk why, is this needed for encapsulation? I guess
	sequence = "00" + sequence;
	
	var bitstring = "0381" + hexByteLength(sequence) + sequence;
	
	// some object id stuff blablabla
	var output = "300D06092A864886F70D0101010500" + bitstring;
	output = "3081" + hexByteLength(output) + output;
	
	// DEBUG
	postMessage({name:"log",value:output});
	
	return hex2ui8(output);
}
function packageCRXStuffings(publicKey,signature) {
	var publicKeyLen = publicKey.byteLength, signatureLen = signature.byteLength;
	var arr = new Uint8Array(8 + 4 + 4 + publicKeyLen + signatureLen);
	
	arr.set(char2ui8("Cr24\x02\x00\x00\x00"),0);
	
	arr.set(int2ui8(publicKeyLen),8);
	arr.set(int2ui8(signatureLen),8 + 4);
	
	
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
	if (!hex) { return ""; }
	
	hex = hex.map(function(el){
		return String.fromCharCode(parseInt(el,16));
	});
	return hex.join("");
}
function int2ui8(n) { // little endianness
	var arr = new Uint8Array(4);
	arr[0] = n >>>  0 & 0xff;
	arr[1] = n >>>  8 & 0xff;
	arr[2] = n >>> 16 & 0xff;
	arr[3] = n >>> 24 & 0xff;
	return arr;
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
function char2ui8(chars) {
	return new Uint8Array(
		chars.split("").map(function(n){
			return n.charCodeAt(0)
		})
	);
}
function hex2ui8(hex) { //me has to lol at this function
	hex = hex.match(/[0-9a-f]{2}/igm);
	hex = hex.map(function(el){
		return parseInt(el,16);
	});
	return new Uint8Array(hex);
}
function ui82char(arr) {
	return [].map.call(arr,function(n) {
		return String.fromCharCode(n);
	}).join("");
}
function hexZeroPad(hex,len) {
	hex += ""; //implicit toString
	while(hex.length < len) {
		hex = "0" + hex;
	}
	return hex;
}
function padToByte(hex) {
	if (hex.length % 2 == 1) {
		return "0" + hex;
	}
	return hex;
}
function hex2b64(hex) {
	return btoa(hex2char(hex));
}
function b64tohex(b64) {
	return char2hex(atob(b64));
}
//function b64toBA(string) {
//	return atob(string).split("").map(function(x){return x.charCodeAt(0);});
//}
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
	
/**/ // will exclude in build
importScripts.apply(null,[
	"jsbn.mod",
	"jsbn2.mod",
	"rsa.mod",
	"rsa2.mod",
	"sha1",
	"asn1hex-1.1.min",
	"rsapem-1.1.min",
	"rsasign-1.2.min",
	"x509-1.1.min",
	"filler"
].map(function(x){
	return "libs/" + x + ".js";
}));
/**/
