/* Automatically generated by build.js on Tue Aug 14 2012 21:24:08 GMT-0400 (Eastern Daylight Time). See it for details. */
var JSCrx=function(e){function r(){var e=[].slice.call(arguments);return e.reduce(function(e,t){t=new Uint8Array(t);var n=new Uint8Array(e.length+t.length);return n.set(e,0),n.set(t,e.length),n},new Uint8Array(0)).buffer}function i(e){var t=new Uint8Array(e),n=new Uint8Array(e.byteLength);for(var r=0;r<t.length;r++)n[r]=t[r];return n.buffer}function s(){if(this===window)return new s;this.zip={},this.zip.full=null,this.privateKey={},this.privateKey.der=null,this.privateKey.pem="",this.publicKey={},this.publicKey.modulus=null,this.publicKey.exponent=null,this.publicKey.der=null,this.publicKey.pem="",this.sign={},this.sign.der=null,this.crx={},this.crx.header=null,Object.defineProperty(this.crx,"full",{get:function(){return r(this.crx.header,this.zip.full)}.bind(this),enumerable:!0}),this.worker=new Worker(e),this.worker.onerror=function(e){throw e},this.worker.onmessage=function(e){switch(e.data.name){case"generatePrivateKeySign":this.publicKey.der=e.data.publicKey,this.sign.der=e.data.sign,n.run(e.data.callback,this);break;case"generateCRX":this.crx.header=e.data.crxHeader,n.run(e.data.callback,this);break;default:console.log(e.data.name+": "+e.data.value)}}.bind(this)}var t={worker:!!window.Worker,filereader:window.File&&window.Blob&&window.FileList&&window.FileReader,blobbuilder:!!window.BlobBuilder||!!window.MozBlobBuilder||!!window.WebKitBlobBuilder},n=[];return n.run=function(e,t){n[e]&&(n[e].call(null,{target:t}),n[e]=undefined)},n.add=function(e){for(var t=0;t<=n.length;++t)if(typeof n[t]=="undefined"){n[t]=e;break}return t},s.prototype.addZip=function(e){var t=e+"";switch(t){case"[object Blob]":case"[object File]":var n=new FileReader;n.onload=function(e){this.zip.full=e.target.result}.bind(this),n.readAsArrayBuffer(e);break;case"[object ArrayBuffer]":this.zip.full=e;break;case"[object Int8Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Int16Array]":case"[object Uint16Array]":case"[object Int32Array]":case"[object Uint32Array]":case"[object Float32Array]":case"[object Float64Array]":this.zip.full=e.buffer;break;default:this.zip.full=(new Uint8Array(t.split("").map(function(e){return e.charCodeAt(0)}))).buffer}return this},s.prototype.generatePrivateKeySignature=function(e,t){if(!this.zip.full)throw new Error("Need zip file in order to sign");var r=i(this.zip.full),s=n.add(t);this.worker.postMessage({name:"generatePrivateKeySign",exponent:e.exponent||65537,zip:r,callback:s},[r])},s.prototype.generateCrx=function(e){if(!this.publicKey.der)throw new Error("Need public key in order to package");if(!this.sign.der)throw new Error("Need signature in order to package");if(!this.zip.full)throw new Error("Need zip file in order to sign");var t=i(this.publicKey.der),r=i(this.sign.der),s=n.add(e);this.worker.postMessage({name:"generateCrx",publicKey:t,signature:r,callback:s},[t,r])},s.prototype.terminate=function(){this.worker.terminate()},s}(function(){return(window.URL||window.webkitURL).createObjectURL(new Blob(["("+function(){function e(e,t,n){e!=null&&("number"==typeof e?this.fromNumber(e,t,n):t==null&&"string"!=typeof e?this.fromString(e,256):this.fromString(e,t))}function r(e){var t=1,n;return(n=e>>>16)!=0&&(e=n,t+=16),(n=e>>8)!=0&&(e=n,t+=8),(n=e>>4)!=0&&(e=n,t+=4),(n=e>>2)!=0&&(e=n,t+=2),(n=e>>1)!=0&&(e=n,t+=1),t}function i(e){this.m=e}function s(e){this.m=e,this.mp=e.invDigit(),this.mpl=this.mp&32767,this.mph=this.mp>>15,this.um=(1<<e.DB-15)-1,this.mt2=2*e.t}function o(){}function u(t){this.r2=new e(null),this.q3=new e(null),e.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}function a(t,n){if(n<t.length+11)throw new Error("Message too long for RSA");var r=new Array,i=t.length-1;while(i>=0&&n>0){var s=t.charCodeAt(i--);s<128?r[--n]=s:s>127&&s<2048?(r[--n]=s&63|128,r[--n]=s>>6|192):(r[--n]=s&63|128,r[--n]=s>>6&63|128,r[--n]=s>>12|224)}r[--n]=0;var o=new ft,u=new Array;while(n>2){u[0]=0;while(u[0]==0)o.nextBytes(u);r[--n]=u[0]}return r[--n]=2,r[--n]=0,new e(r)}function f(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}function l(e,t){var n=e.toByteArray(),r=0;while(r<n.length&&n[r]==0)++r;if(n.length-r!=t-1||n[r]!=2)return null;++r;while(n[r]!=0)if(++r>=n.length)return null;var i="";while(++r<n.length){var s=n[r]&255;s<128?i+=String.fromCharCode(s):s>191&&s<224?(i+=String.fromCharCode((s&31)<<6|n[r+1]&63),++r):(i+=String.fromCharCode((s&15)<<12|(n[r+1]&63)<<6|n[r+2]&63),r+=2)}return i}function c(e,t){if(e.substring(t+2,t+3)!="8")return 1;var n=parseInt(e.substring(t+3,t+4));return n==0?-1:0<n&&n<10?n+1:-2}function h(e,t){var n=c(e,t);return n<1?"":e.substring(t+2,t+2+n*2)}function p(e,t){var n=h(e,t);if(n=="")return-1;var r;return parseInt(n.substring(0,1))<8?r=at(n,16):r=at(n.substring(2),16),r.intValue()}function d(e,t){var n=c(e,t);return n<0?n:t+(n+1)*2}function v(e,t){var n=d(e,t),r=p(e,t);return e.substring(n,n+r*2)}function m(e,t){var n=e.substr(t,2),r=h(e,t),i=v(e,t);return n+r+i}function g(e,t){var n=d(e,t),r=p(e,t);return n+r*2}function y(e,t){var n=new Array,r=d(e,t);n.push(r);var i=p(e,t),s=r,o=0;for(;;){var u=g(e,s);if(u==null||u-r>=i*2)break;if(o>=200)break;n.push(u),s=u,o++}return n}function b(e,t,n){var r=y(e,t);return r[n]}function w(e,t,n){if(n.length==0)return t;var r=n.shift(),i=y(e,t);return w(e,i[r],n)}function E(e,t,n){var r=w(e,t,n);return m(e,r)}function S(e,t,n){var r=w(e,t,n);return v(e,r)}function x(){return x}function T(e){var t=e;return t=t.replace("-----BEGIN RSA PRIVATE KEY-----",""),t=t.replace("-----END RSA PRIVATE KEY-----",""),t=t.replace(/[ \n]+/g,""),t}function N(e){var t=new Array,n=x.getStartPosOfV_AtObj(e,0),r=x.getPosOfNextSibling_AtObj(e,n),i=x.getPosOfNextSibling_AtObj(e,r),s=x.getPosOfNextSibling_AtObj(e,i),o=x.getPosOfNextSibling_AtObj(e,s),u=x.getPosOfNextSibling_AtObj(e,o),a=x.getPosOfNextSibling_AtObj(e,u),f=x.getPosOfNextSibling_AtObj(e,a),l=x.getPosOfNextSibling_AtObj(e,f);return t.push(n,r,i,s,o,u,a,f,l),t}function C(e){var t=N(e),n=x.getHexOfV_AtObj(e,t[0]),r=x.getHexOfV_AtObj(e,t[1]),i=x.getHexOfV_AtObj(e,t[2]),s=x.getHexOfV_AtObj(e,t[3]),o=x.getHexOfV_AtObj(e,t[4]),u=x.getHexOfV_AtObj(e,t[5]),a=x.getHexOfV_AtObj(e,t[6]),f=x.getHexOfV_AtObj(e,t[7]),l=x.getHexOfV_AtObj(e,t[8]),c=new Array;return c.push(n,r,i,s,o,u,a,f,l),c}function k(e){var t=T(e),n=Nt(t),r=C(n);this.setPrivateEx(r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8])}function M(e,t,n){var r=t/4,i=A[n],s=i(e),o="0001",u="00"+L[n]+s,a="",f=r-o.length-u.length;for(var l=0;l<f;l+=2)a+="ff";return sPaddedMessageHex=o+a+u,sPaddedMessageHex}function _(e,t){var n="",r=t/4-e.length;for(var i=0;i<r;i++)n+="0";return n+e}function D(e,t){var n=M(e,this.n.bitLength(),t),r=at(n,16),i=this.doPrivate(r),s=i.toString(16);return _(s,this.n.bitLength())}function P(e){return D(e,"sha1")}function H(e){return D(e,"sha256")}function B(e,t,n){var r=new f;r.setPublic(t,n);var i=r.doPublic(e);return i}function j(e,t,n){var r=B(e,t,n),i=r.toString(16).replace(/^1f+00/,"");return i}function F(e){for(var t in L){var n=L[t],r=n.length;if(e.substring(0,r)==n){var i=[t,e.substring(r)];return i}}return[]}function I(e,t,n,r){var i=j(t,n,r),s=F(i);if(s.length==0)return!1;var o=s[0],u=s[1],a=A[o],f=a(e);return u==f}function q(e,t){var n=at(e,16),r=I(t,n,this.n.toString(16),this.e.toString(16));return r}function R(e,t){t=t.replace(O,"");if(t.length!=this.n.bitLength()/4)return 0;t=t.replace(/[ \n]+/g,"");var n=at(t,16),r=this.doPublic(n),i=r.toString(16).replace(/^1f+00/,""),s=F(i);if(s.length==0)return!1;var o=s[0],u=s[1],a=A[o],f=a(e);return u==f}function U(e){var t=e;return t=t.replace("-----BEGIN CERTIFICATE-----",""),t=t.replace("-----END CERTIFICATE-----",""),t=t.replace(/[ \n]+/g,""),t}function W(e){var t=U(e),n=Nt(t);return n}function X(e){var t=x.getStartPosOfV_AtObj(e,0);return t}function V(e){var t=x.getStartPosOfV_AtObj(e,0),n=x.getPosArrayOfChildren_AtObj(e,t);return n.length<1?-1:e.substring(n[0],n[0]+10)=="a003020102"?n.length<6?-1:n[6]:n.length<5?-1:n[5]}function $(e){var t=V(e);if(t==-1)return-1;var n=x.getPosArrayOfChildren_AtObj(e,t);if(n.length!=2)return-1;var r=n[1];if(e.substring(r,r+2)!="03")return-1;var i=x.getStartPosOfV_AtObj(e,r);return e.substring(i,i+2)!="00"?-1:i+2}function J(e){var t=$(e),n=x.getPosArrayOfChildren_AtObj(e,t);if(n.length!=2)return[];var r=x.getHexOfV_AtObj(e,n[0]),i=x.getHexOfV_AtObj(e,n[1]);return r!=null&&i!=null?[r,i]:[]}function K(e){var t=W(e),n=J(t);return n}function Q(){return x.getDecendantHexVByNthList(this.hex,0,[0,1])}function G(){return x.getDecendantHexTLVByNthList(this.hex,0,[0,3])}function Y(){return rt(x.getDecendantHexTLVByNthList(this.hex,0,[0,3]))}function Z(){return x.getDecendantHexTLVByNthList(this.hex,0,[0,5])}function et(){return rt(x.getDecendantHexTLVByNthList(this.hex,0,[0,5]))}function tt(){var e=x.getDecendantHexVByNthList(this.hex,0,[0,4,0]);return e=e.replace(/(..)/g,"%$1"),e=decodeURIComponent(e),e}function nt(){var e=x.getDecendantHexVByNthList(this.hex,0,[0,4,1]);return e=e.replace(/(..)/g,"%$1"),e=decodeURIComponent(e),e}function rt(e){var t="",n=x.getPosArrayOfChildren_AtObj(e,0);for(var r=0;r<n.length;r++){var i=x.getHexOfTLV_AtObj(e,n[r]);t=t+"/"+it(i)}return t}function it(e){var t=x.getDecendantHexTLVByNthList(e,0,[0,0]),n=x.getDecendantHexVByNthList(e,0,[0,1]),r="";try{r=_x509_DN_ATTRHEX[t]}catch(i){r=t}n=n.replace(/(..)/g,"%$1");var s=decodeURIComponent(n);return r+"="+s}function st(e){var t=W(e),n=J(t),r=new f;r.setPublic(n[0],n[1]),this.subjectPublicKeyRSA=r,this.subjectPublicKeyRSA_hN=n[0],this.subjectPublicKeyRSA_hE=n[1],this.hex=t}function ot(e){var t=W(e),n=J(t);this.subjectPublicKeyRSA.setPublic(n[0],n[1]),this.subjectPublicKeyRSA_hN=n[0],this.subjectPublicKeyRSA_hE=n[1],this.hex=t}function ut(){this.subjectPublicKeyRSA=null,this.subjectPublicKeyRSA_hN=null,this.subjectPublicKeyRSA_hE=null,this.hex=null}function at(t,n){return new e(t,n)}function ft(){}function lt(e,t){var n=new f;n.generate(1024,e.toString(16));var r=xt(n.n.toString(16)),i=xt(e.toString(16)),s=ct(r,i);postMessage({name:"log",value:r}),postMessage({name:"log",value:i});var o=wt(n.signString(Et(new Uint8Array(t)),"sha1"));return{publicKey:s.buffer,sign:o.buffer}}function ct(e,t){e=xt(e),t=xt(t),e="0281"+pt(e)+e,t="02"+pt(t)+t;var n="3081"+pt(e+t)+e+t;n="00"+n;var r="0381"+pt(n)+n,i="300D06092A864886F70D0101010500"+r;return i="3081"+pt(i)+i,postMessage({name:"log",value:i}),wt(i)}function ht(e,t){var n=e.byteLength,r=t.byteLength,i=new Uint8Array(16+n+r);return i.set(bt("Cr24\0\0\0"),0),i.set(vt(n),8),i.set(vt(r),12),i.set(new Uint8Array(e),16),i.set(new Uint8Array(t),16+n),i.buffer}function pt(e,t){var n=(e.length/2).toString(16);return mt(St(n,t))}function dt(e){return e=e.match(/[0-9a-f]{2}/igm),e?(e=e.map(function(e){return String.fromCharCode(parseInt(e,16))}),e.join("")):""}function vt(e){var t=new Uint8Array(4);return t[0]=e>>>0&255,t[1]=e>>>8&255,t[2]=e>>>16&255,t[3]=e>>>24&255,t}function mt(e){e.length%2!==0&&(e="0"+e);var t="",n=e.length;while(n)t+=e.substr(n-2,2),n-=2;return t}function gt(e){return e>>>24|e<<8&16711680|e>>>8&65280|e<<24}function yt(e,t){e+="";var n=e.split("").map(function(e){e=e.charCodeAt(0)&255;var t=e.toString(16);return t.length<2&&(t="0"+t),t}).join("");return t?n.toLowerCase():n.toUpperCase()}function bt(e){return new Uint8Array(e.split("").map(function(e){return e.charCodeAt(0)}))}function wt(e){return e=e.match(/[0-9a-f]{2}/igm),e=e.map(function(e){return parseInt(e,16)}),new Uint8Array(e)}function Et(e){return[].map.call(e,function(e){return String.fromCharCode(e)}).join("")}function St(e,t){e+="";while(e.length<t)e="0"+e;return e}function xt(e){return e.length%2==1?"0"+e:e}function Tt(e){return btoa(dt(e))}function Nt(e){return yt(atob(e))}function Ct(){var e=[].slice.call(arguments);return e.reduce(function(e,t){t=new Uint8Array(t);var n=new Uint8Array(e.length+t.length);return n.set(e,0),n.set(t,e.length),n},new Uint8Array(0)).buffer}e.prototype.am=function(e,t,n,r,i,s){var o=t&16383,u=t>>14;while(--s>=0){var a=this[e]&16383,f=this[e++]>>14,l=u*a+f*o;a=o*a+((l&16383)<<14)+n[r]+i,i=(a>>28)+(l>>14)+u*f,n[r++]=a&268435455}return i},e.prototype.DB=28,e.prototype.DV=1<<e.prototype.DB,e.prototype.DM=e.prototype.DV-1,e.prototype.FV=Math.pow(2,52),e.prototype.F1=52-e.prototype.DB,e.prototype.F2=104-e.prototype.DB-52;var t=function(){var e=[],t,n;t="0".charCodeAt(0);for(n=0;n<=9;++n)e[t++]=n;t="a".charCodeAt(0);for(n=10;n<36;++n)e[t++]=n;t="A".charCodeAt(0);for(n=10;n<36;++n)e[t++]=n;return function(t,n){var r=e[t.charCodeAt(n)];return r==null?-1:r}}();e.prototype.copyTo=function(e){for(var t=this.t-1;t>=0;--t)e[t]=this[t];e.t=this.t,e.s=this.s},e.prototype.fromInt=function(e){return this.t=1,this.s=e<0?-1:0,e>0?this[0]=e:e<-1?this[0]=e+DV:this.t=0,this},e.prototype.fromString=function(n,r){var i;if(r==16)i=4;else if(r==8)i=3;else if(r==256)i=8;else if(r==2)i=1;else if(r==32)i=5;else{if(r!=4){this.fromRadix(n,r);return}i=2}this.t=0,this.s=0;var s=n.length,o=!1,u=0;while(--s>=0){var a=i==8?n[s]&255:t(n,s);if(a<0){n.charAt(s)=="-"&&(o=!0);continue}o=!1,u==0?this[this.t++]=a:u+i>this.DB?(this[this.t-1]|=(a&(1<<this.DB-u)-1)<<u,this[this.t++]=a>>this.DB-u):this[this.t-1]|=a<<u,u+=i,u>=this.DB&&(u-=this.DB)}i==8&&(n[0]&128)!=0&&(this.s=-1,u>0&&(this[this.t-1]|=(1<<this.DB-u)-1<<u)),this.clamp(),o&&e.ZERO.subTo(this,this)},e.prototype.clamp=function(){var e=this.s&this.DM;while(this.t>0&&this[this.t-1]==e)--this.t},e.prototype.toString=function(e){if(this.s<0)return"-"+this.negate().toString(e);var t;if(e==16)t=4;else if(e==8)t=3;else if(e==2)t=1;else if(e==32)t=5;else{if(e!=4)return this.toRadix(e);t=2}var r=(1<<t)-1,i,s=!1,o="",u=this.t,a=this.DB-u*this.DB%t;if(u-->0){a<this.DB&&(i=this[u]>>a)>0&&(s=!0,o="0123456789abcdefghijklmnopqrstuvwxyz".charAt(n));while(u>=0)a<t?(i=(this[u]&(1<<a)-1)<<t-a,i|=this[--u]>>(a+=this.DB-t)):(i=this[u]>>(a-=t)&r,a<=0&&(a+=this.DB,--u)),i>0&&(s=!0),s&&(o+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(i))}return s?o:"0"},e.prototype.negate=function(){var t=new e(null);return e.ZERO.subTo(this,t),t},e.prototype.abs=function(){return this.s<0?this.negate():this},e.prototype.compareTo=function(e){var t=this.s-e.s;if(t!=0)return t;var n=this.t;t=n-e.t;if(t!=0)return t;while(--n>=0)if((t=this[n]-e[n])!=0)return t;return 0},e.prototype.bitLength=function(){return this.t<=0?0:this.DB*(this.t-1)+r(this[this.t-1]^this.s&this.DM)},e.prototype.dlShiftTo=function(e,t){var n;for(n=this.t-1;n>=0;--n)t[n+e]=this[n];for(n=e-1;n>=0;--n)t[n]=0;t.t=this.t+e,t.s=this.s},e.prototype.drShiftTo=function(e,t){for(var n=e;n<this.t;++n)t[n-e]=this[n];t.t=Math.max(this.t-e,0),t.s=this.s},e.prototype.lShiftTo=function(e,t){var n=e%this.DB,r=this.DB-n,i=(1<<r)-1,s=Math.floor(e/this.DB),o=this.s<<n&this.DM,u;for(u=this.t-1;u>=0;--u)t[u+s+1]=this[u]>>r|o,o=(this[u]&i)<<n;for(u=s-1;u>=0;--u)t[u]=0;t[s]=o,t.t=this.t+s+1,t.s=this.s,t.clamp()},e.prototype.rShiftTo=function(e,t){t.s=this.s;var n=Math.floor(e/this.DB);if(n>=this.t){t.t=0;return}var r=e%this.DB,i=this.DB-r,s=(1<<r)-1;t[0]=this[n]>>r;for(var o=n+1;o<this.t;++o)t[o-n-1]|=(this[o]&s)<<i,t[o-n]=this[o]>>r;r>0&&(t[this.t-n-1]|=(this.s&s)<<i),t.t=this.t-n,t.clamp()},e.prototype.subTo=function(e,t){var n=0,r=0,i=Math.min(e.t,this.t);while(n<i)r+=this[n]-e[n],t[n++]=r&this.DM,r>>=this.DB;if(e.t<this.t){r-=e.s;while(n<this.t)r+=this[n],t[n++]=r&this.DM,r>>=this.DB;r+=this.s}else{r+=this.s;while(n<e.t)r-=e[n],t[n++]=r&this.DM,r>>=this.DB;r-=e.s}t.s=r<0?-1:0,r<-1?t[n++]=this.DV+r:r>0&&(t[n++]=r),t.t=n,t.clamp()},e.prototype.multiplyTo=function(t,n){var r=this.abs(),i=t.abs(),s=r.t;n.t=s+i.t;while(--s>=0)n[s]=0;for(s=0;s<i.t;++s)n[s+r.t]=r.am(0,i[s],n,s,0,r.t);n.s=0,n.clamp(),this.s!=t.s&&e.ZERO.subTo(n,n)},e.prototype.squareTo=function(e){var t=this.abs(),n=e.t=2*t.t;while(--n>=0)e[n]=0;for(n=0;n<t.t-1;++n){var r=t.am(n,t[n],e,2*n,0,1);(e[n+t.t]+=t.am(n+1,2*t[n],e,2*n+1,r,t.t-n-1))>=t.DV&&(e[n+t.t]-=t.DV,e[n+t.t+1]=1)}e.t>0&&(e[e.t-1]+=t.am(n,t[n],e,2*n,0,1)),e.s=0,e.clamp()},e.prototype.divRemTo=function(t,n,i){var s=t.abs();if(s.t<=0)return;var o=this.abs();if(o.t<s.t){n!=null&&n.fromInt(0),i!=null&&this.copyTo(i);return}i==null&&(i=new e(null));var u=new e(null),a=this.s,f=t.s,l=this.DB-r(s[s.t-1]);l>0?(s.lShiftTo(l,u),o.lShiftTo(l,i)):(s.copyTo(u),o.copyTo(i));var c=u.t,h=u[c-1];if(h==0)return;var p=h*(1<<this.F1)+(c>1?u[c-2]>>this.F2:0),d=this.FV/p,v=(1<<this.F1)/p,m=1<<this.F2,g=i.t,y=g-c,b=n==null?new e(null):n;u.dlShiftTo(y,b),i.compareTo(b)>=0&&(i[i.t++]=1,i.subTo(b,i)),e.ONE.dlShiftTo(c,b),b.subTo(u,u);while(u.t<c)u[u.t++]=0;while(--y>=0){var w=i[--g]==h?this.DM:Math.floor(i[g]*d+(i[g-1]+m)*v);if((i[g]+=u.am(0,w,i,y,0,c))<w){u.dlShiftTo(y,b),i.subTo(b,i);while(i[g]<--w)i.subTo(b,i)}}n!=null&&(i.drShiftTo(c,n),a!=f&&e.ZERO.subTo(n,n)),i.t=c,i.clamp(),l>0&&i.rShiftTo(l,i),a<0&&e.ZERO.subTo(i,i)},e.prototype.mod=function(t){var n=new e(null);return this.abs().divRemTo(t,null,n),this.s<0&&n.compareTo(e.ZERO)>0&&t.subTo(n,n),n},i.prototype.convert=function(e){return e.s<0||e.compareTo(this.m)>=0?e.mod(this.m):e},i.prototype.revert=function(e){return e},i.prototype.reduce=function(e){e.divRemTo(this.m,null,e)},i.prototype.mulTo=function(e,t,n){e.multiplyTo(t,n),this.reduce(n)},i.prototype.sqrTo=function(e,t){e.squareTo(t),this.reduce(t)},e.prototype.invDigit=function(){if(this.t<1)return 0;var e=this[0];if((e&1)==0)return 0;var t=e&3;return t=t*(2-(e&15)*t)&15,t=t*(2-(e&255)*t)&255,t=t*(2-((e&65535)*t&65535))&65535,t=t*(2-e*t%this.DV)%this.DV,t>0?this.DV-t:-t},s.prototype.convert=function(t){var n=new e(null);return t.abs().dlShiftTo(this.m.t,n),n.divRemTo(this.m,null,n),t.s<0&&n.compareTo(e.ZERO)>0&&this.m.subTo(n,n),n},s.prototype.revert=function(t){var n=new e(null);return t.copyTo(n),this.reduce(n),n},s.prototype.reduce=function(e){while(e.t<=this.mt2)e[e.t++]=0;for(var t=0;t<this.m.t;++t){var n=e[t]&32767,r=n*this.mpl+((n*this.mph+(e[t]>>15)*this.mpl&this.um)<<15)&e.DM;n=t+this.m.t,e[n]+=this.m.am(0,r,e,t,0,this.m.t);while(e[n]>=e.DV)e[n]-=e.DV,e[++n]++}e.clamp(),e.drShiftTo(this.m.t,e),e.compareTo(this.m)>=0&&e.subTo(this.m,e)},s.prototype.sqrTo=function(e,t){e.squareTo(t),this.reduce(t)},s.prototype.mulTo=function(e,t,n){e.multiplyTo(t,n),this.reduce(n)},e.prototype.isEven=function(){return(this.t>0?this[0]&1:this.s)==0},e.prototype.exp=function(t,n){if(t>4294967295||t<1)return e.ONE;var i=new e(null),s=new e(null),o=n.convert(this),u=r(t)-1;o.copyTo(i);while(--u>=0){n.sqrTo(i,s);if((t&1<<u)>0)n.mulTo(s,o,i);else{var a=i;i=s,s=a}}return n.revert(i)},e.prototype.modPowInt=function(e,t){var n;return e<256||t.isEven()?n=new i(t):n=new s(t),this.exp(e,n)},e.ZERO=(new e(null)).fromInt(0),e.ONE=(new e(null)).fromInt(1),e.prototype.clone=function(){var t=new e(null);return this.copyTo(t),t},e.prototype.intValue=function(){if(this.s<0){if(this.t==1)return this[0]-this.DV;if(this.t==0)return-1}else{if(this.t==1)return this[0];if(this.t==0)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},e.prototype.byteValue=function(){return this.t==0?this.s:this[0]<<24>>24},e.prototype.shortValue=function(){return this.t==0?this.s:this[0]<<16>>16},e.prototype.chunkSize=function(e){return Math.floor(Math.LN2*this.DB/Math.log(e))},e.prototype.signum=function(){return this.s<0?-1:this.t<=0||this.t==1&&this[0]<=0?0:1},e.prototype.toRadix=function(t){t==null&&(t=10);if(this.signum()==0||t<2||t>36)return"0";var n=this.chunkSize(t),r=Math.pow(t,n),i=(new e(null)).fromInt(r),s=new e(null),o=new e(null),u="";this.divRemTo(i,s,o);while(s.signum()>0)u=(r+o.intValue()).toString(t).substr(1)+u,s.divRemTo(i,s,o);return o.intValue().toString(t)+u},e.prototype.fromRadix=function(n,r){this.fromInt(0),r==null&&(r=10);var i=this.chunkSize(r),s=Math.pow(r,i),o=!1,u=0,a=0;for(var f=0;f<n.length;++f){var l=t(n,f);if(l<0){n.charAt(f)=="-"&&this.signum()==0&&(o=!0);continue}a=r*a+l,++u>=i&&(this.dMultiply(s),this.dAddOffset(a,0),u=0,a=0)}u>0&&(this.dMultiply(Math.pow(r,u)),this.dAddOffset(a,0)),o&&e.ZERO.subTo(this,this)},e.prototype.fromNumber=function(t,n,r){if("number"==typeof n)if(t<2)this.fromInt(1);else{this.fromNumber(t,r),this.testBit(t-1)||this.bitwiseTo(e.ONE.shiftLeft(t-1),function(e,t){return e|t},this),this.isEven()&&this.dAddOffset(1,0);while(!this.isProbablePrime(n))this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(e.ONE.shiftLeft(t-1),this)}else{var i=new Array,s=t&7;i.length=(t>>3)+1,n.nextBytes(i),s>0?i[0]&=(1<<s)-1:i[0]=0,this.fromString(i,256)}},e.prototype.toByteArray=function(){var e=this.t,t=new Array;t[0]=this.s;var n=this.DB-e*this.DB%8,r,i=0;if(e-->0){n<this.DB&&(r=this[e]>>n)!=(this.s&this.DM)>>n&&(t[i++]=r|this.s<<this.DB-n);while(e>=0){n<8?(r=(this[e]&(1<<n)-1)<<8-n,r|=this[--e]>>(n+=this.DB-8)):(r=this[e]>>(n-=8)&255,n<=0&&(n+=this.DB,--e)),(r&128)!=0&&(r|=-256),i==0&&(this.s&128)!=(r&128)&&++i;if(i>0||r!=this.s)t[i++]=r}}return t},e.prototype.equals=function(e){return this.compareTo(e)==0},e.prototype.min=function(e){return this.compareTo(e)<0?this:e},e.prototype.max=function(e){return this.compareTo(e)>0?this:e},e.prototype.bitwiseTo=function(e,t,n){var r,i,s=Math.min(e.t,this.t);for(r=0;r<s;++r)n[r]=t(this[r],e[r]);if(e.t<this.t){i=e.s&this.DM;for(r=s;r<this.t;++r)n[r]=t(this[r],i);n.t=this.t}else{i=this.s&this.DM;for(r=s;r<e.t;++r)n[r]=t(i,e[r]);n.t=e.t}n.s=t(this.s,e.s),n.clamp()},e.prototype.and=function(t){var n=new e(null);return this.bitwiseTo(t,function(e,t){return e&t},n),n},e.prototype.or=function(t){var n=new e(null);return this.bitwiseTo(t,function(e,t){return e|t},n),n},e.prototype.xor=function(t){var n=new e(null);return this.bitwiseTo(t,function(e,t){return e^t},n),n},e.prototype.andNot=function(t){var n=new e(null);return this.bitwiseTo(t,function(e,t){return e&~t},n),n},e.prototype.not=function(){var t=new e(null);for(var n=0;n<this.t;++n)t[n]=this.DM&~this[n];return t.t=this.t,t.s=~this.s,t},e.prototype.shiftLeft=function(t){var n=new e(null);return t<0?this.rShiftTo(-t,n):this.lShiftTo(t,n),n},e.prototype.shiftRight=function(t){var n=new e(null);return t<0?this.lShiftTo(-t,n):this.rShiftTo(t,n),n},e.prototype.getLowestSetBit=function(e){return function(){for(var t=0;t<this.t;++t)if(this[t]!=0)return t*this.DB+e(this[t]);return this.s<0?this.t*this.DB:-1}}(function(e){if(e==0)return-1;var t=0;return(e&65535)==0&&(e>>=16,t+=16),(e&255)==0&&(e>>=8,t+=8),(e&15)==0&&(e>>=4,t+=4),(e&3)==0&&(e>>=2,t+=2),(e&1)==0&&++t,t}),e.prototype.bitCount=function(e){return function(){var t=0,n=this.s&this.DM;for(var r=0;r<this.t;++r)t+=e(this[r]^n);return t}}(function(e){var t=0;while(e!=0)e&=e-1,++t;return t}),e.prototype.testBit=function(e){var t=Math.floor(e/this.DB);return t>=this.t?this.s!=0:(this[t]&1<<e%this.DB)!=0},e.prototype.changeBit=function(t,n){var r=e.ONE.shiftLeft(t);return this.bitwiseTo(r,n,r),r},e.prototype.setBit=function(e){return this.changeBit(e,function(e,t){return e|t})},e.prototype.clearBit=function(e){return this.changeBit(e,function(e,t){return e&~t})},e.prototype.flipBit=function(e){return this.changeBit(e,function(e,t){return e^t})},e.prototype.addTo=function(e,t){var n=0,r=0,i=Math.min(e.t,this.t);while(n<i)r+=this[n]+e[n],t[n++]=r&this.DM,r>>=this.DB;if(e.t<this.t){r+=e.s;while(n<this.t)r+=this[n],t[n++]=r&this.DM,r>>=this.DB;r+=this.s}else{r+=this.s;while(n<e.t)r+=e[n],t[n++]=r&this.DM,r>>=this.DB;r+=e.s}t.s=r<0?-1:0,r>0?t[n++]=r:r<-1&&(t[n++]=this.DV+r),t.t=n,t.clamp()},e.prototype.add=function(t){var n=new e(null);return this.addTo(t,n),n},e.prototype.subtract=function(t){var n=new e(null);return this.subTo(t,n),n},e.prototype.multiply=function(t){var n=new e(null);return this.multiplyTo(t,n),n},e.prototype.square=function(){var t=new e(null);return this.squareTo(t),t},e.prototype.divide=function(t){var n=new e(null);return this.divRemTo(t,n,null),n},e.prototype.remainder=function(t){var n=new e(null);return this.divRemTo(t,null,n),n},e.prototype.divideAndRemainder=function(t){var n=new e(null),r=new e(null);return this.divRemTo(t,n,r),new Array(n,r)},e.prototype.dMultiply=function(e){this[this.t]=this.am(0,e-1,this,0,0,this.t),++this.t,this.clamp()},e.prototype.dAddOffset=function(e,t){if(e==0)return;while(this.t<=t)this[this.t++]=0;this[t]+=e;while(this[t]>=this.DV)this[t]-=this.DV,++t>=this.t&&(this[this.t++]=0),++this[t]},o.prototype.convert=function(e){return e},o.prototype.revert=function(e){return e},o.prototype.mulTo=function(e,t,n){e.multiplyTo(t,n)},o.prototype.sqrTo=function(e,t){e.squareTo(t)},e.prototype.pow=function(e){return this.exp(e,new o)},e.prototype.multiplyLowerTo=function(e,t,n){var r=Math.min(this.t+e.t,t);n.s=0,n.t=r;while(r>0)n[--r]=0;var i;for(i=n.t-this.t;r<i;++r)n[r+this.t]=this.am(0,e[r],n,r,0,this.t);for(i=Math.min(e.t,t);r<i;++r)this.am(0,e[r],n,r,0,t-r);n.clamp()},e.prototype.multiplyUpperTo=function(e,t,n){--t;var r=n.t=this.t+e.t-t;n.s=0;while(--r>=0)n[r]=0;for(r=Math.max(t-this.t,0);r<e.t;++r)n[this.t+r-t]=this.am(t-r,e[r],n,0,0,this.t+r-t);n.clamp(),n.drShiftTo(1,n)},u.prototype.convert=function(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var n=new e(null);return t.copyTo(n),this.reduce(n),n},u.prototype.revert=function(e){return e},u.prototype.reduce=function(e){e.drShiftTo(this.m.t-1,this.r2),e.t>this.m.t+1&&(e.t=this.m.t+1,e.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);while(e.compareTo(this.r2)<0)e.dAddOffset(1,this.m.t+1);e.subTo(this.r2,e);while(e.compareTo(this.m)>=0)e.subTo(this.m,e)},u.prototype.sqrTo=function(e,t){e.squareTo(t),this.reduce(t)},u.prototype.mulTo=function(e,t,n){e.multiplyTo(t,n),this.reduce(n)},e.prototype.modPow=function(t,n){var o=t.bitLength(),a,f=(new e(null)).fromInt(1),l;if(o<=0)return f;o<18?a=1:o<48?a=3:o<144?a=4:o<768?a=5:a=6,o<8?l=new i(n):n.isEven()?l=new u(n):l=new s(n);var c=new Array,h=3,p=a-1,d=(1<<a)-1;c[1]=l.convert(this);if(a>1){var v=new e(null);l.sqrTo(c[1],v);while(h<=d)c[h]=new e(null),l.mulTo(v,c[h-2],c[h]),h+=2}var m=t.t-1,g,y=!0,b=new e(null),w;o=r(t[m])-1;while(m>=0){o>=p?g=t[m]>>o-p&d:(g=(t[m]&(1<<o+1)-1)<<p-o,m>0&&(g|=t[m-1]>>this.DB+o-p)),h=a;while((g&1)==0)g>>=1,--h;(o-=h)<0&&(o+=this.DB,--m);if(y)c[g].copyTo(f),y=!1;else{while(h>1)l.sqrTo(f,b),l.sqrTo(b,f),h-=2;h>0?l.sqrTo(f,b):(w=f,f=b,b=w),l.mulTo(b,c[g],f)}while(m>=0&&(t[m]&1<<o)==0)l.sqrTo(f,b),w=f,f=b,b=w,--o<0&&(o=this.DB-1,--m)}return l.revert(f)},e.prototype.gcd=function(e){var t=this.s<0?this.negate():this.clone(),n=e.s<0?e.negate():e.clone();if(t.compareTo(n)<0){var r=t;t=n,n=r}var i=t.getLowestSetBit(),s=n.getLowestSetBit();if(s<0)return t;i<s&&(s=i),s>0&&(t.rShiftTo(s,t),n.rShiftTo(s,n));while(t.signum()>0)(i=t.getLowestSetBit())>0&&t.rShiftTo(i,t),(i=n.getLowestSetBit())>0&&n.rShiftTo(i,n),t.compareTo(n)>=0?(t.subTo(n,t),t.rShiftTo(1,t)):(n.subTo(t,n),n.rShiftTo(1,n));return s>0&&n.lShiftTo(s,n),n},e.prototype.modInt=function(e){if(e<=0)return 0;var t=this.DV%e,n=this.s<0?e-1:0;if(this.t>0)if(t==0)n=this[0]%e;else for(var r=this.t-1;r>=0;--r)n=(t*n+this[r])%e;return n},e.prototype.modInverse=function(t){var n=t.isEven();if(this.isEven()&&n||t.signum()==0)return e.ZERO;var r=t.clone(),i=this.clone(),s=(new e(null)).fromInt(1),o=(new e(null)).fromInt(0),u=(new e(null)).fromInt(0),a=(new e(null)).fromInt(1);while(r.signum()!=0){while(r.isEven()){r.rShiftTo(1,r);if(n){if(!s.isEven()||!o.isEven())s.addTo(this,s),o.subTo(t,o);s.rShiftTo(1,s)}else o.isEven()||o.subTo(t,o);o.rShiftTo(1,o)}while(i.isEven()){i.rShiftTo(1,i);if(n){if(!u.isEven()||!a.isEven())u.addTo(this,u),a.subTo(t,a);u.rShiftTo(1,u)}else a.isEven()||a.subTo(t,a);a.rShiftTo(1,a)}r.compareTo(i)>=0?(r.subTo(i,r),n&&s.subTo(u,s),o.subTo(a,o)):(i.subTo(r,i),n&&u.subTo(s,u),a.subTo(o,a))}return i.compareTo(e.ONE)!=0?e.ZERO:a.compareTo(t)>=0?a.subtract(t):a.signum()<0?(a.addTo(t,a),a.signum()<0?a.add(t):a):a},function(){var t=[];"020305070b0d0h0j0n0t0v1115171b1h1n1p1v1z21272b2h2p2t2v2z31353j3n3t3v45474d4j4n4t4z515b5d5h5j5v676b6d6h6n6p6z757b7h7j7p7t7v858j8n8p8t979d9n9p9t9za7adajanatb1b5bdbnbpbzc1c7cbchcpctcvczdbdjdndvdze5ehejf1f7fhfnftfvg1gbghgngpgvh1h5h7hjhthvhzi5ibidipitizj7jhjpjzk7kdkjknkvl1l5ldlhlvm5mhmjmtmvmzn1nbnpntnvnzodohojonp7pbpjptq1q5qbqhqvqzr5rbrjrp".split("").reduce(function(e,n,r){return r%2==1&&t.push(parseInt(e+n,36)),n});var n=(1<<26)/t[t.length-1];e.prototype.isProbablePrime=function(e){var r,i=this.abs();if(i.t==1&&i[0]<=t[t.length-1]){for(r=0;r<t.length;++r)if(i[0]==t[r])return!0;return!1}if(i.isEven())return!1;r=1;while(r<t.length){var s=t[r],o=r+1;while(o<t.length&&s<n)s*=t[o++];s=i.modInt(s);while(r<o)if(s%t[r++]==0)return!1}return i.millerRabin(e)},e.prototype.millerRabin=function(n){var r=this.subtract(e.ONE),i=r.getLowestSetBit();if(i<=0)return!1;var s=r.shiftRight(i);n=n+1>>1,n>t.length&&(n=t.length);var o=new e(null);for(var u=0;u<n;++u){o.fromInt(t[Math.floor(Math.random()*t.length)]);var a=o.modPow(s,this);if(a.compareTo(e.ONE)!=0&&a.compareTo(r)!=0){var f=1;while(f++<i&&a.compareTo(r)!=0){a=a.modPowInt(2,this);if(a.compareTo(e.ONE)==0)return!1}if(a.compareTo(r)!=0)return!1}}return!0}}(),f.prototype.setPublic=function(t,n){if(!(t!=null&&n!=null&&t.length>0&&n.length>0))throw new Error("Invalid RSA public key");this.n=new e(t,16),this.e=parseInt(n,16)},f.prototype.doPublic=function(e){return e.modPowInt(this.e,this.n)},f.prototype.encrypt=function(e){var t=a(e,this.n.bitLength()+7>>3);if(t==null)return null;var n=this.doPublic(t);if(n==null)return null;var r=n.toString(16);return(r.length&1)==0?r:"0"+r},f.prototype.setPrivate=function(t,n,r){if(!(t!=null&&n!=null&&t.length>0&&n.length>0))throw new Error("Invalid RSA private key");this.n=new e(t,16),this.e=parseInt(n,16),this.d=new e(r,16)},f.prototype.setPrivateEx=function(t,n,r,i,s,o,u,a){if(!(t!=null&&n!=null&&t.length>0&&n.length>0))throw new Error("Invalid RSA private key");this.n=new e(t,16),this.e=parseInt(n,16),this.d=new e(r,16),this.p=new e(i,16),this.q=new e(s,16),this.dmp1=new e(o,16),this.dmq1=new e(u,16),this.coeff=new e(a,16)},f.prototype.generate=function(t,n){var r=new ft,i=t>>1;this.e=parseInt(n,16);var s=new e(n,16);for(;;){for(;;){this.p=new e(t-i,1,r);if(this.p.subtract(e.ONE).gcd(s).compareTo(e.ONE)==0&&this.p.isProbablePrime(10))break}for(;;){this.q=new e(i,1,r);if(this.q.subtract(e.ONE).gcd(s).compareTo(e.ONE)==0&&this.q.isProbablePrime(10))break}if(this.p.compareTo(this.q)<=0){var o=this.p;this.p=this.q,this.q=o}var u=this.p.subtract(e.ONE),a=this.q.subtract(e.ONE),f=u.multiply(a);if(f.gcd(s).compareTo(e.ONE)==0){this.n=this.p.multiply(this.q),this.d=s.modInverse(f),this.dmp1=this.d.mod(u),this.dmq1=this.d.mod(a),this.coeff=this.q.modInverse(this.p);break}}},f.prototype.doPrivate=function(e){if(this.p==null||this.q==null)return e.modPow(this.d,this.n);var t=e.mod(this.p).modPow(this.dmp1,this.p),n=e.mod(this.q).modPow(this.dmq1,this.q);while(t.compareTo(n)<0)t=t.add(this.p);return t.subtract(n).multiply(this.coeff).mod(this.p).multiply(this.q).add(n)},f.prototype.decrypt=function(t){var n=new e(t,16),r=this.doPrivate(n);return r==null?null:l(r,this.n.bitLength()+7>>3)},SHA1=function(e){function t(e,t){return e<<t|e>>>32-t}e+="";for(var n=Math,r=[1518500249,1859775393,2400959708,3395469782,1732584193,4023233417,2562383102,271733878,3285377520,4294967295],i=n.ceil(e.length/4)+2,s=n.ceil(i/16),o=[],u=0,a=[],f,l,c,h,p,d,v,m;u<s;u++){o[u]=[];for(m=0;m<16;m++){function g(t,n){return e.charCodeAt(u*64+m*4+t)<<n}o[u][m]=g(0,24)|g(1,16)|g(2,8)|g(3,0)}}d=e.length*8-8,u=s-1,o[u][14]=d/(r[9]+1),o[u][14]=n.floor(o[u][14]),o[u][15]=d&r[9];for(u=0;u<s;u++){for(v=0;v<16;v++)a[v]=o[u][v];for(v=16;v<80;v++)a[v]=t(a[v-3]^a[v-8]^a[v-14]^a[v-16],1);f=r[4],l=r[5],c=r[6],h=r[7],p=r[8];for(v=0;v<80;v++){var y=n.floor(v/20),b=t(f,5)+(y<1?l&c^~l&h:y==2?l&c^l&h^c&h:l^c^h)+p+r[y]+a[v]&r[9];p=h,h=c,c=t(l,30),l=f,f=b}r[4]+=f,r[5]+=l,r[6]+=c,r[7]+=h,r[8]+=p}d="";for(z=4;z<9;z++)for(u=7;u>=0;u--)d+=((r[z]&r[9])>>>u*4&15).toString(16);return d},x.getByteLengthOfL_AtObj=c,x.getHexOfL_AtObj=h,x.getIntOfL_AtObj=p,x.getStartPosOfV_AtObj=d,x.getHexOfV_AtObj=v,x.getHexOfTLV_AtObj=m,x.getPosOfNextSibling_AtObj=g,x.getPosArrayOfChildren_AtObj=y,x.getNthChildIndex_AtObj=b,x.getDecendantIndexByNthList=w,x.getDecendantHexVByNthList=S,x.getDecendantHexTLVByNthList=E,f.prototype.readPrivateKeyFromPEMString=k;var L=[];L.sha1="3021300906052b0e03021a05000414",L.sha256="3031300d060960864801650304020105000420",L.sha384="3041300d060960864801650304020205000430",L.sha512="3051300d060960864801650304020305000440",L.md2="3020300c06082a864886f70d020205000410",L.md5="3020300c06082a864886f70d020505000410",L.ripemd160="3021300906052b2403020105000414";var A=[];A.sha1=function(e){return hex_sha1(e)},A.sha256=function(e){return hex_sha256(e)},A.sha512=function(e){return hex_sha512(e)},A.md5=function(e){return hex_md5(e)},A.ripemd160=function(e){return hex_rmd160(e)};var O=new RegExp("");O.compile("[^0-9a-f]","gi"),f.prototype.signString=D,f.prototype.signStringWithSHA1=P,f.prototype.signStringWithSHA256=H,f.prototype.sign=D,f.prototype.signWithSHA1=P,f.prototype.signWithSHA256=H,f.prototype.verifyString=R,f.prototype.verifyHexSignatureForMessage=q,f.prototype.verify=R,f.prototype.verifyHexSignatureForByteArrayMessage=q,_x509_DN_ATTRHEX={"0603550406":"C","060355040a":"O","060355040b":"OU","0603550403":"CN","0603550405":"SN","0603550408":"ST","0603550407":"L"},ut.prototype.readCertPEM=st,ut.prototype.readCertPEMWithoutRSAInit=ot,ut.prototype.getSerialNumberHex=Q,ut.prototype.getIssuerHex=G,ut.prototype.getSubjectHex=Z,ut.prototype.getIssuerString=Y,ut.prototype.getSubjectString=et,ut.prototype.getNotBefore=tt,ut.prototype.getNotAfter=nt,A={sha1:function(e){return SHA1(e)}},ft.prototype.nextBytes=function(e){for(var t=0;t<e.length;t++)e[t]=Math.floor(Math.random()*256)},self.webkitPostMessage&&(self.postMessage=self.webkitPostMessage),self.onmessage=function(e){switch(e.data.name){case"generatePrivateKeySign":var t=lt(e.data.exponent,e.data.zip);postMessage({name:"generatePrivateKeySign",publicKey:t.publicKey,sign:t.sign,callback:e.data.callback},[t.publicKey,t.sign]);break;case"generateCrx":var t=ht(e.data.publicKey,e.data.signature);postMessage({name:"generateCRX",crxHeader:t,callback:e.data.callback},[t]);break;default:}}}.toString()+"())"]))}())