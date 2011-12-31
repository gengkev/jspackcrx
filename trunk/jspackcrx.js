/**
 * @fileoverview The main script loaded into pages using JSPackCrx.
 *   It loads scripts and adds the generateCRX function to JSZip.
 * @author gengkev@gmail.com
 */




// ok so first we need to load scripts.js
//Options
var libdir="/libs/"; //either specify undefined to get from code hosting or a directory to obtain scripts
//end options

if (!JSZip) throw new Error("Need JSZip!");

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



JSZip.prototype.generateCRX=function(asBytes,zipFile,pemFile,callback)
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