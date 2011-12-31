
self.postMessage({name:"loadready"});
self.onMessage=function(evt) {
  switch(evt.name) {
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
	default:
	  break;
  }
}

function rsakeygen(pemFile) {
  /*
  Do one of two things:
  If we have a .pem file, read it and use it to find modulus and sign.
  
  Otherwise, make a private key and continue from there.
  
  */
  var rsa=new RSAKey();
  var publicKeyPEM,publicKeyRaw,privateKeyPEM = pemFile,privateKeyRaw;

  if (typeof privateKeyPEM=="undefined") {
    //we are going to generate one!
    rsa.generate(1024,10001);
  }

  else { //need to read
    rsa.readPrivateKeyFromPEMString(pemFile);
  }
}