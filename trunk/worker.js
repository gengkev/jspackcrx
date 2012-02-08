/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */

self.onMessage=function(evt) {
	switch(evt.name) {
		case "Hello World!":
			loadScripts(evt.libdir);
			postMessage({name:"World Hello!"});
			break;
		case "generatePrivateKey":
			
			break;

		case "generateSignature":
		case "generateCrx":
			
		default:
			break;

/*
		case "libdir":
			var l=evt.message;
			var s=["base64.min.js","jsbn-mod.min.js","jsbn2.min.js","rng.min.js","rsa.min.js","sha1.min.js","rsa-sign.min.js"];
			for (var i=0;i<s.length;i++) {
				importScripts(l+s[i]);
			}
			rng_seed_time();
			postMessage({name:"processready"});
			break;
		case "genrsadetails":
			rsakeygen(evt.message);
			break;
*/
	}
}

function loadScripts(libdir) {
	var scripts = [
		"/min/jsbn.mod.min.js",
		"/min/rng.min.js",
		"/min/base64.min.js",
		"/min/rsa.mod.min.js",
		"/min/sha1.min.js",
		"/min/rsa-sign.min.js"
	];
	scripts.forEach(function(el){
		el = libdir + el;
	});
	importScripts.apply(null,scripts);
}

function generatePrivateKey(exponent) {
	/*
	
	
	*/
	var rsa = new RSAKey();
	var publicKeyPEM,publicKeyRaw,privateKeyPEM = pemFile,privateKeyRaw;

	rsa.generate(1024,exponent.toString(16));


}
