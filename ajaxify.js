/**
 * ajaxify.js
 *
 * Ajaxify Plugin
 *
 * Author: Arvind Gupta
 *
 * Copyright © 2013 Arvind Gupta <arvgta@gmail.com>
 * Released under the MIT License <http: www.opensource.org="" licenses="" mit-license.php="">
 *
 */

/**"pP" module - Stands for "Push Plugin" - sub-plugin factory - working draft
 *
 * Now a rather big function
 *
 * Todo: this could be a jQuery plugin itself
 * I see the potential to avoid pollution of the jQuery namespace this way, but how? 
 * -> presumably introduce an internal prefix?
 */
 
var l=0; //Module global debugging level - used in frmB and $.log, therefore, I see no alternative to using it...
function showArgs(a) { s=''; for(var i=0; i<a.length; i++) s+=(a[i]!=undefined && typeof a[i]!='function' && typeof a[i]!='object' && (typeof a[i]!='string' || a[i].length <= 100) ? a[i] : typeof a[i]) + ' | '; return s }
function frmB(b, name, args) { if(name!='log' && !(b.indexOf('$.log(')+1)) return 'var r=false; l++; $.log(l+" | ' + name + ' | ' + args + ' | " + showArgs(arguments));' + b + "; l--; return r;"; else return b; }
function frmR(b) { return b.replace(/® /g, 'return ').replace(/®/g, 'return --l, ').replace(/ f{ /g, 'function(){') }
 
function pP(dna) {

if(dna.indexOf('\n')+1) {
    var d=dna.split('\n');
    for(var i=0; i<d.length;i++) pP(d[i]);
    return;
}
 
if(dna.indexOf(' | ')==-1) { dna = '_' + dna;
    var lb = dna.indexOf(')'), head = dna.substr(0, lb+1), fb = head.indexOf('('), name = head.substr(0, fb), args = head.substr(fb+1, head.length-fb-2), tail = dna.substr(lb+2, dna.length-lb-2);
    try { $.globalEval('function ' + head + '{ var d = []; ' + frmB(frmR(tail), name, args) + ';};'); } catch(e) { alert('globalEval error : ' + e); };
    return;
}
 
var bp = '(function ($) { var Name = function(options){ \
Private this.a = function(args) {aBody;}; }; \
$.fnn = function(arg0) {var r; var $this = $(this); \
$.fnn.o = $.fnn.o ? $.fnn.o : new Name(options); \
r = $.fnn.o.a(args); return $this;}; \
})(jQuery);',

dnas = dna.split(' | '), name = dnas[0], Name = name.substr(0, 1).toUpperCase() + name.substr(1, name.length - 1), Settings, Private, Mode, Mode2, Args, Args0, ABody;
Private = 'var d = [];';
for(var i = 1; i < dnas.length; i++) {
	    var dnap = dnas[i];
		if(dnap.substr(0, 1) == '{') {
		    dnap = dnap.substr(2, dnap.length - 3);
			Settings = 'settings = $.extend({' + dnap + '}, options);';
			Settings += '\n';
			var sa = dnap.indexOf(', ') + 1 ? dnap.split(', ') : [dnap]; 
			for(var j = 0; j < sa.length; j++) { 
			    var si = sa[j];
				var sn = si.split(':')[0].replace('"', '').replace('"', ''); 
				Settings +=  (sn + ' = settings["' + sn + '"];\n');
			}
		}
		
		else if(dnap.substr(0, 1) == '(') {
		    var del = dnap.indexOf(')'); 
		    Args = dnap.substr(1, del - 1);
            Args = Args.indexOf('$this') + 1 ? Args : (Args ? '$this, ' + Args : '$this');
            Args0 = Args.replace('$this, ', ''); Args0 = Args == '$this' ? '' : Args0;
            if(Settings) Args0 += Args0 == '' ? 'options' : ', options';	
            ABody = dnap.substr(del + 2, dnap.length - del - 2);
            ABody = frmR(ABody);
            Mode = ABody.indexOf('$this') + 1;
            Mode2 = ABody.indexOf('return') + 1 || ABody.indexOf('r=') + 1;
            if(ABody.indexOf(' : ') + 1) { 
                 var ABodies = ABody.split(' : ');
                 var Arg0 = Args0.indexOf(', ') + 1 ? Args0.split(', ')[0] : Args0;
                 ABody = '';
                 for(var i = 0; i < ABodies.length - 1; i++) { var tBody = ABodies[i]; 
                     var tBody1 = ABodies[i + 1]; 
                     var tNewBody = tBody1.substr(0, tBody1.lastIndexOf(';'));
                     var sc = tBody.lastIndexOf(';');
                     tBody = sc + 1 ? tBody.substr(sc + 2, tBody.length - sc - 2) : tBody;
                     if(tBody.length == 1) {
                         ABody += 'if('+Arg0+' ==="'+tBody+'") {...}\n';
                     }
                     else { 
                         ABody += 'if(typeof '+Arg0+' ==="'+tBody+'") {...}\n';
                     }
                     ABody = ABody.replace('...', frmB(tNewBody, name, Args));
                 }
            }
            else {
                 ABody = frmB(ABody, name, Args);
           }
       }
		
       else { 
            Private += 'var ' + dnap + ';'; 
       }
    }
	
    if(Settings) { Settings = 'var ' + Settings; Private += Settings; } else bp = bp.replace(/options/g, '');
    if(Mode) { 
        bp = bp.replace(/fnn/g, 'fn.'+name);
        if(Mode2) bp = bp.replace(' return $this', ' return r');
    } 		
    else { 
        bp = bp.replace(/fnn/g, name).replace('var $this = $(this); ', 'var $this = "";').replace(' return $this', ' return r');
    }
    
    bp = bp.replace('aBody', ABody).replace(/name/g, name).replace(/Name/g, Name).replace('Private', Private).replace(/args/g, Args).replace('arg0', Args0);
   	
    //alert(bp);
    try { eval(bp); } catch(e) { alert(e); }
} 
 
/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */

(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery); 

var docType = /<\!DOCTYPE[^>]*>/i;
var tagso = /<(html|head|body|title|meta|script|link)([\s\>])/gi;
var tagsc = /<\/(html|head|body|title|meta|script|link)\>/gi;
var div12 =  '<div class="ajy-$1"$2';
var linki = '<link rel="stylesheet" type="text/css" href="*" />', scri='<script type="text/javascript" src="*" />';
var linkr = 'link[href*="!"]', scrr = 'script[src*="!"]';
var addAll = '$scriptsO = [], $scriptsN = [], pass = 0 | { "deltas": true } | (same) \
if(!$this.allScripts("PK", deltas)) { if(pass) $this.classAlways("PK");\
if(same) ®_sameScripts($scriptsN, "PK"); $scriptsN = []; $this.newArray($scriptsN, $scriptsO, "PK", pass);\
pass++; _findCommon($scriptsO, $scriptsN); _freeOld($scriptsO, "PK"); _realNew($scriptsN, "PK"); $scriptsO = $scriptsN.slice() }';

pP('\
all | (t, fn) $this.each( f{ t = t.split("*").join("$(this)"); t += ";"; eval(t); })\n\
log | con = window.console | { verbosity: 0 } | (m) l < verbosity && con && con.log(m)\n\
isHtml(x) ®(d=x.getResponseHeader("Content-Type")), d&&(d.indexOf("text/html")+1||d.indexOf("text/xml")+1)\n\
replD(h) ®String(h).replace(docType, "").replace(tagso, div12).replace(tagsc,"</div>")');
pP('parseHTML(h) ®$.trim(_replD(h))');
pP('pages | (h) string : for(var i=0; i<d.length; i++) if(d[i][0]==h) ®d[i][1]; object : d.push(h);');
pP('memory | { memoryoff: false } | (h) d=memoryoff; if(!h || d==true) ®null; if(d==false) ®h; if(d.indexOf(", ")+1) { d=d.split(", "); for(var i=0, r=h; i<d.length; i++) if(h==d[i]) ®null;} ®h==d?null:h');
pP('cache1 | (o, h) ? : ®d; + : d = $.memory(h); d = d?$.pages(d):null; ! : d = h;');
pP('lDivs | () $this.all("fn(*)", function(s) { s.html($.cache1("?").find("#" + s.attr("id")).html()); });');
pP('lAjax | (hin, p, post) var xhr = $.ajax({url: hin, type: post?"POST":"GET", data:post?post.data:null, success: function(h) { \
if(!h || !_isHtml(xhr)) { location = hin; } $.cache1("!",  $(_parseHTML(h))); $.cache1("?").find(".ignore").remove(); $.pages([hin, $.cache1("?")]); p && p(); } })');
pP('lPage(hin, p, post) if(hin.indexOf("#")+1) hin=hin.split("#")[0]; $.cache1("+", post?null:hin); if(!$.cache1("?")) ®$.lAjax(hin, p, post); p && p();');
pP('getPage | (t, p, post) if(!t) ®$.cache1("?"); if(t.indexOf("/") != -1) ®_lPage(t, p, post); if(t == "+") _lPage(p);\
else { if(t.charAt(0) == "#") { $.cache1("?").find(t).html(p); t = "-"; } if(t == "-") ®$this.lDivs(); ®$.cache1("?").find(".ajy-" + t); }');
pP('insertScript($S, PK) $("head").append((PK=="href"?linki: scri).replace("*", $S))');
pP('removeScript($S, PK) $((PK=="href"?linkr:scrr).replace("!", $S)).remove()');
pP('findScript($S, $Scripts) if($S) for(var i=0; i<$Scripts.length; i++) if($Scripts[i][0] == $S) { $Scripts[i][1] = 1; ®true; }');
pP('allScripts | (PK, deltas) if(!deltas) { $this.each( f{ _insertScript($(this)[0], PK); }); ®true; }');
pP('classAlways | (PK) $this.each( f{ if($(this).attr("data-class") == "always") { _insertScript($(this).attr(PK), PK); $(this).remove(); } })');
pP('sameScripts(sN, PK) for(var i=0; i<sN.length; i++) if(sN[i][1] == 0) _insertScript(sN[i][0], PK)');
pP('newArray | (sN, sO, PK, pass) $this.each( f{ sN.push([$(this).attr(PK), 0]); if(!pass) sO.push([$(this).attr(PK), 0]); })');
pP('findCommon(s, sN) for(var i=0; i<s.length; i++) { s[i][1] = 2; if(_findScript(s[i][0], sN)) s[i][1] = 1}');
pP('freeOld(s, PK) for(var i=0; i<s.length; i++) if(s[i][1] == 2 && s[i][0]) _removeScript(s[i][0], PK)');
pP('realNew(s, PK) for(var i=0; i<s.length; i++) if(s[i][1] == 0) _insertScript(s[i][0], PK)');

pP('addHrefs | ' + addAll.replace(/PK/g, "href"));
pP('addSrcs | ' + addAll.replace(/PK/g, "src"));

pP('detScripts(same, $s) if(!same) { var links = $().getPage("link"), jss = $().getPage("script");\
$s.c = links.filter( f{ ® $(this).attr("rel").indexOf("stylesheet")!=-1; });\
$s.s = jss.filter( f{ ® $(this).attr("src"); });\
$s.t = jss.filter( f{ ® !($(this).attr("src")); }) };');
pP('inline(txt, s) d = s["inlinehints"]; if(d) { d = d.split(", "); for(var i=0; i<d.length; i++) if(txt.indexOf(d[i])+1) ®true; }');
pP('addtxts | (s) $this.each( f{ d = $(this).html(); if(d.indexOf(").ajaxify(")==-1 &&\
(s["inline"] || $(this).hasClass("ajaxy") || _inline(d, s))) { try { $.globalEval(d); } catch(e) { alert(e); } } r=true; });');
pP('addScripts(same, $s, st) $s.c.addHrefs(same, st); $s.s.addSrcs(same, st); $s.t.addtxts(st);'); 
pP('scripts | $scripts = $(), pass = 0 | { "deltas": true } | (same) _detScripts(same, $scripts); if(pass++) _addScripts(same, $scripts, settings); else \
{ $scripts.c.addHrefs(same, settings); $scripts.s.addSrcs(same, settings);}');

pP('cPage | { cb: null } | (o) undefined : $.scripts(null, settings); if(cb) cb(); boolean : $.scripts(o, settings); string : ;');
pP('initPage(e) $.cPage(e && e.same)');
pP('initAjaxify(s) d = window.history && window.history.pushState && window.history.replaceState; \
if(d && s["pluginon"]) { $.memory(null, s); $.cPage("", s); ®true}');

pP('ajaxify | { selector: "a:not(.no-ajaxy)", requestKey: "pronto", requestDelay: 0, verbosity: 0, deltas: true, inline: false, memoryoff: false, cb: null, pluginon: true } \
| () $( f{ $.log("Entering ajaxify...", settings); if(_initAjaxify(settings)) { $this.pronto(settings); $(window).on("pronto.render", _initPage); $().getPage(location.href, $.cPage);}});');

/*
* Pronto Plugin
* @author Ben Plum, Arvind Gupta
* @version 0.6.3
*
* Copyright © 2013 Ben Plum: mr@benplum.com, Arvind Gupta: arvgta@gmail.com
* Released under the MIT License
*/
 
if (jQuery) (function($) {

var $this, $window = $(window),
currentURL = '',
requestTimer = null,
post = null;

// Default Options
var options = {
    selector: "a",
    requestKey: "pronto",
    requestDelay: 0,
    forms: true,
    turbo: true,
    scrollTop: false
};

// Private Methods

// Init
function _init(opts) { 
     $.extend(options, opts || {});
     options.$body = $("body");
     options.$container = $(options.container);

     // Capture current url & state
     currentURL = window.location.href;

     // Set initial state
     _saveState();

     // Bind state events
     $window.on("popstate", _onPop);

     if(options.turbo) $(options.selector).hoverIntent( _prefetch );
     options.$body.on("click.pronto", options.selector, _click);
     ajaxify_forms();
}

function _prefetch(e) {
     var link = e.currentTarget;
     if(window.location.protocol !== link.protocol || window.location.host !== link.host) return;
     $().getPage('+', link.href);
}

function b(m, n) {
    if (m.indexOf("?") > 0) {
        m = m.substring(0, m.indexOf("?"))
    }
    
    return m + "?" + n
}

function k(m) {
    var o = m.serialize();
    var n;
        n = $("input[name][type=submit]", m);

    if (n.length == 0) { $.log('Nothing found in function k() !');
        return o
    }
    
    var p = n.attr("name") + "=" + n.val();
    if (o.length > 0) {
        o += "&" + p
    } else {
        o = p
    }
    
    return o
}

function ajaxify_forms(s) { 
if(!options.forms) return;

// capture submit
$('form').submit(function(q) {

    var f = $(q.target);
    if (!f.is("form")) {
        f = f.filter("input[type=submit]").parents("form:first");
        if (f.length == 0) {
            return true
        }
    }
    
    var p = k(f);
    var q = "get", m = f.attr("method");
    if (m.length > 0 && m.toLowerCase() == "post") q = "post";
    
    var h, a = f.attr("action");
    if ( a != null && a.length > 0) h = a;
    else h = currentURL;
    
    if (q == "get") h = b(h, p);
    else { post = {};  post.data = p; }
    
    $.log('Action href : ' + h);
    $window.trigger("pronto.submit", h);
    _request(h);
     
     // prevent submitting again
     return false;
});
}

// Handle link clicks
function _click(e) {
     var link = e.currentTarget; post = null;

     // Ignore everything but normal click
     if ( (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
     || (window.location.protocol !== link.protocol || window.location.host !== link.host)
     ) {
          return;
     }
     
     // Update state on hash change
     if (link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#') {
        _saveState();
        return;
     }

     e.preventDefault();
     e.stopPropagation();

     if (currentURL == link.href) {
         _saveState();
     } else {
         _request(link.href);
     } 
}

// Request new url
function _request(url) { 
     // Fire request event
     $window.trigger("pronto.request");

     var req2 = function(){ 	
         _render(url, 0, true);
     };

     $().getPage(url, req2, post);
}

// Handle back/forward navigation
function _onPop(e) {
     var data = e.originalEvent.state;

     // Check if data exists
     if (data !== null && data.url !== currentURL) {
         // Fire request event
         $window.trigger("pronto.request");  
         var req3 = function(){ 	
             _render(data.url, data.scroll, false);
         };

         $().getPage(data.url, req3);
     }
}

function _render(url, scrollTop, doPush) {      
     if (requestTimer !== null) {
          clearTimeout(requestTimer);
          requestTimer = null;
     }
     
     requestTimer = setTimeout(function() {
       _doRender(url, scrollTop, doPush)
     }, options.requestDelay);
}

function _doPush(url, doPush) {
     // Update current url
     currentURL = url;

     // Push new states to the stack on new url
     if (doPush) {
          history.pushState(
               (options.scrollTop ? {
                    url: currentURL,
                    scroll: 0
          } : { url: currentURL}
        ), "state-"+currentURL, currentURL);
     } else {
     
     // Set state if moving back/forward
     _saveState();
     }
}
   
// Render HTML
function _doRender(url, scrollTop, doPush) { 
     // Fire load event
     $window.trigger("pronto.load");

     // Trigger analytics page view
     _gaCaptureView(url);

     // Update current state
     _saveState();

     // Update title
     $('title').html($().getPage('title').html());

     // Update DOM
     $this.getPage('-');
     ajaxify_forms();     
     
     // Scroll to hash if given
     if(url.indexOf('#') + 1) { 
         $('html, body').animate({
            scrollTop: $( '#' + url.split('#')[1] ).offset().top
         }, 500);
     }

     _doPush(url, doPush);

     // Fire render event
     var event = jQuery.Event("pronto.render");
     event.same = post ? true : false;
     $window.trigger(event);

     //Set Scroll position
     if(options.scrollTop) $window.scrollTop(scrollTop);
}

// Save current state
function _saveState() {
     // Update state
     if(options.scrollTop) {
          history.replaceState({
          url: currentURL,
          scroll: $window.scrollTop()
     }, "state-"+currentURL, currentURL);
     } else {
          history.replaceState({
               url: currentURL
          }, "state-"+currentURL, currentURL);
     }
}

// Google Analytics support
function _gaCaptureView(url) {
     if (typeof _gaq === "undefined") _gaq = [];
     _gaq.push(['_trackPageview'], url);
}

// Define Plugin
$.fn.pronto = function(opts) {
     $this = $(this);
     _init(opts);
     return $this;
};
})(jQuery);
