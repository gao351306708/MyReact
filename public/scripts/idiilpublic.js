var DEBUG_MODE = true;

  
//############  hhu  2014/05/29 ##################

//本文档增加LTrim，RTrim，Trim的字符串处理函数
// getHostUrl()    "http://www.idiil.com
// myCheckNull(sS)  ""
// trancateString   "hhhhh..."
// promptMessage  
// isDate    "2012-13-14" 
//  parseXML(str):: loadXMLString(str)   loadXMLDoc(url)   createXMLDoc()   
//本文档实现xml兼容性,实现了XMLDocument(Document)和Element的selectSingleNode,  selectNodes功能以及.xml属性


//此处为string类添加三个成员


//**********************************************************  Date 扩展  ***********************************************
Date.prototype.dateAdd = function(interval,number) 
{ 
    var d = this; 

    var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'}; 
    var n={'q':3, 'w':7}; 
    eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')'); 
    return d; 
} 

//alert(new Date().dateAdd('s',-20));

/* 计算两日期相差的日期年月日等 */ 
Date.prototype.dateDiff = function(interval,objDate2) 
{ 
    var d=this, i={}, t=d.getTime(), t2=objDate2.getTime(); 
    i['y']=objDate2.getFullYear()-d.getFullYear(); 
    i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4); 
    i['m']=i['y']*12+objDate2.getMonth()-d.getMonth(); 
    i['ms']=objDate2.getTime()-d.getTime(); 
    i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000)); 
    i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000); 
    i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000); 
    i['n']=Math.floor(t2/60000)-Math.floor(t/60000); 
    i['s']=Math.floor(t2/1000)-Math.floor(t/1000); 
    return i[interval]; 
}

/*
Date1=new Date();
Date1.dateAdd('d',-1);
Date2=new Date();
alert(Date1.dateDiff('s',Date2));
*/

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//var time1 = new Date().Format("yyyy-MM-dd");
//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");  



//**********************************************************  String 扩展  ***********************************************
String.prototype.Trim = function(){ return Trim(this);}
String.prototype.LTrim = function(){return LTrim(this);}
String.prototype.RTrim = function(){return RTrim(this);}
String.prototype.Mid = function(){return Mid(this);}
String.prototype.InStr = function(){return InStr(this);}
String.prototype.Left = function(){return Left(this);}
String.prototype.Right = function(){return Right(this);}
String.prototype.Len = function(){return Len(this);}


function GetParameter__( sLocationSearch ,  sParamName  )
{
	var sParamValue, nPosStart, nPosMid, nPosEnd;
	sParamValue = "";
	nPosStart = InStr(1, sLocationSearch, sParamName & "=", 1)  ;
	if( nPosStart > 0) 
	{
		nPosMid = InStr(nPosStart, sLocationSearch, "=")  //the position of the "=" after param name
		if( nPosMid > 0 )
		{
			nPosEnd = InStr(nPosMid, sLocationSearch, "&") - 1
			if( nPosEnd <= 0 ) nPosEnd = Len(sLocationSearch); 
			sParamValue = Mid(sLocationSearch, nPosMid + 1, nPosEnd - nPosMid);
		}
	}
	return  Replace(Trim(sParamValue), "%20", " ");
}

function GetParameter( sLocationSearch ,  sParamName  )
{
	var sParamValue, nPosStart, nPosMid, nPosEnd;
	sParamValue = "";
	nPosStart =sLocationSearch.indexOf(sParamName+ "=",1); // InStr(1, sLocationSearch, sParamName & "=", 1)  ;
	if( nPosStart > 0) 
	{
		nPosMid =sLocationSearch.indexOf("=",nPosStart);   // InStr(nPosStart, sLocationSearch, "=")  //the position of the "=" after param name
		if( nPosMid > 0 )
		{
			nPosEnd =sLocationSearch.indexOf("&",nPosMid)-1; // InStr(nPosMid, sLocationSearch, "&") - 1
			if( nPosEnd <= 0 ) nPosEnd =sLocationSearch.length;  // Len(sLocationSearch); 
			sParamValue =sLocationSearch.substring(nPosMid + 1,nPosEnd+1);   //Mid(sLocationSearch, nPosMid + 1, nPosEnd - nPosMid);
		}
	}
	return  Trim(sParamValue).replace("/%20/gi"," ");  //Replace(Trim(sParamValue), "%20", " ");
}


//此处为独立函数
function LTrim(str)
{
    var i;
    for(i=0;i<str.length;i++)
    {
        if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
    }
    str=str.substring(i,str.length);
    return str;
}

function RTrim(str)
{
    var i;
    for(i=str.length-1;i>=0;i--)
    {
        if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
    }
    str=str.substring(0,i+1);
    return str;
}

function Trim(str)
{
    return LTrim(RTrim(str));
}

function trim(str)
{
    return LTrim(RTrim(str));
}


instr = Instr = InStr;
function InStr(arg1, arg2, arg3, arg4)
/*
 InStr(string, pattern, 0 || 1 (Binary || Text)
 InStr(starting index (1 indexed),string, pattern, 0 || 1 (Binary || Text)
 */{
  /*for (i=0; i < Len(strSearch); i++)
   {
   if (charSearchFor == Mid(strSearch, i, 1))
   {
   return i;
   }
   }*/
  if (typeof arg1 == "string") {
    var x = new String(arg1).indexOf(arg2);
    return x + 1;
  } else {
    var x = new String(arg2).indexOf(arg3, arg1 - 1);
    return x + 1;
  }
  //return x == -1 ? 0 : x + 1;
  //return -1;
}

mid = Mid;
function Mid(str, start, len)
/***
 IN: str - the string we are LEFTing
 start - our string's starting position (0 based!!)
 len - how many characters from start we want to get

 RETVAL: The substring from start to start+len
 ***/{
  str = String(str);
  // Make sure start and len are within proper bounds
  if (start < 0 || len < 0 || start > str.length) return "";

  return str.substr(start - 1, len);
}
		
function Right(str, n)
{
	if (n <= 0)     // Invalid bound, return blank string
	   return "";
	else if (n > String(str).length)   // Invalid bound, return
	   return str;                     // entire string
	else { // Valid bound, return appropriate substring
	   var iLen = String(str).length;
	   return String(str).substring(iLen, iLen - n);
	}
}
		
function Left(str, n)
{
	if (n <= 0)     // Invalid bound, return blank string
			return "";
	else if (n > String(str).length)   // Invalid bound, return
			return str;                // entire string
	else // Valid bound, return appropriate substring
			return String(str).substring(0,n);
}
		
function Len(str)
{  return String(str).length;  }

var Replace = function(str, find, replace, start, count){
	if(start)
		str = str.substring(start-1);

	if(count === undefined)
		str = str.split(find).join(replace); //replace all
	else
		for(var i = 0; i < count; i++)
			str = str.replace(find,replace);
	return str;
}

function myCheckNull(sS)
{
        if (sS) 
          return(Trim(sS));
        else
         return("");
 }

function PL_CheckNull(sS)
{
	return myCheckNull(sS);
}

	/**
 * Emulate VBScript Replace function
 * @param {string} str
 * @param {string} find
 * @param {number} start
 * @param {number} count
 * @return {string}
 */
var Replace = function(str, find, replace, start, count){
	if(start)
		str = str.substring(start-1);

	if(count === undefined)
		str = str.split(find).join(replace); //replace all
	else
		for(var i = 0; i < count; i++)
			str = str.replace(find,replace);
	return str;
}


function trancateString(s,n)
 {
	 if (!s) return("");
	 sReturn=s;
	 if (s.length>n) sReturn=sReturn.substring(0,n-3)+"..."
	 return sReturn;
 }


function promptMessage(sMsg)
{
    alert(sMsg);
}


//**********************************************************  XML 扩展与兼容性  ***********************************************
var myXMLHTTP=myNewXMLHTTP();

//TODO cross browser, more robust error handling
function xhrLoad(url, async) {
  try {
    AJAX = new XMLHttpRequest();
    if (AJAX) {
      AJAX.open("GET", url, !!async);
      AJAX.send(null);
      return AJAX;
    } else {
      return AJAX;
    }
  } catch (e) {
    return AJAX;
  }
}

function isStorageUri(uri) {
  return uri.toLowerCase().substr(0, 5) == 'file:' || uri.toLowerCase().substr(0, 2) == 'c:';
}

function XMLDOM_load(url,xmldoc){ 
//TODO pluggable storage

	// url is not a string, so must be XML object
	if ( typeof url !== 'string' ) {
        var newDocEl = xmldoc.adoptNode(url.documentElement.cloneNode(true));
		return !xmldoc.documentElement ? xmldoc.appendChild(newDocEl) : xmldoc.replaceChild(newDocEl, xmldoc.documentElement);
	}
    else {
        if ( isStorageUri( url.toLowerCase() ) ) {
            return xmldoc.loadXML(localStorage.getItem( url.toLowerCase() ));
        }
    }

    //TODO handle async
    var resp = xhrLoad(url);
    if(resp.responseXML) {
        var newDocEl = xmldoc.adoptNode(resp.responseXML.documentElement);
        return !xmldoc.documentElement ? xmldoc.appendChild(newDocEl) : xmldoc.replaceChild(newDocEl, xmldoc.documentElement);
    }
    else {
        return xmldoc.loadXML(resp.responseText);
    }
}


var createXMLDoc;
if (("ActiveXObject" in window) || typeof ActiveXObject != "undefined"){
    createXMLDoc = function() {
        var xmldoc = new ActiveXObject("Microsoft.XMLDOM");
		// force synchronous mode
		xmldoc.async=false;
		return xmldoc;
    }
}
else {
    createXMLDoc = function() {
        return document.implementation.createDocument("","",null);
    }
    
    //TODO cross browser, more robust error handling
    function xhrLoad(url) {
        try{
            AJAX=new XMLHttpRequest();
            if (AJAX) {
                AJAX.open("GET", url, false);
                AJAX.send(null);
                return AJAX;
            } else {
                return AJAX;
            }   }
        catch(e){
            return AJAX;
        }
    }
    
    /**
     *
     * @param {XMLDocument} parsedDocument
     * @returns {boolean}
     */
    function isParseError(parsedDocument) {
        if(typeof DOMParser == 'undefined') return false;
        // parser and parsererrorNS could be cached on startup for efficiency
        var parser = new DOMParser(),
            errorneousParse = parser.parseFromString('<', 'text/xml'),
            parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

        if (parsererrorNS == 'http://www.w3.org/1999/xhtml') {
            // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
            return parsedDocument.getElementsByTagName("parsererror").length > 0;
        }

        return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
    }

    if (document.implementation && document.implementation.hasFeature("XPath", "3.0")) {
        if (typeof XMLDocument == "undefined") {
            XMLDocument = Document;
        }
        XMLDocument.prototype.selectNodes = function (cXPathString, xNode) {
            if (!xNode) {
                xNode = this;
            }
            var oNSResolver = this.createNSResolver(this.documentElement);
            var aItems = this.evaluate(cXPathString, xNode, oNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var aResult = [];
            for (var i = 0; i < aItems.snapshotLength; i++) {
                aResult[i] = aItems.snapshotItem(i);
            }
            return aResult;
        };
        XMLDocument.prototype.selectSingleNode = function (cXPathString, xNode) {
            if (!xNode) {
                xNode = this;
            }
            var xItems = this.selectNodes(cXPathString, xNode);
            if (xItems.length > 0) {
                return xItems[0];
            }
            else {
                return null;
            }
        };
        function isStorageUri(uri) {
            return uri.toLowerCase().substr(0,5) == 'file:' || uri.toLowerCase().substr(0,2) == 'c:';
        }
        XMLDocument.prototype.load = function(url) {
            XMLDOM_load(url,this);
        };
        XMLDocument.prototype.save = function(url){
            localStorage.setItem(url.toLowerCase(), this.xml);
        };
        XMLDocument.prototype.clear_ = function(){
            !this.documentElement || this.removeChild(this.documentElement);
        };
        XMLDocument.prototype.loadXML = function(xmlString){
            if(!xmlString) return this.clear_();
            var newDoc = new DOMParser().parseFromString(xmlString,'application/xml');
            if(isParseError(newDoc))
                return this.clear_();
            else {
                this.clear_();
                var newDocEl = this.adoptNode(newDoc.documentElement);
                this.appendChild(newDocEl);
            }
        };
        Element.prototype.selectNodes = function (cXPathString) {
            if (this.ownerDocument.selectNodes) {
                return this.ownerDocument.selectNodes(cXPathString, this);
            }
            else {
                throw "For XML Elements Only";
            }
        }
        Element.prototype.selectSingleNode = function (cXPathString) {
            if (this.ownerDocument.selectSingleNode) {
                return this.ownerDocument.selectSingleNode(cXPathString, this);
            }
            else {
                throw "For XML Elements Only";
            }
        }
        typeof Element.prototype.text == 'undefined' && Object.defineProperty(Element.prototype, "text", {
            get: function () {
                var c = this.textContent || '';
				return c;
            },
            set: function(s) {
                return this.textContent = s;
            }
        });
        //Element.prototype.__defineGetter__("text", function(){ return this.textContent; });

        //Fix for bug in Chrome 34: responseXML doesn't inherit from XMLDocument @ 2014/04/22 Jonathan Hsu
        try {
          if (Document && Document.prototype && typeof Document.prototype.selectNodes == "undefined") {
              Document.prototype.selectNodes = XMLDocument.prototype.selectNodes;
              Document.prototype.selectSingleNode = XMLDocument.prototype.selectSingleNode;
          }
        }
        catch(e) {};
    }

    if (typeof XMLSerializer != 'undefined'  && typeof XMLDocument.prototype.xml == 'undefined') {
        if (typeof XMLDocument == "undefined") {
            XMLDocument = Document;
        }
        Object.defineProperty(XMLDocument.prototype, "xml", {
            get: function () {
                //XMLDocument.prototype.__defineGetter__("xml", function(){
                return new XMLSerializer().serializeToString(this);
            }
        });
        Object.defineProperty(Element.prototype, "xml", {
            get: function () {
                //Element.prototype.__defineGetter__("xml", function(){
                return new XMLSerializer().serializeToString(this);
            }
        });

      try{
        //Fix for bug in Chrome 34: responseXML doesn't inherit from XMLDocument @ 2014/04/22 Jonathan Hsu
        if (Document && Document.prototype && typeof Document.prototype.xml == "undefined")
            Object.defineProperty(Document.prototype, "xml", {
                get: function () {
                    //XMLDocument.prototype.__defineGetter__("xml", function(){
                    return new XMLSerializer().serializeToString(this);
                }
            });
      }
      catch(e){}
    }
}

var isIE = function(){return (typeof window.ActiveXObject !== 'undefined' || 'ActiveXObject' in window);};

function PL_AddNode(objParentNode,sNodeName,sNodeValue){
    var objNode;
    if( objParentNode==null || sNodeName == "")  return(null);
	    
    objNode = objParentNode.ownerDocument.createElement(sNodeName);
    if( sNodeValue!="") { 
	   if (isIE)
	    {
			objNode.text = sNodeValue;
		}
		else
		{
			objNode.textContent=sNodeValue;
		}
	}
    objParentNode.appendChild(objNode);
    return(objNode);
}

//**********************************************************  IDIIL 其他扩展 ***********************************************

function getHostUrl()
{

	var sUrl=window.location.href;

	sUrl = sUrl.substring(0, sUrl.indexOf("/" , sUrl.indexOf("://")+3));
	return sUrl;

/*
	var sPath = location.href;
   	var nLen=("http://").length;

	var sPatha=sPath.substr(nLen);
   	var nPos = sPatha.indexOf("/");
	nPos=nLen+nPos+1;
    return sPath.substr(0,nPos);
	*/
}



function RegExpTest(patrn, strng)
{
  var regEx, retVal;		//Create variable.
  regEx = new  RegExp(patrn);			// Create regular expression.
  //regEx.source = patrn	;		// Set pattern.
  regEx.ignoreCase = false;		//Set case sensitivity.
  retVal = regEx.test(strng)		// Execute the search test.
  return retVal ;
}

function isDate(sDate)
{
//var str = "2021-02-21";
//alert(isDate(str));
	
	var sPt="(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)";
	
	return  RegExpTest(sPt,sDate);
}


function createXMLDocIE() 
{
xmlDoc=null;
try{ //Internet Explorer
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }
catch(e){
  try { //Firefox, Mozilla, Opera, etc.
    xmlDoc=document.implementation.createDocument("","",null);
    }
   catch(e) {alert(e.message)}
  }
return(xmlDoc);
}


function loadXMLDoc(url)
{
	var xmlhttp=null;
	if (window.XMLHttpRequest)
	  {// code for all new browsers
	  xmlhttp=new XMLHttpRequest();
	  }
	else if (isIE)
	  {// code for IE5 and IE6
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	if (xmlhttp!=null)
	  {
		xmlhttp.open("POST", url, false); 
		//xmlhttp.setRequestHeader("Content-Type","text/xml; charset=utf-8"); 
		xmlhttp.send(null);
	    return loadXMLString(xmlhttp.responseText);
	  }
	else
	  {
	  alert("Your browser does not support XMLHTTP.");
	  return null;
	  }
}

function loadXML(content)
{
   	return loadXMLString(content);
}

//input: xml  string 
//output: xmldocument 
//test in  360 ,chrome,ie7-ie11
function loadXMLString(txt) 
{
 if (window.DOMParser)
   {
   parser=new DOMParser();
   xmlDoc=parser.parseFromString(txt,"text/xml");
   }
 else // Internet Explorer
   {
   xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
   xmlDoc.async=false;
   xmlDoc.loadXML(txt); 
  }
 return xmlDoc;
 }
 
    
 function myNewXMLHTTP()
 {
if (window.XMLHttpRequest) {
return new XMLHttpRequest();
} 
else if (window.ActiveXObject) {
 return new ActiveXObject("Microsoft.XMLHTTP");
}
}
 
function _myGetData(sInput,sObjName,sFunctionName,webUrl)
{    
        var url = (webUrl||'') + "/Public/PublicASP.asp?ObjectName="+sObjName+"&FunctionName="+sFunctionName+"&AdminType=1"
        var SoapRequest= sInput;
		
	    var xmlHttp =myNewXMLHTTP() ;		
		xmlHttp.open("POST", url, false);
	    xmlHttp.send(sInput)
		
		//xmlHttp.open("POST", url, false); 
		//xmlHttp.setRequestHeader("Content-Type","text/xml; charset=utf-8"); 
		//xmlHttp.send(sInput);
        domOutPut=loadXMLString(xmlHttp.responseText);
        return(domOutPut);
}

// XML data mocking
var myGetData = _myGetData;
if (DEBUG_MODE) {
    
    myGetData = function(sInput, sObjName, sFunctionName, webUrl) {
        var mock_name = [ sObjName, sFunctionName, location.href.split('?')[0] ].join('.');
        
        var mockdata_stored = localStorage.getItem(mock_name);
        
        // check if MOCK DATA using localStorage is enabled, set to 'off' if null
        var ismockdata = localStorage.getItem('idiil.MOCKDATA_STORAGE');        
        if ( !ismockdata || ismockdata === null ) {
            localStorage.setItem('idiil.MOCKDATA_STORAGE','off');
            ismockdata = 'off';
        }
        // mock the data
        if ( ismockdata !== 'off' ) {
            if ( mockdata_stored ) {
                return loadXMLString(localStorage.getItem(mock_name));
            }
            else {
                var data = _myGetData(sInput, sObjName, sFunctionName, webUrl);
                localStorage.setItem(mock_name, data.xml);
                return data;
            }
        }
        
        // mocking is off
        return _myGetData(sInput, sObjName, sFunctionName, webUrl);
    };
}
    
function AddNodetoString(NodeName,NodeValue)
{
    if (NodeName!="" && NodeValue!="") {
       mNode=xmlUserInfo.selectSingleNode("//" + NodeName )
       if (mNode)
	      mNode.text=NodeValue
		else
		{
		    mNode=xmlUserInfo.createElement(NodeName);
			isIE?mNode.text=NodeValue : mNode.text=NodeValue;
			xmlUserInfo.documentElement.appendChild(mNode);
		}
	}
}
function EnCodeString(str)
{
	var objIDIILClientServer = objIDIILClientServer || new IDIILClientServer.clsTools;
	return window.escape(objIDIILClientServer.EncryString(str));
}


// below is for test  ***************************

/*
var strXML=""
strXML=strXML + "<people><person first-name=\"eric\" middle-initial=\"H\" last-name=\"jung\" >rrrrr ";
strXML=strXML + "<address street=\"321 south st\" city=\"denver\" state=\"co\"  country=\"china\"  />";
strXML=strXML + "<address street=\"123 main st\" city=\"arlington\" state=\"ma\" country=\"usa\" />";
strXML=strXML + "</person> ";
strXML=strXML + "<person first-name=\"jed\" last-name=\"brown\">yyyyy "
strXML=strXML + "<address street=\"321 north st\" city=\"atlanta\" state=\"ga\" country=\"usa\" /> "
strXML=strXML + "<address street=\"123 west st\" city=\"seattle\" state=\"wa\" country=\"usa\" /> "
strXML=strXML + "<address street=\"321 south avenue\" city=\"denver\" state=\"co\" country=\"usa\" /> "
strXML=strXML + "</person></people> " 

var x = parseXML(strXML); 

alert( " 搜索所有人的姓氏（last-name） " ) 
var results = x.selectNodes( "//person/@last-name" ); 
for ( var i = 0 ; i < results.length;i ++ ) 
alert( " Person # " + i + " has the last name " + results[i].nodeValue); 

alert( " 搜索第二个人 " ); 
if (!isIE) 
results = x.selectSingleNode( "/people/person[2]" ); 
else 
results = x.selectSingleNode( "/people/person[1]" ); 
alert(results.xml) 
alert("aaa"+results.text) 


alert( " 获得住址在donver街上的人 " ); 
results = x.selectNodes( "//person[address/@country='china' and address/@city='denver']" ); 
for ( var i = 0 ; i < results.length;i ++ )alert(results[i].xml) 


var myDoc=createXMLDoc();
if(myDoc){
  var rNode=myDoc.createElement("root");
  myDoc.appendChild(rNode);
  rNode.setAttribute("aa","hhhh");
  alert(myDoc.xml);
}

var aadoc=loadXMLDoc("http://endev.idiil.com.cn/CurriculumnXML/English/0072/0072_01ENGLISHFORMATCONTENT.XML")
alert(aadoc.xml)


var	sObjName="RoleManageServer.Entry";
var  sFunctionName="GetAllCenterInfo";
var bbdoc=myGetData("",sObjName,sFunctionName);
alert(bbdoc.xml);

*/