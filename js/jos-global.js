var DEVELOPMENT=false;
var PREFIX = "TUOMARILISTA_";
var CACHE = "CACHE_";
var TOKEN = "";

var LOCALHOST = false;
if(location.href.indexOf("localhost")>-1){
  LOCALHOST = true
}

function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;
  
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
  
    return result;
}

var prePrefix = getQueryString()['prefix'];
if(prePrefix != undefined) PREFIX = prePrefix + PREFIX;

var token = getQueryString()['token'];
if(token != undefined){
    TOKEN = token;
    console.log("Talletus TOKEN: " + TOKEN);
}

TOKEN = "JORI";
