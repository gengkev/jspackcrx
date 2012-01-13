var scripts = {};
self.onMessage=function(evt) {
  switch(evt.name) {
    case "Hello World!":
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

function generatePrivateKey() {
  scripts.base64 && importScripts("base64.min.js");
  scripts.jsbn && importScripts("libs/jsbn-mod.min.js");
  scripts.jsbn2 && importScripts("libs/jsbn2.min.js");
  scripts.rng && importScripts("libs/rng.min.js");
  scripts.rsa && importScripts("libs/rsa.min.js");
  scripts.sha1 && importScripts("libs/sha1.min.js");
  scripts.rsaSign && importScripts("libs/rsa-sign.min.js");
  /*
  
  
  */
  var rsa = new RSAKey(), exponent = 65537;
  var publicKeyPEM,publicKeyRaw,privateKeyPEM = pemFile,privateKeyRaw;

  rsa.generate(1024,exponent.toString(16));


}