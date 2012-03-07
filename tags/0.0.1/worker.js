/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */

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
		});
		break;
	case "generateCrx":
		var data = packageCRXStuffings(e.data.publicKey,e.data.signature);
		postMessage({
			name: "generateCRX", // Crx or CRX? lol
			crxHeader:data,
			callback:e.data.callback
		});
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

	var modulus = hexZeroPad(rsa.n.toString(16),129*2);
	var exp = hexZeroPad(rsa.e.toString(16),3*2); //or exponent.toString(16)
	var publicKey = formatSPKI(modulus,exp);

	// so time to sign?
	var sign = rsa.signString(zip,"sha1"); //umm...zip might be a little big
	return {publicKey:publicKey,sign:sign}; //I don't believe it's that easy
}
function formatSPKI(modulus,exponent) { //should be in string-hex format
	// some asn.1 stuff at the beginning
	var output = "30819F300D06092A864886F70D010101050003818D00308189028181";
	output += modulus; //umm this will only work with a 1024 bit key probably...
	output += "0203";
	output += exponent;
	return output.toLowerCase();
}
function packageCRXStuffings(publicKey,signature) {
	var output = "Cr24\x02\x00\x00\x00";
	output += hex2char(
		hex_endian_swap(hexZeroPad((publicKey.length/2).toString(16),8)) +
		hex_endian_swap(hexZeroPad((signature.length/2).toString(16),8))
	);
	output += hex2char(publicKey + signature);
	return output;
}
function hex2char(hex) { //me has to lol at this function
	hex = hex.toLowerCase().match(/[0-9a-f]{2}/igm);
	hex = hex.map(function(el){
		return String.fromCharCode(parseInt(el,16));
	});
	return hex.join("");
}
function hex_endian_swap(x) {
	if (x.length % 2 !== 0) { throw new Error(); }

	var output = "", pos = x.length;
	while (pos) {
		output += x.substr(pos-2,2);
		pos -= 2;
	}
	return output;
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
/**/ // will exclude in build
if (!BigInteger || !RSAKey) { // :-/
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
