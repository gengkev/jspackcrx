# Introduction #

hi! here's a nice list of the other libraries that jspackcrx depends on. Though it loads these in its worker so yeah.


# Details #

Core library:
  * [jsbn](http://www-cs-students.stanford.edu/~tjw/jsbn/) (modified) A really big part of what happens in the library, I rewrote a large portion of it to remove global scope pollution but I might just stick it in a closure
    * Instead of using its RNG library I just switched it to a simple `Math.random()` call, which is cryptographically secure in WebKit
  * [RSA-Sign](http://www9.atwiki.jp/kurushima/pub/jsrsa/) (modified) Maybe not exactly good JS practice either, but hey, it's implemented, and I'm too lazy to write it myself :c
  * [antimatter15's SHA1](http://antimatter15.com/wp/2010/01/javascript-sha1-and-sha256-in-1-kb/) / [gist](https://gist.github.com/267720) Well, it's good it doesn't have UTF-8 encoding which is what caused jshash to not work

Demo page:
  * [FileSaver.js](https://github.com/eligrey/FileSaver.js) for downloading files, since assigning a location to a data URI did not work :(
  * [JSZip](http://jszip.stuartk.co.uk/) for creating zip files in js, a big part of the original idea

More credits and stuff:
  * [asn1js](http://lapo.it/asn1js/) for decoding all of that asn.1 stuff
  * [Binary Translator](http://home.paulschou.net/tools/xlate/) since I'm too lazy to write one myself
  * [Packaging Chrome Extensions](http://blog.roomanna.com/12-12-2010/packaging-chrome-extensions) / [crx-appengine-packager](https://github.com/kurrik/chrome-extensions/tree/master/crx-appengine-packager) Really, REALLY useful reference for messing with the crx format!
  * [pycrypto](https://www.dlitz.net/software/pycrypto/) for some baseline code and confusing me
  * [Wikipedia](http://en.wikipedia.org/wiki/RSA_(algorithm)) yeah
  * [The Chrome CRX reference](http://code.google.com/chrome/extensions/crx.html) where all knowledge must come from
  * [All of](http://tools.ietf.org/html/rfc2313) [these](http://tools.ietf.org/html/rfc3279) [RFCs!!!](http://tools.ietf.org/html/rfc5280) which are confusing but necessary
  * [OpenSSL](http://www.openssl.org/docs/apps/rsa.html) for testing and stuff