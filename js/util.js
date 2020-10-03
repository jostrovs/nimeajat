window.SELECTED_REFEREE_IDS = [];

var bus = new Vue({
    methods: {
        on: function(event, callback){
            this.$on(event, callback);
        },
        emit: function(event, payload){
            this.$emit(event, payload);
        }
    }
});

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() -1) / 7);
}

var initialSettings = function(){
    // Jos ei mitään suodatuksia ole asetettu, näytetään oletuksena vain liiton sarjat ja pari liigatuomaria
    let comp = Lockr.getArr(PREFIX + "Competitions");
    if(comp.length < 1){
        comp = ["vb2020esuomi","vb2020isuomi","vb2020lasuomi","vb2020lsuomi","vb2020n","vb2020psuomi"];
        Lockr.set(PREFIX + "Competitions", comp);
    }

    let refe = Lockr.getArr(PREFIX + "Referees");
    if(refe.length < 1){
        refe = [];
        for(let i=1164;i<2800;++i){
            if(i != 1202 && i != 1288 && i!= 1225 && i != 1201){
                refe.push(i.toString());                
            }
        }
        Lockr.set(PREFIX + "Referees", refe);
    }
};

let resizeTimeout = 0;
var resizeWindow = function(){
    if(resizeTimeout != 0) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function(){
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Navbar placeholder
        let navbar = parseInt($("#navbar").css("height"),10);
        $(".navbar-placeholder").height(navbar + "px");

        // Tuomarilista
        let tuomaritButtonit = parseInt($("#tuomaritButtonit").css("height"),10);
        let tuomaritPanelHeading = parseInt($("#tuomarit-panel-heading").css("height"),10);
        let tuomaritPanelButtons = parseInt($("#tuomarit-panel-buttons").css("height"),10);
        let tuomaritVainValitut = parseInt($("#tuomarit-vain-valitut").css("height"),10);
        let tuomaritLuokat = parseInt($("#tuomarit-luokat").css("height"),10);

        let tuomaritMinus = navbar + tuomaritButtonit + tuomaritPanelHeading + tuomaritPanelButtons + tuomaritVainValitut + tuomaritLuokat;
        if(tuomaritMinus < navbar+1) tuomaritMinus = 217;
        let tuomaritLista = height - tuomaritMinus - 60;
        if(tuomaritLista < 200) tuomaritLista = 200;
        $("#tuomarit-lista").css("max-height", tuomaritLista.toString() + "px");

        // Sarjat
        let sarjatButtonit = parseInt($("#sarjat-buttonit").css("height"),10);
        let sarjatPanelHeading = parseInt($("#sarjat-panel-heading").css("height"),10);

        let sarjatMinus = navbar + sarjatButtonit + sarjatPanelHeading;
        if(sarjatMinus < navbar+1) sarjatMinus = 137;
        let sarjat = height - sarjatMinus - 40;
        if(sarjat < 200) sarjat = 200;
        $("#sarjatCollapse").css("max-height", sarjat.toString() + "px");


        ////
        console.log(`(${width},${height})`);
        console.log(`sarjat: ${sarjat}`);
        resizeTimeout = 0;
    },100);
};

var pois_umlaut = function(s){
    s = repl(s,"&Auml;", "Ä");
    s = repl(s,"&Ouml;", "Ö");
    s = repl(s,"&Aring;", "Å");
    s = repl(s,"&auml;", "ä");
    s = repl(s,"&ouml;", "ö");
    s = repl(s,"&aring;", "å");
    return s;
};

var repl = function(s, search, replace){
    return s.split(search).join(replace);
}

var cookieMatch = function(needle, haystack){
    for(let hay of haystack){
        if(hay===needle) return true;
        if(hay.startsWith(needle+".")) return true;
    }
    return false;
};

function setWeekSeparators(matches){
    let prev = -1;
    for(let i=0;i<matches.length;++i){
        let m = matches[i];
        if(!m.displayed) continue;
        if(prev != m.week && prev > -1){
            m.weekSeparator = true;
        } 
        prev = m.week;
    }
}

var vilkuta_elementtia = function(jq_element){
    jq_element.addClass("elementin_vilkutus");
    jq_element.css("background-color", "red");

    setTimeout(function(){
        jq_element.css("background-color", "white");

        setTimeout(function(){
            jq_element.css("background-color", "red");

            setTimeout(function(){
                jq_element.css("background-color", "white");
                setTimeout(function(){
                    jq_element.removeClass("elementin_vilkutus");
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

const REF4 = ["M1", "ML", "NL", "MSC", "N1", "NSC"];
const REF2 = ["M2", "M3"];

var match_without_date = function(m){
    // Pois ottelut, joilla ei ole päivämäärää
    return m.datetime < new Date(2029, 1, 1, 1, 1, 1, 1);
};

var GLOBAL_SETTINGS_OBJECT = {};

var saveSettingsObject = function(obj, success_callback, fail_callback){
    if(!GLOBAL_SETTINGS_OBJECT){
        GLOBAL_SETTINGS_OBJECT = {};
    }
    
    let prev = JSON.parse(JSON.stringify(GLOBAL_SETTINGS_OBJECT));

    var key = "P" + PREFIX;
    GLOBAL_SETTINGS_OBJECT[key] = obj;

    var url = "https://www.lentopalloerotuomarit.fi/nimeajat/php/talleta.php";
    if(LOCALHOST) url = "http://localhost:3333/php/talleta.php";

    $.post(url,
    {
        token: TOKEN,
        json: JSON.stringify(GLOBAL_SETTINGS_OBJECT, null, 4)
    })
    .done(function(result_json){
        var result = JSON.parse(result_json);
        if(result.status == "OK"){
            if(success_callback){
                success_callback();
            }
        } else {
            GLOBAL_SETTINGS_OBJECT = prev; // Palautetaan, koska talletus epäonnistui
            if(fail_callback){
                fail_callback(result.status);
            }
        }
    });
};

var loadSettingsObject = function(callback){
    var url = "https://www.lentopalloerotuomarit.fi/nimeajat/php/hae.php";
    if(LOCALHOST) url = "http://localhost:3333/php/hae.php";

    url = url + "?timestamp=" + (new Date()).getMilliseconds().toString() + "&token=" + TOKEN;

    $.get(url,
        function(json){
            if(json){
                GLOBAL_SETTINGS_OBJECT = JSON.parse(json);
            }
            if(callback){
                callback(json);
            }
        });
}

