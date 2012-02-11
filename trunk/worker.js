/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */

onmessage=function(e) {
switch(e.data.name) {
	case "Hello World!":
		loadScripts(e.data.libdir);
		rng_seed_time();
		postMessage({name:"World Hello!"});
		break;
	case "generatePrivateKeySign":
		var data = generatePrivateKeySign(e.data.exponent,e.data.zip);
		postMessage({
			publicKey:data.publicKey,
			// privateKey:data.privateKey,
			sign:data.sign,
			callback:e.data.callback
		});
		break;
	//case "generateSignature":
	//	break;
	case "generateCrx":
		var data = packageCRXStuffings(e.data.publicKey,e.data.signature);
		postMessage({
			crxHeader: data,
			callback:e.data.callback
		});
		break;
	default:
		break;
}
};

function loadScripts(libdir) {
	libdir = libdir.replace(/\/$/,""); //no ending slash
	var scripts = [
		"/min/jsbn.mod.min.js",
		"/min/rng.min.js",
		"/min/base64.min.js",
		"/min/rsa.mod.min.js",
		"/min/sha1.min.js",
		"/mod/rsa-sign.mod.js"
	];
	for (var i=0;i<scripts.length;i++) {
		scripts[i] = libdir + scripts[i];
	}
	importScripts.apply(null,scripts);
}

function generatePrivateKeySign(exponent,zip) {
	var rsa = new RSAKey();
	// var publicKeyPEM,publicKeyRaw,privateKeyPEM = pemFile,privateKeyRaw;

	rsa.generate(1024,exponent.toString(16));
	
	// idk, zero-pad or not?!

	var modulus = hexZeroPad(rsa.n.toString(16),129*2);
	var exp = hexZeroPad(rsa.e.toString(16),3*2); //or exponent.toString(16)
	var publicKey = formatSPKI(modulus,exp);

	// so time to sign?
	var sign = rsa.signString(zip,"SHA1"); //umm...zip might be a little big
	return {publicKey:publicKey,sign:sign}; //I don't believe it's that easy
}
function formatSPKI(modulus,exponent) { //should be in string-hex format
	// some asn.1 stuff at the beginning
	var output = "30819F300D06092A864886F70D010101050003818D00308189028181";
	output += modulus; //umm this will only work with a 1034 bit key probably...
	output += "0203";
	output += exponent;
	return output;
}
function packageCRXStuffings(publicKey,signature) {
	var output = "Cr24\x02\x00\x00\x00";
	output += hex2char(
		hex_endian_swap(hexZeroPad(publicKey.length.toString(16),8)) +
		hex_endian_swap(hexZeroPad(signature.length.toString(16),8))
	);
	output += hex2char(publicKey + signature);
	return output;
}
function hex2char(hex) { //me has to lol at this function
	hex = hex.match(/[0-9a-f]{2}/igm);
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
	chars = chars.toString();

	var hexstring = Array.prototype.map.call(chars,function(el){
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
	hex = hex.toString();
	while(hex.length < len) {
		hex = "00" + hex;
	}
	return hex;
}
/* actually the rsa-sign library has this stuff already
function aBunchOfRandomCode() {
        
	digest = "3021300906052B0E03021A05000414"+hex_sha1(zipfile);
	paddinglength = 128 - 3 - digest.length;
	padding = "";
	while(padding.length<paddinglength) {
		padding += "FF";
	}
	paddedhexstr = "0001" + padding + "00" + digest;

}*/