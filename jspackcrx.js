//umm first we need JSZip
/**

Compiled on 4/4/2011 using the Closure Compiler, with simple optimization.
http://closure-compiler.appspot.com/

---------------------------------------------------

JSZip - A Javascript class for generating Zip files
<http://jszip.stuartk.co.uk>

(c) 2009 Stuart Knightley <stuart [at] stuartk.co.uk>
Licenced under the GPLv3 and the MIT licences

Usage:
zip = new JSZip();
zip.add("hello.txt", "Hello, World!").add("tempfile", "nothing");
zip.folder("images").add("smile.gif", base64Data, {base64: true});
zip.add("Xmas.txt", "Ho ho ho !", {date : new Date("December 25, 2007 00:00:01")});
zip.remove("tempfile");

base64zip = zip.generate();

**/

function JSZip(a){this.compression=(a||"STORE").toUpperCase();this.files=[];this.root="";this.d={base64:!1,binary:!1,dir:!1,date:null};if(!JSZip.compressions[this.compression])throw a+" is not a valid compression method !";}
JSZip.prototype.add=function(a,c,b){b=b||{};a=this.root+a;if(b.base64===!0&&b.binary==null)b.binary=!0;for(var d in this.d)b[d]=b[d]||this.d[d];b.date=b.date||new Date;var e;d=b.date.getHours();d<<=6;d|=b.date.getMinutes();d<<=5;d|=b.date.getSeconds()/2;e=b.date.getFullYear()-1980;e<<=4;e|=b.date.getMonth()+1;e<<=5;e|=b.date.getDate();b.base64===!0&&(c=JSZipBase64.decode(c));b.binary===!1&&(c=this.utf8encode(c));var g=JSZip.compressions[this.compression],h=g.compress(c),f="";f+="\n\0";f+="\0\0";f+=
g.magic;f+=this.decToHex(d,2);f+=this.decToHex(e,2);f+=this.decToHex(this.crc32(c),4);f+=this.decToHex(h.length,4);f+=this.decToHex(c.length,4);f+=this.decToHex(a.length,2);f+="\0\0";this.files[a]={header:f,data:h,dir:b.dir};return this};JSZip.prototype.folder=function(a){a.substr(-1)!="/"&&(a+="/");typeof this.files[a]==="undefined"&&this.add(a,"",{dir:!0});var c=this.clone();c.root=this.root+a;return c};
JSZip.prototype.find=function(a){var c=[];a=typeof a==="string"?RegExp("^"+a+"$"):a;for(var b in this.files)if(a.test(b)){var d=this.files[b];c.push({name:b,data:d.data,dir:!!d.dir})}return c};JSZip.prototype.remove=function(a){var c=this.files[a];c||(a.substr(-1)!="/"&&(a+="/"),c=this.files[a]);if(c)if(a.match("/")===null)delete this.files[a];else{c=this.find(RegExp("^"+a));for(var b=0;b<c.length;b++)c[b].name==a?delete this.files[a]:this.remove(c[b].name)}return this};
JSZip.prototype.generate=function(a){a=a||!1;var c=[],b=[],d=0,e;for(e in this.files)if(this.files.hasOwnProperty(e)){var g="",h="";g="PK\u0003\u0004"+this.files[e].header+e+this.files[e].data;h="PK\u0001\u0002\u0014\0"+this.files[e].header+"\0\0\0\0\0\0"+(this.files[e].dir===!0?"\u0010\0\0\0":"\0\0\0\0")+this.decToHex(d,4)+e;d+=g.length;b.push(g);c.push(h)}d=b.join("");c=c.join("");e="";e="PK\u0005\u0006\0\0\0\0"+this.decToHex(b.length,2)+this.decToHex(b.length,2)+this.decToHex(c.length,4)+this.decToHex(d.length,
4)+"\0\0";b=d+c+e;return a?b:JSZipBase64.encode(b)};JSZip.compressions={STORE:{magic:"\0\0",compress:function(a){return a}}};JSZip.prototype.decToHex=function(a,c){for(var b="",d=0;d<c;d++)b+=String.fromCharCode(a&255),a>>>=8;return b};
JSZip.prototype.crc32=function(a,c){if(a==="")return"\0\0\0\0";typeof c=="undefined"&&(c=0);var b=0;b=0;c^=-1;for(var d=0,e=a.length;d<e;d++)b=(c^a.charCodeAt(d))&255,b="0x"+"00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".substr(b*9,
8),c=c>>>8^b;return c^-1};JSZip.prototype.clone=function(){var a=new JSZip,c;for(c in this)typeof this[c]!=="function"&&(a[c]=this[c]);return a};JSZip.prototype.utf8encode=function(a){a=encodeURIComponent(a);return a=a.replace(/%.{2,2}/g,function(a){a=a.substring(1);return String.fromCharCode(parseInt(a,16))})};
var JSZipBase64=function(){return{encode:function(a){for(var c="",b,d,e,g,h,f,i=0;i<a.length;)b=a.charCodeAt(i++),d=a.charCodeAt(i++),e=a.charCodeAt(i++),g=b>>2,b=(b&3)<<4|d>>4,h=(d&15)<<2|e>>6,f=e&63,isNaN(d)?h=f=64:isNaN(e)&&(f=64),c=c+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f);
return c},decode:function(a){var c="",b,d,e,g,h,f=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");f<a.length;)b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),b=b<<2|d>>4,d=(d&15)<<4|
g>>2,e=(g&3)<<6|h,c+=String.fromCharCode(b),g!=64&&(c+=String.fromCharCode(d)),h!=64&&(c+=String.fromCharCode(e));return c}}}();

// --------------------------------
// Okay end JSZip!
// --------------------------------

function JSCrx(validateManifests,compression) {
  if (typeof validateManifests=="undefined") {
    this.validateManifests=true;
  }
  else {
    this.validateManifests=validateManifests;
  }
  this.compression=(compression||"STORE").toUpperCase();
  if (!JSZip.compressions[this.compression]) {
    throw compression + " is not a valid compression method !";
    this.JSZip=new JSZip(compressionMethod);
  }
  this.onerror=Function();
}
JSCrx.prototype.manifest=function(data) {
  if (this.validateManifests==true) {
    //validate here I supposes
  }
  this.JSZip.add("manifest.json",data);
  return this;
}
JSCrx.prototype.locale=function(locale,data) {
  var supportedLocales=["ar","bg","ca","cs","da","de","el","en","en_GB","en_US","es",
    "es_419","et","fi","fil","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv",
	"nl","no","pl","pt_BR","pt_PT","ro","ru","sk","sl","sr","sv","th","tr","uk","vi",
	"zh_CN","zh_TW"];
  for (var i=0,valid=false;i<supportedLocales.length;i++) {
    if (locale==supportedLocales[i]) {
	  valid=true;
	  break;
	}
  }
  if (valid==false) {
    this.onerror(locale+" locale not supported! (Must be case-sensitive)");
	return this;
  }
  else if (!(this.JSZip.find("_locales")[0].name=="_locales")) {
    this.JSZip.folder("_locales");
  }
  else if (this.JSZip.find("_locales/"+locale)!={}) {
    this.JSZip.remove("_locales/"+locale);
  }
  if (this.validateManifests==true) {
    //validate here I suppose
  }
  this.JSZip.folder("_locales/"+locale);
  this.JSZip.add("_locales/"+locale+"/messages.json",data);
  
  return this;
}
JSCrx.prototype.add=function(name,data,options) {
  if (name.indexOf("manifest.json")!=-1||name.indexOf("_locales")!=-1) {
    this.onerror("Tried to add manifest or locale using add function. Please use manifest() and locale() as appropriate instead.");
	return this;
  }
  this.JSZip.add(name,data,options);
  return this;
}
JSCrx.prototype.folder=function(name) {
  if (name.indexOf("_locales")!=-1) {
    this.onerror("Tried to add _locales folder. Please use locale() instead.");
    return this;
  }
  this.JSZip.folder(name);
}
JSCrx.prototype.find=function(needle) {
  return this.JSZip.find(needle);
}
JSCrx.prototype.remove=function(name) {
  this.JSZip.remove(name);
  return this;
}
JSCrx.prototype.generate=function(asBytes,pemFile,randomData) {
  //first, validate the locales once more?
  // ** SKIP FOR NOW **
  
  //do two things at once: generate RSA key and also generate zip file. then execute signing there and then report back here to append sigs
  if (!window.Worker) {
    this.onerror("Web Workers are not supported!");
    return;
  }
  var worker=new Worker("genrsa.js");
}