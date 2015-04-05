## Introduction ##
**jspackcrx** is a library (which depends on a bunch of included [dependencies](Dependencies.md)) to generate Chrome extension (CRX) files using pure JavaScript, as described in the [Chrome docs](http://code.google.com/chrome/extensions/crx.html). Right now it can't use/download a private key (aka, update an extension) - it only generates Chrome extension (CRX) files when you pass it a zip file. See [Documentation](Documentation.md).

You can view some old stuff below or go to the [demoish thingy](http://jspackcrx.googlecode.com/svn/branches/stable/test.html).

Unfortunately, Chrome [no longer](http://support.google.com/chrome_webstore/bin/answer.py?hl=en&answer=2664769&p=crx_warning) allows you to install extensions outside of the Web Store without dragging and dropping them onto the chrome://extensions page.

## Out-of-date listing of possible applications ##
  * on-the-fly generation of webapps if you want a glorified bookmark on your new tab page
  * the above, but converted from another source, namely Mozilla's [Open Web Apps](https://apps.mozillalabs.com) project - see [OpenToChromeApp](http://code.google.com/p/opentochromeapp), perhaps.
  * converting Jetpack extensions into crx files?...
  * useful for an online IDE to immediately test out Chrome extensions
  * for automatically generating Chrome extensions customized to different users (though you could theoretically modify certain bytes of an existing one?)
  * for batch generating Chrome extensions, maybe if you don't want to manage the CRX files, [like with sample extensions](http://blog.roomanna.com/12-12-2010/packaging-chrome-extensions) - which is why you would want to supply a public key and signature instead

This used to be part of the project [OpenToChromeApp](http://code.google.com/p/opentochromeapp), but I separated it to keep things simpler. Maybe I should try using GitHub...

## Todo ##
  * Actually write a REAL ASN.1 library for JavaScript!
  * Support import/export of private keys instead of generating a new one every time
  * Refactor code AGAIN
  * Remove unnecessary code from external libraries
  * Actually understand the RSA padding and encryption stuff and get /misc/rsablah.html to work correctly
  * and more...