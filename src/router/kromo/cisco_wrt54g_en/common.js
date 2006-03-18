//
// *********************************************************
// *   Copyright 2003, CyberTAN  Inc.  All Rights Reserved *
// *********************************************************
//
// This is UNPUBLISHED PROPRIETARY SOURCE CODE of CyberTAN Inc.
// the contents of this file may not be disclosed to third parties,
// copied or duplicated in any form without the prior written
// permission of CyberTAN Inc.
//
// This software should be used as a reference only, and it not
// intended for production use!
//
//
// THIS SOFTWARE IS OFFERED "AS IS", AND CYBERTAN GRANTS NO WARRANTIES OF ANY
// KIND, EXPRESS OR IMPLIED, BY STATUTE, COMMUNICATION OR OTHERWISE.  CYBERTAN
// SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A SPECIFIC PURPOSE OR NONINFRINGEMENT CONCERNING THIS SOFTWARE

ie4 = ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4 ))
ns4 = ((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) < 6 ))
ns6 = ((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) >= 6 ))

// 0.0.0.0
var ZERO_NO = 1;	// 0x0000 0001
var ZERO_OK = 2;	// 0x0000 0010
// x.x.x.0
var MASK_NO = 4;	// 0x0000 0100
var MASK_OK = 8;	// 0x0000 1000
// 255.255.255.255
var BCST_NO = 16;	// 0x0001 0000
var BCST_OK = 32;	// 0x0010 0000

var SPACE_NO = 1;
var SPACE_OK = 2;

function choose_enable(en_object) {
	if(!en_object)	return;
	en_object.disabled = false;			// netscape 4.x can not work, but 6.x can work

	if(!ns4)
		en_object.style.backgroundColor = "";	// netscape 4.x have error
}
function choose_disable(dis_object) {
	if(!dis_object)	return;
	dis_object.disabled = true;

	if(!ns4)
		dis_object.style.backgroundColor = "#e0e0e0";
}
function check_action(I,N) {
	if(ns4){	//ie.  will not need and will have question in "select"
		if(N == 0){
			if(EN_DIS == 1) 
				I.focus();
			else 
				I.blur();
		} else if(N == 1){
			if(EN_DIS1 == 1) 
				I.focus();
			else 
				I.blur();
		} else if(N == 2){
			if(EN_DIS2 == 1) 
				I.focus();
			else 
				I.blur();
		} else if(N == 3){
			if(EN_DIS3 == 1) 
				I.focus();
			else
				I.blur();
		}
			
	}
}
function check_action1(I,T,N) {
	if(ns4){	//ie.  will not need and will have question in "select"
		if(N == 0){
			if(EN_DIS == 1) 
				I.focus();
			else 
				I.value = I.defaultChecked;
		}
		if(N == 1){
			if(EN_DIS1 == 1) 
				I.focus();
			else 
				I.value = I.defaultChecked;
		}
	}
}
function valid_range(I,start,end,M) {
	//if(I.value == ""){
	//	if(M == "IP" || M == "Port")
	//		I.value = "0";
	//}
	M1 = unescape(M);
	isdigit(I,M1);

	d = parseInt(I.value, 10);	
	if ( !(d<=end && d>=start) ) {		
		alert(M1 +' value is out of range ['+ start + ' - ' + end +']');
		I.value = I.defaultValue;		
	} else 
		I.value = d;	// strip 0

}
function valid_mac(I,T) {
	var m1,m2=0;

	if(I.value.length == 1)
		I.value = "0" + I.value;

	m1 =parseInt(I.value.charAt(0), 16);
	m2 =parseInt(I.value.charAt(1), 16);
	if( isNaN(m1) || isNaN(m2) ) {
		alert('The WAN MAC Address is out of range [00 - ff]');	
		I.value = I.defaultValue;
	}
	I.value = I.value.toUpperCase();
	if(T == 0) {                                                                       
		if((m2 & 1) == 1){                               
			alert('The second character of MAC must be even number : [0, 2, 4, 6, 8, A, C, E]');
			I.value = I.defaultValue;                       
		}                                                       
	}                       
}
function valid_macs_12(I){	
	var m,m3;	
	if(I.value == "")
		return true;
//	if(I.value.length<2)		
//		I.value=0;	
	else if(I.value.length==12){
		for(i=0;i<12;i++){			
			m=parseInt(I.value.charAt(i), 16);			
			if( isNaN(m) )				
				break;		
		}		
		if( i!=12 ){
			alert('The MAC Address is not correct!!');
			I.value = I.defaultValue;		
		}	
	} else{		
		alert('The MAC Address length is not correct!!');
		I.value = I.defaultValue;	
	}
	I.value = I.value.toUpperCase();
	if(I.value == "FFFFFFFFFFFF"){
		alert('The MAC Address cannot be the broadcast address!!');
		I.value = I.defaultValue;	
	}
	m3 = I.value.charAt(1);
	if((m3 & 1) == 1){                               
		alert('The second character of MAC must be even number : [0, 2, 4, 6, 8, A, C, E]');
		I.value = I.defaultValue;                       
	}                                                       
}
function valid_macs_17(I)
{
	oldmac = I.value;
	var mac = ignoreSpaces(oldmac);
	if (mac == "") {
		return true;
		//alert("Enter MAC Address in (xx:xx:xx:xx:xx:xx) format");
		//return false;
	}
	var m = mac.split(":");
	if (m.length != 6) {
		alert("Invalid MAC address format");
		I.value = I.defaultValue;		
		return false;
	}
	var idx = oldmac.indexOf(':');
	if (idx != -1) {
		var pairs = oldmac.substring(0, oldmac.length).split(':');
		for (var i=0; i<pairs.length; i++) {
			nameVal = pairs[i];
			len = nameVal.length;
			if (len < 1 || len > 2) {
				alert ("The WAN MAC Address is not correct!!");
				I.value = I.defaultValue;		
				return false;
			}
			for(iln = 0; iln < len; iln++) {
				ch = nameVal.charAt(iln).toLowerCase();
				if (ch >= '0' && ch <= '9' || ch >= 'a' && ch <= 'f') {
					// nothing to do here
				} else {
					alert ("Invalid hex value " + nameVal + " found in MAC address " + oldmac);
					I.value = I.defaultValue;		
					return false;
				}
			}	
		}
	}
	I.value = I.value.toUpperCase();
	if(I.value == "FF:FF:FF:FF:FF:FF"){
		alert('The MAC Address cannot be the broadcast address!');
		I.value = I.defaultValue;	
	}
	m3 = I.value.charAt(1);
	if((m3 & 1) == 1){                               
		alert('The second character of MAC must be even number : [0, 2, 4, 6, 8, A, C, E]');
		I.value = I.defaultValue;                       
	}                                                       
	return true;
}
function ignoreSpaces(string) {
	var temp = "";

	string = '' + string;
	splitstring = string.split(" ");
	for(i = 0; i < splitstring.length; i++) {
		temp += splitstring[i];
	}

	return temp;
}
function check_space(I,M1){
	M = unescape(M1);
	for(i=0 ; i<I.value.length; i++){
		ch = I.value.charAt(i);
		if(ch == ' ') {
			alert(M +' is not allow space!');
			I.value = I.defaultValue;	
			return false;
		}
	}

	return true;
}
function valid_key(I,l){	
	var m;	
	if(I.value.length==l*2)	{		
		for(i=0;i<l*2;i++) {			 
			m=parseInt(I.value.charAt(i), 16);
			if( isNaN(m) )				
				break;		
		}		
		if( i!=l*2 ){		
			alert('The key value is not correct!!');			
			I.value = I.defaultValue;		
		}	
	} else{		
		alert('The key length is not correct!!');		
		I.value = I.defaultValue;	
	}
}
function valid_name(I,M,flag) {
	isascii(I,M);

	var bbb = I.value.replace(/^\s*/,"");
        var ccc = bbb.replace(/\s*$/,"");

        I.value = ccc;

	if(flag & SPACE_NO){
		check_space(I,M);
	}

}
function valid_mask(F,N,flag){
	var match0 = -1;
	var match1 = -1;
	var m = new Array(4);

	for(i=0;i<4;i++)
		m[i] = eval(N+"_"+i).value;

	if(m[0] == "0" && m[1] == "0" && m[2] == "0" && m[3] == "0"){
		if(flag & ZERO_NO){
			alert("Illegal subnet mask!");
			return false;
		} else if(flag & ZERO_OK){
			return true;
		}
	}

	if(m[0] == "255" && m[1] == "255" && m[2] == "255" && m[3] == "255"){
		if(flag & BCST_NO){
			alert("Illegal subnet mask!");
			return false;
		} else if(flag & BCST_OK){
			return true;
		}
	}

	for(i=3;i>=0;i--){
		for(j=1;j<=8;j++){
			if((m[i] % 2) == 0)   match0 = (3-i)*8 + j;
			else if(((m[i] % 2) == 1) && match1 == -1)   match1 = (3-i)*8 + j;
			m[i] = Math.floor(m[i] / 2);
		}
	}
	if(match0 > match1){
		alert("Illegal subnet mask!");
		return false;
	}

	return true;
}
function isdigit(I,M) {
	for(i=0 ; i<I.value.length; i++){
		ch = I.value.charAt(i);
		if(ch < '0' || ch > '9') {
			alert(M +' have illegal characters, must be [ 0 - 9 ]');
			I.value = I.defaultValue;	
			return false;
		}
	}

	return true;
}

function isascii(I,M) {
	for(i=0 ; i<I.value.length; i++){
		ch = I.value.charAt(i);
		if(ch < ' ' || ch > '~'){
			alert(M +' have illegal ascii code!');
			I.value = I.defaultValue;	
			return false;
		}
	}

	return true;
}

function isxdigit(I,M) {
	for(i=0 ; i<I.value.length; i++){
		ch = I.value.charAt(i).toLowerCase();
		if(ch >= '0' && ch <= '9' || ch >= 'a' && ch <= 'f') {
				
		} else {
			alert(M +' have illegal hexadecimal digits!');
			I.value = I.defaultValue;	
			return false;
		}
	}

	return true;
}

function closeWin(var_win){
	if ( ((var_win != null) && (var_win.close)) || ((var_win != null) && (var_win.closed==false)) )
		var_win.close();
}

function valid_ip(F,N,M1,flag){
	var m = new Array(4);
	M = unescape(M1);

	for(i=0;i<4;i++)
		m[i] = eval(N+"_"+i).value

	if(m[0] == 127 || m[0] == 224){
		alert(M+" value is illegal!");
		return false;
	}

	if(m[0] == "0" && m[1] == "0" && m[2] == "0" && m[3] == "0"){
		if(flag & ZERO_NO){
			alert(M+' value is illegal!');
			return false;
		}
	}

	if((m[0] != "0" || m[1] != "0" || m[2] != "0") && m[3] == "0"){
		if(flag & MASK_NO){
			alert(M+' value is illegal!');
			return false;
		}
	}

	return true;
}

function valid_ip_gw(F,I,N,G) {
	var IP = new Array(4);
	var NM = new Array(4);
	var GW = new Array(4);
	
	for(i=0;i<4;i++)
		IP[i] = eval(I+"_"+i).value
	for(i=0;i<4;i++)
		NM[i] = eval(N+"_"+i).value
	for(i=0;i<4;i++)
		GW[i] = eval(G+"_"+i).value

	for(i=0;i<4;i++){
		if((IP[i] & NM[i]) != (GW[i] & NM[i])){
			alert("IP address and gateway is not at same subnet mask!");
			return false;
		}
	}
	if((IP[0] == GW[0]) && (IP[1] == GW[1]) && (IP[2] == GW[2]) && (IP[3] == GW[3])){
		alert("IP address and gateway can't be same!");
		return false;
	}
	
	return true;
}

function fix_cr(F) {
	var re1 = new RegExp( '&#13;&#10;', 'gi' );
	var re2 = new RegExp( '&#13;', 'gi' );
	var re3 = new RegExp( '&#10;', 'gi' );
	var re4 = new RegExp( '&#38;', 'gi' );
	var re5 = new RegExp( '&#34;', 'gi' );
	var re6 = new RegExp( '&#62;', 'gi' );
	var re7 = new RegExp( '&#60;', 'gi' );
	var a = F.replace(re1, '\n');
	var b = a.replace(re2, '\n');
	var c = b.replace(re3, '\n');
	var d = c.replace(re4, '&');
	var e = d.replace(re5, '"');
	var f = e.replace(re4, '>');
	var g = f.replace(re5, '<');
return g;
}

// 03/03/06 : Botho - New progress bar implementation
//
// BEGIN xp_progressbar
// Copyright 2004 Brian Gosselin of ScriptAsylum.com
//
// v1.0 - Initial release
// v1.1 - Added ability to pause the scrolling action (requires you to assign
//        the bar to a unique arbitrary variable).
//      - Added ability to specify an action to perform after a x amount of
//      - bar scrolls. This requires two added arguments.
// v1.2 - Added ability to hide/show each bar (requires you to assign the bar
//        to a unique arbitrary variable).
// v.13 - Botho 03/03/06 : incorporate DD-WRT styles

// var xyz = createBar(
// total_width,
// total_height,
// background_color,       Botho 03/03/06 : incorporate DD-WRT styles
// border_width,           Botho 03/03/06 : incorporate DD-WRT styles
// border_color,           Botho 03/03/06 : incorporate DD-WRT styles
// block_color,            Botho 03/03/06 : incorporate DD-WRT styles
// scroll_speed,
// block_count,
// scroll_count,
// action_to_perform_after_scrolled_n_times
// )

var w3c=(document.getElementById)?true:false;
var ie=(document.all)?true:false;
var N=-1;

function createBar(w,h,speed,blocks,count,action){
if(ie||w3c){
var t='<div class="progressbar" id="_xpbar'+(++N)+'" style="width:'+w+'px; height:'+h+'px;">';
t+='<span class="progressbarblock" id="blocks'+N+'" style="left:-'+(h*2+1)+'px;">';
for(i=0;i<blocks;i++){
t+='<span class="progressbarblock" style="left:-'+((h*i)+i)+'px; width:'+h+'px; height:'+h+'px; '
t+=(ie)?'filter:alpha(opacity='+(100-i*(100/blocks))+')':'-Moz-opacity:'+((100-i*(100/blocks))/100);
t+='"></span>';
}
t+='</span></div>';
document.write(t);
var bA=(ie)?document.all['blocks'+N]:document.getElementById('blocks'+N);
bA.bar=(ie)?document.all['_xpbar'+N]:document.getElementById('_xpbar'+N);
bA.blocks=blocks;
bA.N=N;
bA.w=w;
bA.h=h;
bA.speed=speed;
bA.ctr=0;
bA.count=count;
bA.action=action;
bA.togglePause=togglePause;
bA.showBar=function(){
this.bar.style.visibility="visible";
}
bA.hideBar=function(){
this.bar.style.visibility="hidden";
}
bA.tid=setInterval('startBar('+N+')',speed);
return bA;
}}

function startBar(bn){
var t=(ie)?document.all['blocks'+bn]:document.getElementById('blocks'+bn);
if(parseInt(t.style.left)+t.h+1-(t.blocks*t.h+t.blocks)>t.w){
t.style.left=-(t.h*2+1)+'px';
t.ctr++;
if(t.ctr>=t.count){
eval(t.action);
t.ctr=0;
}}else t.style.left=(parseInt(t.style.left)+t.h+1)+'px';
}

function togglePause(){
if(this.tid==0){
this.tid=setInterval('startBar('+this.N+')',this.speed);
}else{
clearInterval(this.tid);
this.tid=0;
}}

// END xp_progressbar

// 03/03/06 : Botho - Change style of the element in param
function change_style(id, newClass) {
   identity=document.getElementById(id);
   identity.className=newClass;
}

// 14/03/06 : Botho - New way for translation. (Linksys one)
function Capture(obj)
{
	document.write(obj);	
}	

// 18/03/06 : Botho - Help open window function (thanks to Philip)
function help(url) {
	var top = 30;
	var left = Math.floor(screen.availWidth * .66) - 10;
	var width = Math.floor(screen.availWidth * .33);
	var height = Math.floor(screen.availHeight * .9) - 30;
	var win = window.open(url, 'DDWRT_help', 'top=' + top + ',left=' + left + ',width=' + width + ',height=' + height + ",resizable=yes,scrollbars=yes,statusbar=no");
	win.focus();
}


// 18/03/06 : Botho - AJAX refreshing statusInfo every 5 sec. (thanks to Philip)
var http_info;
var int_info;

function handle_status_info() {
	if (http_info.readyState == 4 && http_info.status == 200 && document.getElementById("statusInfo")) {
		var regex = /\{uptime:([^\{\}]*)\}\n\{wan:([^\{\}]*)\}/;
		var result = regex.exec(http_info.responseText);
		var status_info = document.getElementById("statusInfo").getElementsByTagName("div");
		status_info[1].innerHTML = result[1];
		status_info[2].innerHTML = result[2];
	}
}

function get_status_info() {
	if(window.XMLHttpRequest) http_info = new XMLHttpRequest();
	if(window.ActiveXObject) http_info = new ActiveXObject("Microsoft.XMLHTTP");
	if(http_info) {
		http_info.open("GET", "live/Live_Info.asp", true);
		http_info.onreadystatechange = handle_status_info;
		http_info.send("");
	}
	else {
		exit_status_info();
	}
}

int_info = setInterval("get_status_info()", 5000);

// 18/03/06 : Botho - Gray all form when submitting (thanks to Philip) - NOT OK YET !
function apply(F) {
	for (i = 0; i < F.elements.length; i++) {
		if(typeof F.elements[i].disabled == "boolean") F.elements[i].disabled = true;
	}
	document.getElementById('contents').style.color = '#999999';
	F.submit();
}

