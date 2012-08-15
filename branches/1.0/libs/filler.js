_RSASIGN_HASHHEXFUNC = {
	'sha1': function(s){return SHA1(s);}
};
function parseBigInt(str,r) {
	return new BigInteger(str,r);
}

function SecureRandom() { }
/*
SecureRandom.prototype.nextBytes = function(ba) {
	var arr = new Uint8Array(ba.length);
	crypto.getRandomValues(arr);
	return [].slice.call(arr,0);
};
*/
SecureRandom.prototype.nextBytes = function(ba) {
	for (var i=0;i<ba.length;i++) {
		ba[i] = Math.floor(Math.random() * 256);
	}
}
