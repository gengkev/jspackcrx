// ok so first we need to load scripts.js
//Options
loadDeflate=true; //load DEFLATE algorithm for JSZip
libdir="/libs/"; //either specify undefined to get from code hosting or a directory to obtain scripts
//end options



if (typeof libdir=="undefined") libdir=(location.protocol=="https")?"https":"http"+"://jspackcrx.googlecode.com/svn/trunk/libs/";
else if (libdir.test(new RegExp("/$"))==false) libdir+="/";

//load script.js
(function(d,s){var t=d.createElement(s);f=d.getElementsByTagName(s)[0];t.async=!!t.type='text/javascript';
  t.src=libdir+"script.min.js";t.onload=function(){
    $script(libdir+"jszip.min.js");
	(loadDeflate)?$script(libdir+"jszipdeflate.min.js");
  }
  f.parentNode.insertBefore(t,f);
})(document,'script');


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
JSCrx.prototype.generate=function(asBytes,pemFile,callback) {
  //first, validate the locales once more?
  if (this.validateManifests==true) {
  }
  // ** SKIP FOR NOW **
  
  JSCrx.generateZip(asBytes,this.JSZip.generate(asBytes),pemFile,callback);
  
  return this;
}
JSCrx.generateZip=function(asBytes,zipFile,pemFile,callback)
  //create RSA key, sign, append header, callback
  if (!window.Worker) {
    this.onerror("Web Workers are not supported!");
    return;
  }
  var worker=new Worker("genrsa.js");
  worker.onmessage=function(evt){
  switch(evt.name) {
    case "loadready":
	  worker.postMessage({name:"libdir",message:libdir});
	  break;
	case "processready":
	  worker.postMessage({name:"genrsadetails",message:{
	    message:pemFile
	  }});
	  break;
	case "beginrsakeygen":
	  break;
	default:
	  break;
  }
  }
  
}