/* JSPackCrx packages Chrome extension files using JavaScript.
 * http://code.google.com/p/jspackcrx
 * Copyright (C) 2011-12 gengkev.
 * 
 * This software is licensed under the terms of the GPLv3.
 * It also contains code from other projects: see /docs/licence.txt
 * See http://jspackcrx.googlecode.com/svn/LICENSE.html for details.
 */
 
/* This file automatically generates jspackcrx_include.js.
 * Run it with node (see nodejs.org) and it'll replace the
 * exising version. It takes jspackcrx.js, adds includes, and
 * compresses it. Have fun!
 */

var fs  = require("fs"),
    jsp = require("uglify-js").parser,
    pro = require("uglify-js").uglify;


// this is STUPID since its a huge file BUT IT WORKS :o
var jspackcrx = fs.readFileSync("jspackcrx.js","utf8");

console.log("hi");
console.time("insert-scripts");

/* INSERT lol.txt */

// corresponds to
jspackcrx = jspackcrx.replace(/(\/\*\sINSERT\s)(.+)(\s\*\/)/gm,function(str,p1,p2,p3) {
	return fs.readFileSync(p2,"utf8"); //.replace("\ufeff","");
});

console.timeEnd("insert-scripts");
console.time("remove-comments");

// stupid BOM
jspackcrx = jspackcrx.replace(/\ufeff/gm,"");
//console.log(jspackcrx.charCodeAt(0).toString(16) + " " + jspackcrx.charCodeAt(1).toString(16) + " " + jspackcrx.charCodeAt(2).toString(16) + " " + jspackcrx.charCodeAt(3).toString(16));

// for /* */-like comments (and also /**/ [code] /**/ which removes non-build code)
jspackcrx = jspackcrx.replace(/(\/\*)([\s\S]+?)(\*\/)/gm,"");

// for //-like comments (bonus but might break stuff)
jspackcrx = jspackcrx.replace(new RegExp("\/\/.*?[\n\r]+","gm"),"\n");

// oh and random extra whitespace (bonus)
jspackcrx = jspackcrx.replace(new RegExp("[\n\r]+\s*","gm"),"\n");
console.timeEnd("remove-comments");

fs.writeFileSync("jspackcrx_include.js",jspackcrx,"utf-8"); //async just for redundancy

console.time("uglifyjs-parse");
var ast = jsp.parse(jspackcrx);
console.timeEnd("uglifyjs-parse");
console.time("uglifyjs-mangle");
ast = pro.ast_mangle(ast);
console.timeEnd("uglifyjs-mangle");
console.time("uglifyjs-squeeze");
ast = pro.ast_squeeze(ast);
console.timeEnd("uglifyjs-squeeze");
console.time("uglifyjs-compile");
var final_code = pro.gen_code(ast);
console.timeEnd("uglifyjs-compile");

//var final_code = jspackcrx;

final_code = "/* Automatically generated on "+new Date()+" with build.js. See for more details. */\n\n" + final_code;

fs.writeFileSync("jspackcrx_include.js",final_code,"utf8");
console.log("omg done!");
