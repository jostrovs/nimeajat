var DEVELOPMENT=false;
var PREFIX = "TUOMARILISTA_";
var CACHE = "CACHE_";

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
