
var JSCrx = (function(workerCode){
var support = {
	worker: !!window.Worker,
	filereader: window.File && window.Blob && window.FileList && window.FileReader,
	blobbuilder: !!window.BlobBuilder || !!window.MozBlobBuilder || !!window.WebKitBlobBuilder
};
var callbackStack = [];
function callbackRun(callback,_this) {
	if (callbackStack[callback]) {
		callbackStack[callback].call(_this);
		callbackStack[callback] = undefined;
	}
}
function addCallback(callback) {
	for (var i=0;i<=callbackStack.length;++i) { 
		if (typeof callbackStack[i] === "undefined") {
			callbackStack[i] = callback;
			break;
		}
	}
	return i;
}
function JSCrx() {
	if (this === window) { return new JSCrx(); }
	this.zip={};
	this.zip.string="";
	
	this.privateKey={};
	
	
	this.privateKey.der="";
	this.publicKey={};
	
	
	this.publicKey.der="";
	this.sign={};
	
	this.sign.der="";
	this.crx = {};
	
	
	
	this.worker = new Worker(workerCode);
	this.worker.onerror = function(e) { throw e; };
	this.worker.onmessage=(function(_this){
		return function(e) {
		switch(e.data.name) {
			case "generatePrivateKeySign":
				
				
				_this.publicKey.der = e.data.publicKey;
				
				_this.sign.der = e.data.sign;
				callbackRun(e.data.callback,_this);
				break;
			
			
			
			case "generateCRX":
				_this.crx.header = e.data.crxHeader;
				callbackRun(e.data.callback,_this);
				break;
			default:
				break;
		}
		};
	}(this));
}
JSCrx.prototype.addZip = function(zipData,encoding) {
	switch(encoding) {
		case "blob":
		case "file":
			var reader = new FileReader();
			reader.onload = function(e) {
				this.zip.string = e.target.result;
			};
			reader.readAsBinaryString();
			break;
		case "typedarray":
			var buffer = zipData.buffer || zipData;
			this.zip.string = String.fromCharCode.call(null,new Uint8Array(zipData));
			break;
		case "base64":
			this.zip.string = window.btoa(zipData);
			break;
		case "string":
			this.zip.string = zipData;
			break;
		default:
			this.zip.string = zipData;
			break;
	}
	return this;
};
JSCrx.prototype.generatePrivateKeySignature = function(options,callback) {
	if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }
	var callbackIndex = addCallback(callback);
	this.worker.postMessage({
		name: "generatePrivateKeySign",
		exponent: options.exponent || 65537,
		zip: this.zip.string,
		callback: callbackIndex
	});
};
JSCrx.prototype.generateCrx = function(format,callback) {
	if (!this.publicKey.der) { throw new Error("Need public key in order to package"); }
	else if (!this.sign.der) { throw new Error("Need signature in order to package"); }
	else if (!this.zip.string) { throw new Error("Need zip file in order to sign"); }
	var callbackIndex = addCallback(callback);
	this.worker.postMessage({
		name:"generateCrx",
		publicKey:this.publicKey.der,
		signature:this.sign.der,
		
		callback:callbackIndex
	});
};
JSCrx.prototype.terminate = function(){
	
		this.worker.terminate();
	
	
};
return JSCrx;
})(function(){
function worker() {
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}
(function(appName){
  var test = (0xdeadbeefcafe&0xffffff)==0xefcafe;
  if(test && (appName == "Microsoft Internet Explorer")) {
    
    
    
    BigInteger.prototype.am = function(i,x,w,j,c,n) {
      var xl = x&0x7fff, xh = x>>15;
      while(--n >= 0) {
        var l = this[i]&0x7fff;
        var h = this[i++]>>15;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
        w[j++] = l&0x3fffffff;
      }
      return c;
    };
    BigInteger.prototype.DB = 30;
  }
  else if(test && (appName != "Netscape")) {
    
    
    
    function am1(i,x,w,j,c,n) {
      while(--n >= 0) {
        var v = x*this[i++]+w[j]+c;
        c = Math.floor(v/0x4000000);
        w[j++] = v&0x3ffffff;
      }
      return c;
    }
    BigInteger.prototype.DB = 26;
  }
  else { 
    
    
    BigInteger.prototype.am = function(i,x,w,j,c,n) {
      var xl = x&0x3fff, xh = x>>14;
      while(--n >= 0) {
        var l = this[i]&0x3fff;
        var h = this[i++]>>14;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
        c = (l>>28)+(m>>14)+xh*h;
        w[j++] = l&0xfffffff;
      }
      return c;
    };
    BigInteger.prototype.DB = 28;
  }
}(navigator.appName));
BigInteger.prototype.DV = 1<<BigInteger.prototype.DB;
BigInteger.prototype.DM = BigInteger.prototype.DV-1;
BigInteger.prototype.FV = Math.pow(2,52);
BigInteger.prototype.F1 = 52-BigInteger.prototype.DB;
BigInteger.prototype.F2 = 2*52-BigInteger.prototype.DB-52;
var intAt = (function(){
  
  var BI_RC = [];
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  return function(s,i){
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  };
})();
BigInteger.prototype.copyTo = function(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
};
BigInteger.prototype.fromInt = function(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
  
  return this;
};
BigInteger.prototype.fromString = function(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; 
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
};
BigInteger.prototype.clamp = function() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
};
BigInteger.prototype.toString = function(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) {
      m = true;
      r = "0123456789abcdefghijklmnopqrstuvwxyz".charAt(n);
    }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += "0123456789abcdefghijklmnopqrstuvwxyz".charAt(d);
    }
  }
  return m?r:"0";
};
BigInteger.prototype.negate = function() { var r = new BigInteger(null); BigInteger.ZERO.subTo(this,r); return r; };
BigInteger.prototype.abs = function() { return (this.s<0)?this.negate():this; };
BigInteger.prototype.compareTo = function(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
};
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}
BigInteger.prototype.bitLength = function() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
};
BigInteger.prototype.dlShiftTo = function(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
};
BigInteger.prototype.drShiftTo = function(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
};
BigInteger.prototype.lShiftTo = function(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
};
BigInteger.prototype.rShiftTo = function(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
};
BigInteger.prototype.subTo = function (a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
};
BigInteger.prototype.multiplyTo = function(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
};
BigInteger.prototype.squareTo = function(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
};
BigInteger.prototype.divRemTo = function(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = new BigInteger(null);
  var y = new BigInteger(null), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?new BigInteger(null):q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
};
BigInteger.prototype.mod = function(a) {
  var r = new BigInteger(null);
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
};
function Classic(m) { this.m = m; }
Classic.prototype.convert = function(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
};
Classic.prototype.revert = function(x) { return x; };
Classic.prototype.reduce = function(x) { x.divRemTo(this.m,null,x); };
Classic.prototype.mulTo = function(x,y,r) { x.multiplyTo(y,r); this.reduce(r); };
Classic.prototype.sqrTo = function(x,r) { x.squareTo(r); this.reduce(r); };
BigInteger.prototype.invDigit = function() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		
  y = (y*(2-(x&0xf)*y))&0xf;	
  y = (y*(2-(x&0xff)*y))&0xff;	
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	
  
  
  y = (y*(2-x*y%this.DV))%this.DV;		
  
  return (y>0)?this.DV-y:-y;
};
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}
Montgomery.prototype.convert = function(x) {
  var r = new BigInteger(null);
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
};
Montgomery.prototype.revert = function(x) {
  var r = new BigInteger(null);
  x.copyTo(r);
  this.reduce(r);
  return r;
};
Montgomery.prototype.reduce = function(x) {
  while(x.t <= this.mt2)	
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
};
Montgomery.prototype.sqrTo = function(x,r) { x.squareTo(r); this.reduce(r); };
Montgomery.prototype.mulTo = function(x,y,r) { x.multiplyTo(y,r); this.reduce(r); };
BigInteger.prototype.isEven = function() { return ((this.t>0)?(this[0]&1):this.s) == 0; };
BigInteger.prototype.exp = function(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = new BigInteger(null), r2 = new BigInteger(null), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
};
BigInteger.prototype.modPowInt = function(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
};
BigInteger.ZERO = new BigInteger(null).fromInt(0);
BigInteger.ONE = new BigInteger(null).fromInt(1);
BigInteger.prototype.clone = function() { var r = new BigInteger(null); this.copyTo(r); return r; };
BigInteger.prototype.intValue = function() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
};
BigInteger.prototype.byteValue = function() { return (this.t==0)?this.s:(this[0]<<24)>>24; };
BigInteger.prototype.shortValue = function() { return (this.t==0)?this.s:(this[0]<<16)>>16; };
BigInteger.prototype.chunkSize = function(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); };
BigInteger.prototype.signum = function() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
};
BigInteger.prototype.toRadix = function(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = new BigInteger(null).fromInt(a), y = new BigInteger(null), z = new BigInteger(null), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
};
BigInteger.prototype.fromRadix = function(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
};
BigInteger.prototype.fromNumber = function(a,b,c) {
  if("number" == typeof b) {
    
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),function(x,y){return x|y;},this);
      if(this.isEven()) this.dAddOffset(1,0); 
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
};
BigInteger.prototype.toByteArray = function() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
};
BigInteger.prototype.equals = function(a) { return(this.compareTo(a)==0); };
BigInteger.prototype.min = function(a) { return(this.compareTo(a)<0)?this:a; };
BigInteger.prototype.max = function(a) { return(this.compareTo(a)>0)?this:a; };
BigInteger.prototype.bitwiseTo = function(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
};
BigInteger.prototype.and = function(a) { var r = new BigInteger(null); this.bitwiseTo(a,function(x,y){return x&y;},r); return r; };
BigInteger.prototype.or = function(a) { var r = new BigInteger(null); this.bitwiseTo(a,function(x,y){return x|y;},r); return r; };
BigInteger.prototype.xor = function(a) { var r = new BigInteger(null); this.bitwiseTo(a,function(x,y){return x^y;},r); return r; };
BigInteger.prototype.andNot = function(a) { var r = new BigInteger(null); this.bitwiseTo(a,function(x,y){return x&~y;},r); return r; };
BigInteger.prototype.not = function() {
  var r = new BigInteger(null);
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
};
BigInteger.prototype.shiftLeft = function(n) {
  var r = new BigInteger(null);
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
};
BigInteger.prototype.shiftRight = function(n) {
  var r = new BigInteger(null);
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
};
BigInteger.prototype.getLowestSetBit = (function(lbit){
  return function() {
    for(var i = 0; i < this.t; ++i)
      if(this[i] != 0) return i*this.DB+lbit(this[i]);
    if(this.s < 0) return this.t*this.DB;
    return -1;
  };
  
})(function(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
});
BigInteger.prototype.bitCount = (function(cbit){
  return function(){
    var r = 0, x = this.s&this.DM;
    for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
    return r;
  };
  
})(function(x){
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
});
BigInteger.prototype.testBit = function(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
};
BigInteger.prototype.changeBit = function(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
};
BigInteger.prototype.setBit = function(n) { return this.changeBit(n,function(x,y){return x|y;}); };
BigInteger.prototype.clearBit = function(n) { return this.changeBit(n,function(x,y){return x&~y;}); };
BigInteger.prototype.flipBit = function(n) { return this.changeBit(n,function(x,y){return x^y;}); };
BigInteger.prototype.addTo = function(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
};
BigInteger.prototype.add = function(a) { var r = new BigInteger(null); this.addTo(a,r); return r; };
BigInteger.prototype.subtract = function(a) { var r = new BigInteger(null); this.subTo(a,r); return r; };
BigInteger.prototype.multiply = function(a) { var r = new BigInteger(null); this.multiplyTo(a,r); return r; };
BigInteger.prototype.square = function() { var r = new BigInteger(null); this.squareTo(r); return r; };
BigInteger.prototype.divide = function(a) { var r = new BigInteger(null); this.divRemTo(a,r,null); return r; };
BigInteger.prototype.remainder = function(a) { var r = new BigInteger(null); this.divRemTo(a,null,r); return r; };
BigInteger.prototype.divideAndRemainder = function(a) {
  var q = new BigInteger(null), r = new BigInteger(null);
  this.divRemTo(a,q,r);
  return new Array(q,r);
};
BigInteger.prototype.dMultiply = function(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
};
BigInteger.prototype.dAddOffset = function(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
};
function NullExp() {}
NullExp.prototype.convert = function(x){return x;};
NullExp.prototype.revert = function(x){return x;};
NullExp.prototype.mulTo = function(x,y,r){x.multiplyTo(y,r);};
NullExp.prototype.sqrTo = function(x,r){x.squareTo(r);};
BigInteger.prototype.pow = function(e) { return this.exp(e,new NullExp()); };
BigInteger.prototype.multiplyLowerTo = function(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; 
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
};
BigInteger.prototype.multiplyUpperTo = function(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; 
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
};
function Barrett(m) {
  
  this.r2 = new BigInteger(null);
  this.q3 = new BigInteger(null);
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}
Barrett.prototype.convert = function(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = new BigInteger(null); x.copyTo(r); this.reduce(r); return r; }
};
Barrett.prototype.revert = function(x) { return x; };
Barrett.prototype.reduce = function(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
};
Barrett.prototype.sqrTo = function(x,r) { x.squareTo(r); this.reduce(r); };
Barrett.prototype.mulTo = function(x,y,r) { x.multiplyTo(y,r); this.reduce(r); };
BigInteger.prototype.modPow = function(e,m) {
  var i = e.bitLength(), k, r = new BigInteger(null).fromInt(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);
  
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = new BigInteger(null);
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = new BigInteger(null);
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }
  var j = e.t-1, w, is1 = true, r2 = new BigInteger(null), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }
    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }
    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
};
BigInteger.prototype.gcd = function(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
};
BigInteger.prototype.modInt = function(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
};
BigInteger.prototype.modInverse = function(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = new BigInteger(null).fromInt(1), b = new BigInteger(null).fromInt(0),
      c = new BigInteger(null).fromInt(0), d = new BigInteger(null).fromInt(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
};
(function(){ 
  var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,
    113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,
    257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,
    409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,
    571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,
    733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,
    907,911,919,929,937,941,947,953,967,971,977,983,991,997],
    lplim = (1<<26)/lowprimes[lowprimes.length-1];
  
  BigInteger.prototype.isProbablePrime = function(t) {
    var i, x = this.abs();
    if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
      for(i = 0; i < lowprimes.length; ++i)
        if(x[0] == lowprimes[i]) return true;
      return false;
    }
    if(x.isEven()) return false;
    i = 1;
    while(i < lowprimes.length) {
      var m = lowprimes[i], j = i+1;
      while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
      m = x.modInt(m);
      while(i < j) if(m%lowprimes[i++] == 0) return false;
    }
    return x.millerRabin(t);
  };
  
  BigInteger.prototype.millerRabin = function(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if(k <= 0) return false;
    var r = n1.shiftRight(k);
    t = (t+1)>>1;
    if(t > lowprimes.length) t = lowprimes.length;
    var a = new BigInteger(null);
    for(var i = 0; i < t; ++i) {
      
      a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
      var y = a.modPow(r,this);
      if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;
        while(j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2,this);
          if(y.compareTo(BigInteger.ONE) == 0) return false;
        }
        if(y.compareTo(n1) != 0) return false;
      }
    }
    return true;
  };
})();
var rng_state,rng_pool,rng_pptr;function rng_seed_int(b){rng_pool[rng_pptr++]^=b&255;rng_pool[rng_pptr++]^=b>>8&255;rng_pool[rng_pptr++]^=b>>16&255;rng_pool[rng_pptr++]^=b>>24&255;rng_pptr>=rng_psize&&(rng_pptr-=rng_psize)}function rng_seed_time(){rng_seed_int((new Date).getTime())}
if(rng_pool==null){rng_pool=[];rng_pptr=0;var t;if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=z.charCodeAt(t)&255}for(;rng_pptr<rng_psize;)t=Math.floor(65536*Math.random()),rng_pool[rng_pptr++]=t>>>8,rng_pool[rng_pptr++]=t&255;rng_pptr=0;rng_seed_time()}
function rng_get_byte(){if(rng_state==null){rng_seed_time();rng_state=prng_newstate();rng_state.init(rng_pool);for(rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(b){var a;for(a=0;a<b.length;++a)b[a]=rng_get_byte()}function SecureRandom(){}SecureRandom.prototype.nextBytes=rng_get_bytes;function Arcfour(){this.j=this.i=0;this.S=[]}
function ARC4init(b){var a,c,d;for(a=0;a<256;++a)this.S[a]=a;for(a=c=0;a<256;++a)c=c+this.S[a]+b[a%b.length]&255,d=this.S[a],this.S[a]=this.S[c],this.S[c]=d;this.j=this.i=0}function ARC4next(){var b;this.i=this.i+1&255;this.j=this.j+this.S[this.i]&255;b=this.S[this.i];this.S[this.i]=this.S[this.j];this.S[this.j]=b;return this.S[b+this.S[this.i]&255]}Arcfour.prototype.init=ARC4init;Arcfour.prototype.next=ARC4next;function prng_newstate(){return new Arcfour}var rng_psize=256;
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { 
    throw new Error("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if(c < 128) { 
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { 
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}
RSAKey.prototype.setPublic = function(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = new BigInteger(N,16);
    this.e = parseInt(E,16);
  }
  else
    throw new Error("Invalid RSA public key");
};
RSAKey.prototype.doPublic = function(x) {
  return x.modPowInt(this.e, this.n);
};
RSAKey.prototype.encrypt = function(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
};
function pkcs1unpad2(d,n) {
  var b = d.toByteArray();
  var i = 0;
  while(i < b.length && b[i] == 0) ++i;
  if(b.length-i != n-1 || b[i] != 2)
    return null;
  ++i;
  while(b[i] != 0)
    if(++i >= b.length) return null;
  var ret = "";
  while(++i < b.length) {
    var c = b[i] & 255;
    if(c < 128) { 
      ret += String.fromCharCode(c);
    }
    else if((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (b[i+1] & 63));
      ++i;
    }
    else {
      ret += String.fromCharCode(((c & 15) << 12) | ((b[i+1] & 63) << 6) | (b[i+2] & 63));
      i += 2;
    }
  }
  return ret;
}
RSAKey.prototype.setPrivate = function(N,E,D) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = new BigInteger(N,16);
    this.e = parseInt(E,16);
    this.d = new BigInteger(D,16);
  }
  else
    throw new Error("Invalid RSA private key");
};
RSAKey.prototype.setPrivateEx = function(N,E,D,P,Q,DP,DQ,C) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = new BigInteger(N,16);
    this.e = parseInt(E,16);
    this.d = new BigInteger(D,16);
    this.p = new BigInteger(P,16);
    this.q = new BigInteger(Q,16);
    this.dmp1 = new BigInteger(DP,16);
    this.dmq1 = new BigInteger(DQ,16);
    this.coeff = new BigInteger(C,16);
  }
  else
    throw new Error("Invalid RSA private key");
};
RSAKey.prototype.generate = function(B,E) {
  var rng = new SecureRandom();
  var qs = B>>1;
  this.e = parseInt(E,16);
  var ee = new BigInteger(E,16);
  for(;;) {
    for(;;) {
      this.p = new BigInteger(B-qs,1,rng);
      if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
    }
    for(;;) {
      this.q = new BigInteger(qs,1,rng);
      if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
    }
    if(this.p.compareTo(this.q) <= 0) {
      var t = this.p;
      this.p = this.q;
      this.q = t;
    }
    var p1 = this.p.subtract(BigInteger.ONE);
    var q1 = this.q.subtract(BigInteger.ONE);
    var phi = p1.multiply(q1);
    if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
      this.n = this.p.multiply(this.q);
      this.d = ee.modInverse(phi);
      this.dmp1 = this.d.mod(p1);
      this.dmq1 = this.d.mod(q1);
      this.coeff = this.q.modInverse(this.p);
      break;
    }
  }
};
RSAKey.prototype.doPrivate = function(x) {
  if(this.p == null || this.q == null)
    return x.modPow(this.d, this.n);
  
  var xp = x.mod(this.p).modPow(this.dmp1, this.p);
  var xq = x.mod(this.q).modPow(this.dmq1, this.q);
  while(xp.compareTo(xq) < 0)
    xp = xp.add(this.p);
  return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
}
RSAKey.prototype.decrypt = function(ctext) {
  var c = new BigInteger(ctext, 16);
  var m = this.doPrivate(c);
  if(m == null) return null;
  return pkcs1unpad2(m, (this.n.bitLength()+7)>>3);
}
SHA1=function(l){function p(b,a){return b<<a|b>>>32-a}l+="";for(var n=Math,c=[1518500249,1859775393,2400959708,3395469782,1732584193,4023233417,2562383102,271733878,3285377520,4294967295],s=n.ceil(l.length/4)+2,q=n.ceil(s/16),g=[],a=0,h=[],j,d,e,f,m,i,b,k;a<q;a++){g[a]=[];for(k=0;k<16;k++){function o(b,c){return l.charCodeAt(a*64+k*4+b)<<c}g[a][k]=o(0,24)|o(1,16)|o(2,8)|o(3,0)}}i=l.length*8-8;a=q-1;g[a][14]=i/(c[9]+1);g[a][14]=n.floor(g[a][14]);g[a][15]=i&c[9];for(a=0;a<q;a++){for(b=0;b<16;b++)h[b]=g[a][b];for(b=16;b<80;b++)h[b]=p(h[b-3]^h[b-8]^h[b-14]^h[b-16],1);j=c[4];d=c[5];e=c[6];f=c[7];m=c[8];for(b=0;b<80;b++){var r=n.floor(b/20),t=p(j,5)+(r<1?d&e^~d&f:r==2?d&e^d&f^e&f:d^e^f)+m+c[r]+h[b]&c[9];m=f;f=e;e=p(d,30);d=j;j=t}c[4]+=j;c[5]+=d;c[6]+=e;c[7]+=f;c[8]+=m}i="";for(z=4;z<9;z++)for(a=7;a>=0;a--)i+=((c[z]&c[9])>>>a*4&15).toString(16);return i};
var _RSASIGN_DIHEAD = {
	"sha1": "3021300906052b0e03021a05000414"
	
};
var _RSASIGN_HASHHEXFUNC = {
	
	
	"sha1": SHA1
};
function _rsasign_getHexPaddedDigestInfoForString(s, keySize, hashAlg) {
  hashAlg = hashAlg.toLowerCase();
  var pmStrLen = keySize / 4;
  var hashFunc = _RSASIGN_HASHHEXFUNC[hashAlg];
  var sHashHex = hashFunc(s);
  var sHead = "0001";
  var sTail = "00" + _RSASIGN_DIHEAD[hashAlg] + sHashHex;
  var sMid = "";
  var fLen = pmStrLen - sHead.length - sTail.length;
  for (var i = 0; i < fLen; i += 2) {
    sMid += "ff";
  }
  sPaddedMessageHex = sHead + sMid + sTail;
  return sPaddedMessageHex;
}
RSAKey.prototype.signString = function(s, hashAlg) {
  var hPM = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength(), hashAlg);
  var biPaddedMessage = new BigInteger(hPM, 16);
  var biSign = this.doPrivate(biPaddedMessage);
  var hexSign = biSign.toString(16);
  return hexSign;
}
function _rsasign_getDecryptSignatureBI(biSig, hN, hE) {
  var rsa = new RSAKey();
  rsa.setPublic(hN, hE);
  var biDecryptedSig = rsa.doPublic(biSig);
  return biDecryptedSig;
}
function _rsasign_getHexDigestInfoFromSig(biSig, hN, hE) {
  var biDecryptedSig = _rsasign_getDecryptSignatureBI(biSig, hN, hE);
  var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, '');
  return hDigestInfo;
}
function _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo) {
  for (var algName in _RSASIGN_DIHEAD) {
    var head = _RSASIGN_DIHEAD[algName];
    var len = head.length;
    if (hDigestInfo.substring(0, len) == head) {
      var a = [algName, hDigestInfo.substring(len)];
      return a;
    }
  }
  return [];
}
function _rsasign_verifySignatureWithArgs(sMsg, biSig, hN, hE) {
  var hDigestInfo = _rsasign_getHexDigestInfoFromSig(biSig, hN, hE);
  var digestInfoAry = _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo);
  if (digestInfoAry.length == 0) return false;
  var algName = digestInfoAry[0];
  var diHashValue = digestInfoAry[1];
  var ff = _RSASIGN_HASHHEXFUNC[algName];
  var msgHashValue = ff(sMsg);
  return (diHashValue == msgHashValue);
}
RSAKey.prototype.verifyHexSignatureForMessage = function(hSig, sMsg) {
  var biSig = new BigInteger(hSig, 16);
  var result = _rsasign_verifySignatureWithArgs(sMsg, biSig,
						this.n.toString(16),
						this.e.toString(16));
  return result;
}
RSAKey.prototype.verifyString = function(sMsg, hSig) {
  hSig = hSig.replace(/[ \n]+/g, "");
  var biSig = new BigInteger(hSig, 16);
  var biDecryptedSig = this.doPublic(biSig);
  var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, '');
  var digestInfoAry = _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo);
  
  if (digestInfoAry.length == 0) return false;
  var algName = digestInfoAry[0];
  var diHashValue = digestInfoAry[1];
  var ff = _RSASIGN_HASHHEXFUNC[algName];
  var msgHashValue = ff(sMsg);
  return (diHashValue == msgHashValue);
}
function _x509_pemToBase64(sCertPEM) {
  var s = sCertPEM;
  s = s.replace("-----BEGIN CERTIFICATE-----", "");
  s = s.replace("-----END CERTIFICATE-----", "");
  s = s.replace(/[ \n]+/g, "");
  return s;
}
function _x509_pemToHex(sCertPEM) {
  var b64Cert = _x509_pemToBase64(sCertPEM);
  var hCert = b64tohex(b64Cert);
  return hCert;
}
function _x509_getHexTbsCertificateFromCert(hCert) {
  var pTbsCert = _asnhex_getStartPosOfV_AtObj(hCert, 0);
  return pTbsCert;
}
function _x509_getSubjectPublicKeyInfoPosFromCertHex(hCert) {
  var pTbsCert = _asnhex_getStartPosOfV_AtObj(hCert, 0);
  var a = _asnhex_getPosArrayOfChildren_AtObj(hCert, pTbsCert); 
  if (a.length < 1) return -1;
  if (hCert.substring(a[0], a[0] + 10) == "a003020102") { 
    if (a.length < 6) return -1;
    return a[6];
  } else {
    if (a.length < 5) return -1;
    return a[5];
  }
}
function _x509_getSubjectPublicKeyPosFromCertHex(hCert) {
  var pInfo = _x509_getSubjectPublicKeyInfoPosFromCertHex(hCert);
  if (pInfo == -1) return -1;    
  var a = _asnhex_getPosArrayOfChildren_AtObj(hCert, pInfo); 
  if (a.length != 2) return -1;
  var pBitString = a[1];
  if (hCert.substring(pBitString, pBitString + 2) != '03') return -1;
  var pBitStringV = _asnhex_getStartPosOfV_AtObj(hCert, pBitString);
  if (hCert.substring(pBitStringV, pBitStringV + 2) != '00') return -1;
  return pBitStringV + 2;
}
function _x509_getPublicKeyHexArrayFromCertHex(hCert) {
  var p = _x509_getSubjectPublicKeyPosFromCertHex(hCert);
  var a = _asnhex_getPosArrayOfChildren_AtObj(hCert, p); 
  if (a.length != 2) return [];
  var hN = _asnhex_getHexOfV_AtObj(hCert, a[0]);
  var hE = _asnhex_getHexOfV_AtObj(hCert, a[1]);
  if (hN != null && hE != null) {
    return [hN, hE];
  } else {
    return [];
  }
}
function _x509_getPublicKeyHexArrayFromCertPEM(sCertPEM) {
  var hCert = _x509_pemToHex(sCertPEM);
  var a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
  return a;
}
function X509() {
  this.subjectPublicKeyRSA = null;
  this.subjectPublicKeyRSA_hN = null;
  this.subjectPublicKeyRSA_hE = null;
}
X509.prototype.readCertPEM = function(sCertPEM) {
  var hCert = _x509_pemToHex(sCertPEM);
  var a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
  var rsa = new RSAKey();
  rsa.setPublic(a[0], a[1]);
  this.subjectPublicKeyRSA = rsa;
  this.subjectPublicKeyRSA_hN = a[0];
  this.subjectPublicKeyRSA_hE = a[1];
}
X509.prototype.readCertPEMWithoutRSAInit = function(sCertPEM) {
  var hCert = _x509_pemToHex(sCertPEM);
  var a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
  this.subjectPublicKeyRSA.setPublic(a[0], a[1]);
  this.subjectPublicKeyRSA_hN = a[0];
  this.subjectPublicKeyRSA_hE = a[1];
}
function _asnhex_getByteLengthOfL_AtObj(s, pos) {
  if (s.substring(pos + 2, pos + 3) != '8') return 1;
  var i = parseInt(s.substring(pos + 3, pos + 4));
  if (i == 0) return -1; 		
  if (0 < i && i < 10) return i + 1;	
  return -2;				
}
function _asnhex_getHexOfL_AtObj(s, pos) {
  var len = _asnhex_getByteLengthOfL_AtObj(s, pos);
  if (len < 1) return '';
  return s.substring(pos + 2, pos + 2 + len * 2);
}
function _asnhex_getIntOfL_AtObj(s, pos) {
  var hLength = _asnhex_getHexOfL_AtObj(s, pos);
  if (hLength == '') return -1;
  var bi;
  if (parseInt(hLength.substring(0, 1)) < 8) {
     bi = new BigInteger(hLength, 16);
  } else {
     bi = new BigInteger(hLength.substring(2), 16);
  }
  return bi.intValue();
}
function _asnhex_getStartPosOfV_AtObj(s, pos) {
  var l_len = _asnhex_getByteLengthOfL_AtObj(s, pos);
  if (l_len < 0) return l_len;
  return pos + (l_len + 1) * 2;
}
function _asnhex_getHexOfV_AtObj(s, pos) {
  var pos1 = _asnhex_getStartPosOfV_AtObj(s, pos);
  var len = _asnhex_getIntOfL_AtObj(s, pos);
  return s.substring(pos1, pos1 + len * 2);
}
function _asnhex_getPosOfNextSibling_AtObj(s, pos) {
  var pos1 = _asnhex_getStartPosOfV_AtObj(s, pos);
  var len = _asnhex_getIntOfL_AtObj(s, pos);
  return pos1 + len * 2;
}
function _asnhex_getPosArrayOfChildren_AtObj(h, pos) {
  var a = [];
  var p0 = _asnhex_getStartPosOfV_AtObj(h, pos);
  a.push(p0);
  var len = _asnhex_getIntOfL_AtObj(h, pos);
  var p = p0;
  var k = 0;
  while (1) {
    var pNext = _asnhex_getPosOfNextSibling_AtObj(h, p);
    if (pNext == null || (pNext - p0  >= (len * 2))) break;
    if (k >= 200) break;
    a.push(pNext);
    p = pNext;
    k++;
  }
  return a;
}
function _rsapem_pemToBase64(sPEMPrivateKey) {
  var s = sPEMPrivateKey;
  s = s.replace("-----BEGIN RSA PRIVATE KEY-----", "");
  s = s.replace("-----END RSA PRIVATE KEY-----", "");
  s = s.replace(/[ \n]+/g, "");
  return s;
}
function _rsapem_getPosArrayOfChildrenFromHex(hPrivateKey) {
  var a = [];
  var v1 = _asnhex_getStartPosOfV_AtObj(hPrivateKey, 0);
  var n1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, v1);
  var e1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, n1);
  var d1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, e1);
  var p1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, d1);
  var q1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, p1);
  var dp1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, q1);
  var dq1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, dp1);
  var co1 = _asnhex_getPosOfNextSibling_AtObj(hPrivateKey, dq1);
  a.push(v1, n1, e1, d1, p1, q1, dp1, dq1, co1);
  return a;
}
function _rsapem_getHexValueArrayOfChildrenFromHex(hPrivateKey) {
  var posArray = _rsapem_getPosArrayOfChildrenFromHex(hPrivateKey);
  var v =  _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[0]);
  var n =  _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[1]);
  var e =  _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[2]);
  var d =  _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[3]);
  var p =  _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[4]);
  var q =  _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[5]);
  var dp = _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[6]);
  var dq = _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[7]);
  var co = _asnhex_getHexOfV_AtObj(hPrivateKey, posArray[8]);
  var a = [];
  a.push(v, n, e, d, p, q, dp, dq, co);
  return a;
}
RSAKey.prototype.readPrivateKeyFromPEMString = function(keyPEM) {
  var keyB64 = _rsapem_pemToBase64(keyPEM);
  var keyHex = b64tohex(keyB64) 
  var a = _rsapem_getHexValueArrayOfChildrenFromHex(keyHex);
  this.setPrivateEx(a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8]);
}
elf.onmessage=function(e) {
witch(e.data.name) {
	case "generatePrivateKeySign":
		var data = generatePrivateKeySign(e.data.exponent,e.data.zip);
		postMessage({
			name: "generatePrivateKeySign",
			publicKey:data.publicKey,
			
			sign:data.sign,
			callback:e.data.callback
		});
		break;
	case "generateCrx":
		var data = packageCRXStuffings(e.data.publicKey,e.data.signature);
		postMessage({
			name: "generateCRX", 
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
	
	rsa.generate(1024,exponent.toString(16));
	
	
	var modulus = hexZeroPad(rsa.n.toString(16),129*2);
	var exp = hexZeroPad(rsa.e.toString(16),3*2); 
	var publicKey = formatSPKI(modulus,exp);
	
	var sign = rsa.signString(zip,"sha1"); 
	return {publicKey:publicKey,sign:sign}; 
}
function formatSPKI(modulus,exponent) { 
	
	var output = "30819F300D06092A864886F70D010101050003818D00308189028181";
	output += modulus; 
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
function hex2char(hex) { 
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
function char2hex(chars,lowercase) { 
	chars += "";
	var hexstring = chars.split("").map(function(el){
		el = el.charCodeAt(0) & 0xff; 
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
	hex += ""; 
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
var debug = false;  
if (debug) return "worker.js";
else return stringToObjectUrl("(" + worker.toString() + "())");
}());
