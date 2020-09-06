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

class Match{
    constructor(torneoMatch, competition, category, group){
        this.number = torneoMatch.match_number;
        this.id = torneoMatch.match_id;
        this.torneoMatch = torneoMatch;
        this.displayed = true;
        this.hasTime = true;
        this.played = torneoMatch.status == 'Played';

        this.referees = [];
        this.href="https://lentopallo.torneopal.fi/taso/ottelu.php?otteluid=" + this.id;

        this.fill_date();
        this.fill_referees();

        this.competition = competition;
        
        this.category = category;
        this.category_href="https://lentopallo.torneopal.fi/taso/sarja.php?turnaus=" + competition.id + "&sarja=" + category.id;
        
        this.group = group;
        this.group_href = this.category_href + "&lohko=" + this.group.id;

        this.special = 0;

        this.isDisplayed = function(){
            return this.displayed && this.competition.displayed && this.group.displayed && this.category.displayed &&
                   this.isTeamDisplayed() && this.hasTime;
        }

        this.isTeamDisplayed = function(){
            let team = this.group.getTeam(this.torneoMatch.team_A_id);
            if(!team) return false;
            return team.displayed;
        }

        this.toCSV = function(){
            let refe = "";
            for(let r of this.referees){
                if(refe.length > 0) refe += "; ";
                refe += r;
            }

            let puuttuu = "";
            if(this.referee_status != '') puuttuu = "Puuttuu: " + this.referee_status;

            return this.weekday + "," + 
                   this.datetime.toLocaleDateString() + ",klo," +
                   this.toTimeString() + "," + 
                   this.torneoMatch.category_id + "," + 
                   this.group.id + "," + 
                   this.torneoMatch.match_number + "," + 
                   this.getVenue() + "," + 
                   this.torneoMatch.team_A_name + "-" + this.torneoMatch.team_B_name + "," + 
                   refe + "," + 
                   puuttuu;

        }
    }

    toTimeString(){
        if(this.hasTime === false) return "--:--";
        let h = this.datetime.getHours().toString();
        if(h.length < 2) h = "0" + h;
        let m = this.datetime.getMinutes().toString();
        if(m.length < 2) m = "0" + m;
        return h + ":" + m;
    }

    toLogString(){
        return this.id + "   " + 
               this.category.name + "   " + 
               this.datetime.toLocaleDateString() + "   " + 
               this.datetime.toLocaleTimeString() + "   " + 
               this.torneoMatch.venue_name + "   " + 
               this.torneoMatch.team_A_name + " - " +
               this.torneoMatch.team_B_name + "   ";
    }

    isDisplayed(map){
        for(let id of this.referee_ids){
            let refe = map.get(id);

            if(refe == undefined){
                this.special = 1;
                return true;
            }
            if(refe.displayed) return true;
        }
        return false;
    }

    isWorkloadDisplayed(map){
        for(let id of this.referee_ids){
            let refe = map.get(id);

            if(refe == undefined){
                this.special = 1;
                return true;
            }
            if(refe.displayed && refe.showWorkLoad) return true;
        }
        return false;
    }

    fill_date(){
        let a = this.torneoMatch;
        let da = a.date.split("-");
        if(da.length < 3){
            da = ["2030", "1", "1"];
             this.displayed = false;
        }
        
        let ta = a.time.split(":");
        if(ta.length < 3){
             ta = ["23", "59", "59"];
             this.hasTime = false;
        }
        
        let date_a = new Date(da[0], da[1]-1, da[2], ta[0], ta[1], ta[2], 0);
        this.datetime = date_a;

        this.datelocal = date_a.toLocaleDateString();
        let hours = date_a.getHours().toString();
        if(hours.length < 2) hours = "0" + hours;
        let mins = date_a.getMinutes().toString();
        if(mins.length < 2) mins = "0" + mins;
        this.timelocal = hours + ":" + mins;

        switch(this.datetime.getDay()){
            case 0: this.weekday = "Su"; break;
            case 1: this.weekday = "Ma"; break;
            case 2: this.weekday = "Ti"; break;
            case 3: this.weekday = "Ke"; break;
            case 4: this.weekday = "To"; break;
            case 5: this.weekday = "Pe"; break;
            case 6: this.weekday = "La"; break;
        }   

        this.week = this.datetime.getWeek();
    }

    hasReferees(){
        return this.referees.length > 0;
    }

    fill_referees(){
        // Asetetaan ottelulle tieto tuomarien statuksesta
        let m = this.torneoMatch;
        this.referee_status="";
        this.referees = [];
        this.referee_ids = [];

        let puuttuu = [];

        if(REF4.includes(m.category_id)){
            // Kaikki neljä täytyy löytyä
            if(!(m.referee_1_name !== null && m.referee_1_name.length > 0 &&  m.referee_1_name !== "??")) puuttuu.push("PT"); 
            else { this.referees.push(m.referee_1_name); this.referee_ids.push(m.referee_1_id); }

            if(!(m.referee_2_name !== null && m.referee_2_name.length > 0 &&  m.referee_2_name !== "??")) puuttuu.push("VT"); 
            else { this.referees.push(m.referee_2_name); this.referee_ids.push(m.referee_2_id); }

            if(!(m.assistant_referee_1_name !== null && m.assistant_referee_1_name.length > 0 &&  m.assistant_referee_1_name !== "??")) puuttuu.push("RT1"); 
            else { this.referees.push(m.assistant_referee_1_name); this.referee_ids.push(m.assistant_referee_1_id); }

            if(!(m.assistant_referee_2_name !== null && m.assistant_referee_2_name.length > 0 &&  m.assistant_referee_2_name !== "??")) puuttuu.push("RT2"); 
            else { this.referees.push(m.assistant_referee_2_name); this.referee_ids.push(m.assistant_referee_2_id); }

        }
        else if(REF2.includes(m.category_id)){
            // Kaksi täytyy löytyä
            if(!(m.referee_1_name !== null && m.referee_1_name.length > 0 &&  m.referee_1_name !== "??")) puuttuu.push("PT"); 
            else { this.referees.push(m.referee_1_name); this.referee_ids.push(m.referee_1_id); }

            if(!(m.referee_2_name !== null && m.referee_2_name.length > 0 &&  m.referee_2_name !== "??")) puuttuu.push("VT"); 
            else { this.referees.push(m.referee_2_name); this.referee_ids.push(m.referee_2_id); }
        }
        else {    
            // Yksi sentään 
            if(!(m.referee_1_name !== null && m.referee_1_name.length > 0 &&  m.referee_1_name !== "??")) puuttuu.push("PT"); 
            else { this.referees.push(m.referee_1_name); this.referee_ids.push(m.referee_1_id); }
        }

        this.referee_status = puuttuu.join(" ");

        if(this.referee_status !== ''){
            var breaker=0;
        }
    }  

    isValidDate(){
        return this.datetime > new Date() && this.datetime.getFullYear()<2030;
    }

    getVenue(){
        let ret = this.torneoMatch.venue_name;
        if(!ret) return "----";
        return ret;
    }
}

class Category {
    constructor(torneoCategory){
        this.torneoCategory = torneoCategory;
        this.displayed = true;
        this.id = torneoCategory.category_id;
        this.name = torneoCategory.category_name;
        this.groups=[];
        this.development=false;
        this.isNew=true;
        this.loaded = false;
        if(DEVELOPMENT) this.development=true;
    }

    isFinished(){
        for(let group of this.groups){
            if(!group.isFinished()) return false;
        }
        return true;
    }

    getJson(){
        return new Category(this.torneoCategory);
    }
}

class Competition {
    constructor(torneoCompetition){
        this.torneoCompetition = torneoCompetition;
        this.displayed = true;
        this.name = torneoCompetition.competition_name;
        this.id = torneoCompetition.competition_id;
        this.categories = [];
        this.development=false;
        this.isNew=true;
        this.loaded=false;
        if(DEVELOPMENT) this.development=true;
    }

    isFinished(){
        for(let category of this.categories){
            if(!category.isFinished()) return false;
        }
        return true;
    }

    getJson(){
        return new Competition(this.torneoCompetition);
    }
}

class Group {
    constructor(torneoGroup){
        this.id = torneoGroup.group_id;
        this.name = torneoGroup.group_name;
        this.torneoGroup = torneoGroup;
        this.displayed = true;
        this.matches = [];
        this.teams = [];
        this.development=false;
        this.isNew=true;
        if(DEVELOPMENT) this.development=true;
    }

    isFinished(){
        for(let match of this.matches){
            if(!match.played) return false;
        }
        return true;
    }

    fillTeams(){
        // Haetaan lohkon otteluista joukkueet
        for(let match of this.matches){
            if(null === this.getTeam(match.torneoMatch.team_A_id)){
                this.teams.push(new Team(match.torneoMatch.team_A_id, match.torneoMatch.team_A_name));
            }
            if(null === this.getTeam(match.torneoMatch.team_B_id)){
                this.teams.push(new Team(match.torneoMatch.team_B_id, match.torneoMatch.team_B_name));
            }
        }
    }

    getTeam(id){
        for(let team of this.teams){
            if(team.id === id) return team;
        }        
        return null;
    }

    getJson(){
        return new Group(this.torneoGroup);
    }
}

class Referee {
      constructor(torneoReferee){
          this.id = torneoReferee.referee_id;
          this.name = pois_umlaut(torneoReferee.last_name + " " + torneoReferee.first_name);
          this.gsm = torneoReferee.gsm;
          this.PostiNo = torneoReferee.posti;
          this.Kunta = pois_umlaut(torneoReferee.kunta);
          this.Email = torneoReferee.email;
          this.Luokka = torneoReferee.lk;
          this.torneoReferee = torneoReferee;
          this.displayed = true;
          this.showWorkLoad = true;
          this.showDouble = true;
          this.href="https://lentopallo.torneopal.fi/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id; 

          if(this.Luokka == "I-luokka") this.Luokka = "I";
          if(this.Luokka == "II-luokka") this.Luokka = "II";
          if(this.Luokka == "III-luokka") this.Luokka = "III";
    }  
}

class Team {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.displayed = true;
        this.matches = [];
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

$(document).ready(function () {
    initialSettings();

    $(window).resize(resizeWindow);
    resizeWindow();

    var app = new Vue({
        el: '#app',
        data: {
            show_days_ahead: 60,
            nimeamattomat_lkm: 0,
            tuplabuukkaukset_lkm: 0,
            alertShown: false,
            datestring: "2020-08-31",
            //date: new Date("2016-12-31"),
            matches: [],
            categories: [],
            competitions: [],
            message: 'Hello Vue!',
            klikattu: '',
            trig: true,
            referees: [],
            ids: [], 
            refereeMap: null,
            double_booking: [],
            loader_count: 0,
            cookies: { vie: {}, tuo: ""},
            dontLoadCookies: false,

            competitionSkip: [],
            categorySkip: [],
            groupSkip: [],
            teamSkip: [],

            showCSV: false,
            encuri: encodeURI("data:text/csv;charset=utf-8,asd,dfg,wer,sdfg\r\nsdf,dfg,xcv,wer\r\n"),

            estematriisi_show: false,
        },
        
        created: function () {
            var self = this;
            $("#loader").show();

            this.loadSkips();

            this.loadReferees();

            this.loadCompetitions();

            bus.on("ETSI_SARJALISTALTA_1", this.etsi_sarjalistalta);
        },
        watch: {
            referees: function(val){
                var ids = val.filter(r=>r.displayed).map(r=>r.id);
                window.SELECTED_REFEREE_IDS = ids;
            }
        },
        computed: {
            last_shown_day: function(){
                var now = moment();
                now.add(this.show_days_ahead, 'days');
                let ret = now.format("DD.MM.YYYY");
                return ret;                
            },
            
            matches_of_selected_referees: function(){
                if(this.loader_count > 0) return [];
                
                let ret = this.matches.filter((m)=>m.isDisplayed(this.refereeMap));
                ret = this.matches.sort(function(a,b){ return a.datetime-b.datetime;});
                return ret;
            },

            matches_of_workload_referees: function(){
                if(this.loader_count > 0) return [];
                
                let ret = this.matches.filter((m)=>m.isWorkloadDisplayed(this.refereeMap));
                ret = ret.sort(function(a,b){ return a.datetime-b.datetime;});
                //console.log("matches_of_workload_referees");
                return ret;
            },
            
            series_of_workload_referee_matches: function(){
                if(this.loader_count > 0) return [];
                
                // Poimitaan otteluista sarjat
                var inc = [];
                var ret = [];
                let notSelectedSerieIds = Lockr.get(PREFIX + "notSelectedSerieIds", []);
                for(let match of this.matches_of_workload_referees){
                    if(inc.includes(match.category.id) == false){
                        inc.push(match.category.id);
                        ret.push({
                            id: match.category.id,
                            displayed: !notSelectedSerieIds.includes(match.category.id)
                        });
                    }
                }
                return ret;
            },

            workload_referees: function(){
                if(this.loader_count > 0) return [];
                
                let ret = this.referees.filter((m)=>m.displayed && m.showWorkLoad);
                ret = ret.sort(function(a,b){
                    var ret = a.LuokkaNo - b.LuokkaNo;
                    if(ret != 0) return ret;

                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                    return 0;
                });

                return ret;
            },
            
            matches_of_displayed_categories: function(){
                if(this.loader_count > 0) return [];
                
                return this.matches.filter((m)=>m.competition.displayed && m.category.displayed && m.group.displayed);
            },

            matches_with_incomplete_referees: function(){
                if(this.loader_count > 0) return [];

                let matches_without_referee =this.matches_of_displayed_categories
                                             .filter((m)=>m.isDisplayed())
                                             .filter((m)=>m.referee_status.length > 0)
                                             .sort((m1, m2)=> m1.datetime-m2.datetime);
                


                setWeekSeparators(matches_without_referee);
                return matches_without_referee;  
            },

            all_matches: function(){
                if(this.loader_count > 0) return [];

                let ret = this.matches_of_displayed_categories
                    .filter((m)=>m.isDisplayed())
                    .sort((m1, m2)=> m1.datetime-m2.datetime);
                                
                setWeekSeparators(ret);
                                
                return ret;
            },
        },
        methods: {
            resize: resizeWindow,
            
            etsi_sarjalistalta: function(ids){
                $("#sarjat_tab").trigger('click');
                setTimeout(function(){
                    bus.emit("ETSI_SARJALISTALTA_2", ids)
                }, 300);
            },

            loadReferees: function(){
                var self = this;
                self.refereeMap = new Map();

                var url = "https://lentopallo.torneopal.fi/taso/rest/getReferees?api_key=qfzy3wsw9cqu25kq5zre"; 
                //url = "/ajax/referees.json";
                url = "https://www.lentopalloerotuomarit.fi/list/autoreferees.php";

                $.get(url, function(data_){
                    let data = JSON.parse(data_);
                    self.referees = [];
                    if(data.call != undefined && data.call.status == "error"){
                        alert("Tuomarien tietojen haku epäonnistui.");
                        return;
                    }
                    for(let referee of data.referees){
                        
                        let newReferee = new Referee(referee);
                        // tuomariDetails = getTuomariDetails(referee.referee_id);
                        // newReferee.PostiNo = tuomariDetails.PostiNo;
                        // newReferee.Kunta = tuomariDetails.Kunta;
                        // newReferee.Luokka = tuomariDetails.Luokka;
                        switch(newReferee.Luokka){
                            case "Liiga": newReferee.LuokkaNo = 0; break;
                            case "PS": newReferee.LuokkaNo = 1; break;
                            case "I": newReferee.LuokkaNo = 2; break;
                            case "I-luokka": newReferee.LuokkaNo = 2; break;
                            case "II": newReferee.LuokkaNo = 3; break;
                            case "II-luokka": newReferee.LuokkaNo = 3; break;
                            case "III": newReferee.LuokkaNo = 4; break;
                            case "III-luokka": newReferee.LuokkaNo = 4; break;
                            case "NT": newReferee.LuokkaNo = 5; break;
                            default: newReferee.LuokkaNo = 4;
                        }

                        self.refereeMap.set(referee.referee_id, newReferee);
                        self.referees.push(newReferee);    
                    }
                });
            },

            isSkipCompetition: function(competition_id){
                if(SKIP_COMPETITION.includes(competition_id)){
                    //console.log("  getCategories: " + competition_id + " SKIPPED");
                    return true;
                }
                
                for(let skipCompetition of this.competitionSkip){
                    if(skipCompetition === competition_id){
                        return true;
                    } 
                }

                return false;
            },

            isSkipCategory: function(competition_id, category_id){
                if(SKIP_CATEGORY.includes(category_id)) return true;

                for(let skip of SKIP_CATEGORIES){
                    if(skip.competition_id === competition_id && skip.skip_list.includes(category_id)){
                        return true;
                    } 
                }

                for(let skipLine of this.categorySkip){
                    let arr = skipLine.split(".");
                    if(arr[0] === competition_id && arr[1] === category_id){
                        return true;
                    } 
                }

                return false;
            },

            loadCategoriesFromChild: function(competition_id){
                // Sarjanäkymästä tuli käsky ladata sarjat annetulle kilpailulle
                this.dontLoadCookies = true;
                $("#loader").show();
                let competition = this.getCompetition(competition_id);
                this.loadCategories(competition);
            },

            loadGroupsFromChild: function(competition_id, category_id){
                // Sarjanäkymästä tuli käsky ladata lohkot annetulle sarjalle
                this.dontLoadCookies = true;
                $("#loader").show();
                let competition = this.getCompetition(competition_id);
                let pos=0;
                for(let category of competition.categories){
                    if(category.id === category_id){
                        this.loadGroups(competition, category, pos);
                    }
                    pos++;
                }
            },

            loadCompetitions: function(){
                var self = this;

                //console.log("getCompetitions: https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre");
                $.get("https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre", function(data){
                    for(let torneoCompetition of data.competitions){
                        console.log(torneoCompetition.season_id);
                        if(torneoCompetition.season_id != "2020-21") continue;
                        let competition = new Competition(torneoCompetition);
                        competition.categories = [];

                        if(self.isSkipCompetition(torneoCompetition.competition_id)){
                            self.competitions.push(competition);
                            continue;
                        } else {
                            self.loadCategories(competition);
                            self.competitions.push(competition);
                        } 
                    }
                });
            },

            loadCategories: function(competition){
                var self = this;
                let url = "https://lentopallo.torneopal.fi/taso/rest/getCategories?api_key=qfzy3wsw9cqu25kq5zre&competition_id=" + competition.torneoCompetition.competition_id;
                
                let torneoCompetition = competition.torneoCompetition;

                competition.loaded = true;
                console.log("loadCategories url: " + url);
                $.get(url, function(data){
                    if(data.call.status === "error") return;
                    //console.log(data);
                    for(let torneoCategory of data.categories){
                        //console.log("Ladataan: " + competition.id + ": " + torneoCategory.category_id);

                        let category = new Category(torneoCategory);

                        if(torneoCategory.category_id == 'TESTI') continue;

                        if(self.isSkipCategory(torneoCompetition.competition_id, torneoCategory.category_id)){
                            category.displayed = false;
                            competition.categories.push(category);
                            continue;
                        } else {
                            self.loadGroups(competition, category);
                        }

                    }
                });
            },

            loadGroups: function(competition, category, pushPosition=-1){
                // Tämä pois??
                // Lohkot & ottelut
                let self = this;
                if(!category || !category.torneoCategory || !category.torneoCategory.category_id){
                    console.log("Tyhjä category");
                    return;
                }
                let url2 = "https://lentopallo.torneopal.fi/taso/rest/getCategory?api_key=qfzy3wsw9cqu25kq5zre&category_id=" + category.torneoCategory.category_id + "&competition_id=" + category.torneoCategory.competition_id + "&matches=1";
                self.loader(1);
                let retCategory;


                $.get(url2, function(data){
                    if(category.id == "N1"){
                        var breaker=1;
                    }

                    if(data.call.status === "error"){
                        self.loader(-1);
                        return;
                    }

                    let detailedTorneoCategory = data.category;
                    
                    retCategory = new Category(data.category);

                    let my_groups = [];

                    for(let torneoGroup of detailedTorneoCategory.groups){
                        let group = new Group(torneoGroup);
                        //console.log("L              " + competition.id + ": " + detailedTorneoCategory.category_id + " - " + group.id);
                        
                        if(!detailedTorneoCategory.matches){
                            //debugger;
                            console.log("    Ei otteluita: " + competition.id + ": " + detailedTorneoCategory.category_id);
                            continue;
                        }

                        for(let torneoMatch of detailedTorneoCategory.matches){
                            if(torneoMatch.group_id !== group.id) continue;
                            //console.log(self.matches.length);
                            let match = new Match(torneoMatch, competition, retCategory, group);
                            if(match.datetime < new Date(2030,1,1,0,0,0,0)){
                                self.matches.push(match);
                                group.matches.push(match);
                            }
                        }
                        group.fillTeams();
                        my_groups.push(group);
                    }
                    retCategory.groups = my_groups;
                    retCategory.loaded = true;
                    category.groups = my_groups;
                    category.loaded = true;

                    if(pushPosition < 0) competition.categories.push(retCategory);
                    else {
                        competition.categories.splice(pushPosition, 1, retCategory);
                    }

                    self.loader(-1);
                    
                });
            },

            loader: function(delta){
                this.loader_count = this.loader_count + delta;
                //console.log("LOADER: " + this.loader_count);
                $("#loader").text("Ladataan tietoja, sarjoja jäljellä " + this.loader_count + "...");

                if(this.loader_count < 1){
                    if(!this.dontLoadCookies) this.loadCookies();
                    this.checkDoubleBooking();
                    this.checkForeignReferees();
                    $("#loader").hide();
                }
            },

            clearCookies: function(){
                Lockr.set(PREFIX + "ShowDaysAhead", 60);
                Lockr.set(PREFIX + "Competitions", []);
                Lockr.set(PREFIX + "Categories", []);
                Lockr.set(PREFIX + "Groups", []);
                Lockr.set(PREFIX + "Teams", []);
                Lockr.set(PREFIX + "Referees", []);
                Lockr.set(PREFIX + "RefereeDoubles", []);
                Lockr.set(PREFIX + "RefereeWorkload", []);

                this.loadCookies();
            },

            importCookies: function(){
                let json = JSON.parse(this.cookies.tuo);

                Lockr.set(PREFIX + "ShowDaysAhead", json.ShowDaysAhead);
                Lockr.set(PREFIX + "Competitions", json.Competitions);
                Lockr.set(PREFIX + "Categories", json.Categories);
                Lockr.set(PREFIX + "Groups", json.Groups);
                Lockr.set(PREFIX + "Teams", json.Teams);
                Lockr.set(PREFIX + "Referees", json.Referees);
                Lockr.set(PREFIX + "RefereeDoubles", json.RefereeDoubles);
                Lockr.set(PREFIX + "RefereeWorkload", json.RefereeWorkload);

                this.loadCookies();
            },

            saveCookies: function(){
                // Show days ahead
                Lockr.set(PREFIX + "ShowDaysAhead", this.show_days_ahead);

                // competitions, categories & groups
                var comp=[], cat=[], gro = [], tea=[];
                for(let competition of this.competitions){
                    if(!competition.displayed) comp.push(competition.id);
                    for(let category of competition.categories){
                        if(!category.displayed) cat.push(competition.id + "." + category.id);
                        for(let group of category.groups){
                            if(!group.displayed) gro.push(competition.id + "." + category.id + "." + group.id);
                            for(let team of group.teams){
                                if(!team.displayed) tea.push(competition.id + "." + category.id + "." + group.id + "." + team.id);
                            }
                        }
                    }
                }

                // Aiemmin talletetuista asetuksista poimitaan kaikki kategoriat, joiden competition-osa ei ole erikseen competitions-listalla.
                // Vastaavasti poimitaan kaikki groupit, joiden competition + category -osa ei ole erikseen listalla
                // Joukkueista poimitaan ne, joiden competition + category + group -osa ei ole erikseen listalla
                var prevCat, prevGroup, prevTeam;
                prevCat, prevGroup, prevTeam = this.retainCookies(comp, cat, gro, tea);

                Lockr.set(PREFIX + "Competitions", comp);
                Lockr.set(PREFIX + "Categories", cat);
                Lockr.set(PREFIX + "Groups", gro);
                Lockr.set(PREFIX + "Teams", tea);

                list = [], workload =[], double=[];
                for(let referee of this.referees){
                    if(referee.displayed === false) list.push(referee.id);
                    if(referee.showDouble === false) double.push(referee.id);
                    if(referee.showWorkLoad === false) workload.push(referee.id);
                }
                Lockr.set(PREFIX + "Referees", list);
                Lockr.set(PREFIX + "RefereeDoubles", double);
                Lockr.set(PREFIX + "RefereeWorkload", workload);

                window.SELECTED_REFEREE_IDS = this.referees.filter(r=>r.displayed).map(r=>r.id);
            },

            retainCookies: function(comp, cat, gro, tea){
                // Aiemmin talletetuista asetuksista poimitaan kaikki kategoriat, joiden competition-osa ei ole erikseen competitions-listalla.
                // Vastaavasti poimitaan kaikki groupit, joiden competition + category -osa ei ole erikseen listalla
                // Joukkueista poimitaan ne, joiden competition + category + group -osa ei ole erikseen listalla

                let getComp = (cat_)=> cat_.split(".")[0];
                let getCat = (gro_)=> { let arr = gro_.split("."); return arr[0] + "." + arr[1]; }
                let getGro = (tea_)=> { let arr = tea_.split("."); return arr[0] + "." + arr[1] + "." + arr[2]; }

                let retCat = this.categorySkip, 
                    retGro = this.groupSkip, 
                    retTea = this.teamSkip;
                
                // Suodatetaan kilpailun mukaan
                retCat = retCat.filter((c)=>cookieMatch(getComp(c), comp) == false);
                retGro = retGro.filter((c)=>cookieMatch(getComp(c), comp) == false);
                retTea = retTea.filter((c)=>cookieMatch(getComp(c), comp) == false);

                // Suodatetaan kategorian mukaan
                retGro = retGro.filter((c)=>cookieMatch(getCat(c), cat) == false);
                retTea = retTea.filter((c)=>cookieMatch(getCat(c), cat) == false);

                // Suodatetaan groupin mukaan
                retTea = retTea.filter((c)=>cookieMatch(getGro(c), gro) == false);
                
                return retCat, retGro, retTea;

            },

            loadSkips: function(){
                let json = {};

                this.competitionSkip = Lockr.getArr(PREFIX + "Competitions");
                this.categorySkip = Lockr.getArr(PREFIX + "Categories");
                this.groupSkip = Lockr.getArr(PREFIX + "Groups");
                this.teamSkip = Lockr.getArr(PREFIX + "Teams");
            },

            loadCookies: function(){
                console.log("Load cookies");
                let json = {};

                this.show_days_ahead = json.ShowDaysAhead = Lockr.get(PREFIX + "ShowDaysAhead", "60");

                let comp = this.competitionSkip = json.Competitions = Lockr.getArr(PREFIX + "Competitions");
                let cat = this.categorySkip = json.Categories = Lockr.getArr(PREFIX + "Categories");
                let gro = this.groupSkip = json.Groups = Lockr.getArr(PREFIX + "Groups");
                let tea = this.teamSkip = json.Teams = Lockr.getArr(PREFIX + "Teams");

                if(comp.length < 1) comp = ["vb2020a"];

                for(let competition of this.competitions){
                    // Käsitellään kilpailujen ruksit
                    for(let compItem of comp){
                        if(competition.id === compItem) competition.displayed = false;
                    }

                    //console.log(competition.id);

                    for(let category of competition.categories){
                        // Käsitellään sarjojen ruksit
                        //console.log("C    " + category.id);
                        
                        for(let catItem of cat){
                            let arr = catItem.split(".");
                            if(competition.id === arr[0] && category.id === arr[1]) category.displayed = false;
                        }
                        
                        if(category.id == "N1"){
                            var breaker=1;
                        }

                        for(let group of category.groups){
                            // Käsitellään lohkojen ruksit
                            //console.log("C        " + group.id);
                            for(let groItem of gro){
                                let arr = groItem.split(".");
                                if(competition.id === arr[0] && category.id === arr[1] && group.id === arr[2]) group.displayed = false;
                            }
                            
                            for(let team of group.teams){
                                // Käsitellään joukkueiden ruksit
                                //console.log("C            " + team.id + " - " + team.name);
                                for(let teaItem of tea){
                                let arr = teaItem.split(".");
                                    if(competition.id === arr[0] && category.id === arr[1] && group.id === arr[2] && team.id === arr[3]) team.displayed = false;
                                }
                            }
                        }
                    }
                }

                let disp = json.Referees = Lockr.getArr(PREFIX + "Referees");
                let doub = json.RefereeDoubles = Lockr.getArr(PREFIX + "RefereeDoubles");
                let work = json.RefereeWorkload = Lockr.getArr(PREFIX + "RefereeWorkload");
    
                for(let referee of this.referees){
                    if(disp.includes(referee.id)) referee.displayed = false;
                    if(doub.includes(referee.id)) referee.showDouble = false;
                    if(work.includes(referee.id)) referee.showWorkLoad = false;
                }
              
                window.SELECTED_REFEREE_IDS = this.referees.filter(r=>r.displayed).map(r=>r.id);
                
                this.cookies.vie = JSON.stringify(json);
            },
            getReferee: function(id){
                for(let referee of this.referees){
                    if(referee.id === id) return referee;
                }
                return null;
            },
            getCompetition: function(id){
                for(let competition of this.competitions){
                    if(competition.id === id) return competition;
                }
                return null;
            },
            
            checkForeignReferees: function(){
                // Käydään läpi kaikki ottelut ja näytetään tapaukset, joissa otteluun on nimetty ei-omaksi valittu tuomari
                let referee_ids = "";
                for(let referee of this.referees){
                    if(referee.displayed) referee_ids += ", " + referee.id;
                }

                let list = this.matches_of_displayed_categories.filter((m)=>m.isValidDate() && m.hasReferees() && m.isDisplayed());
                list = list.sort(function(a,b){return a.datetime -b.datetime;});
                for(let match of list){
                    for(let id of match.referee_ids){
                        if(referee_ids.indexOf(id)<0){
                            // Otteluun on valittu vieras tuomari
                            console.log("VIERAS TUOMARI:" + match.referees.join(", ") + "    " + match.torneoMatch.team_A_name + "-" + match.torneoMatch.team_B_name);
                        }
                    }
                }
            },
            
            checkDoubleBooking: function(){
                // Käydään läpi kaikki ottelut ja merkitään tuplabuukkaukset eri listalle.
                this.double_booking = [];
                let list = this.matches.filter((m)=>m.isValidDate());
                list = list.sort(function(a,b){return a.datetime -b.datetime;});
                while(list.length > 0){
                    let a=0;
                    [a, ...list] = list;
                    let inspect_list = [a];
                    let day = a.datetime.toDateString();

                    while(list.length > 0 && day === list[0].datetime.toDateString()){
                        let b=0; 
                        [b, ...list] = list;
                        inspect_list.push(b);
                    }

                    // Nyt inspect_listalla on vain saman päivän pelejä. Sitten pitäisi etsiä tuomareita, joiden nimi esiintyy noissa peleissä useammin kuin kerran.
                    let day_referee_ids = [];
                    let day_duplicates = [];
                    let referees_with_duplicates = new Set();
                    for(let match of inspect_list){
                        for(let referee_id of match.referee_ids){
                            if(day_referee_ids.includes(referee_id)){
                                referees_with_duplicates.add(referee_id);
                                day_duplicates.push({match: match, referee_id: referee_id});
                            } else {
                                day_referee_ids.push(referee_id);
                            }

                        }
                    }

                    // Käydään päivän duplikaatit läpi
                    for(let referee_id of referees_with_duplicates){
                        let double_booking_item = { referee: this.getReferee(referee_id), matches: []};
                        for(let match of inspect_list.filter((m)=>m.referee_ids.includes(referee_id))){
                            double_booking_item.matches.push(match);
                        }
                        this.double_booking.push(double_booking_item);
                    }                    
                }
            },

            toCSV: function(){
                let text = "data:text/csv;charset=utf-8,";
                for(let match of this.all_matches){
                    text += match.toCSV() + "\r\n";
                }
                return encodeURI(text);
            },

        }
    });
});

