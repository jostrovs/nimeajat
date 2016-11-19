// M1 Miesten 1-sarja
// M2 Miesten 2-sarja
// M3 Miesten 3-sarja
// ML Miesten Mestaruusliiga
// MSC Miesten Suomen Cup
// N1 Naisten 1-sarja
// N2 Naisten 2-sarja
// NL Naisten Mestaruusliiga
// NSC Naisten Suomen Cup

class Match{
    constructor(torneoMatch, competition, category, group){
        this.number = torneoMatch.match_number;
        this.id = torneoMatch.match_id;
        this.torneoMatch = torneoMatch;
        this.displayed = true;
        this.referees = [];
        this.href="https://lentopallo.torneopal.fi/taso/ottelu.php?otteluid=" + this.id;

        if(this.number === "4363" || this.number === "2161"){
            var breaker=0;
        }

        this.fill_date();
        this.fill_referees();

        this.competition = competition;
        
        this.category = category;
        this.category_href="https://lentopallo.torneopal.fi/taso/sarja.php?turnaus=" + competition.id + "&sarja=" + category.id;
        
        this.group = group;
        this.group_href = this.category_href + "&lohko=" + this.group.id;

        this.special = 0;
    }

    toTimeString(){
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

    fill_date(){
        let a = this.torneoMatch;
        let da = a.date.split("-");
        if(da.length < 3) da = ["2030", "1", "1"];
        
        let ta = a.time.split(":");
        if(ta.length < 3) ta = ["23", "59", "59"];
        
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
    }  
}

class Category {
    constructor(torneoCategory){
        this.torneoCategory = torneoCategory;
        this.displayed = true;
        this.id = torneoCategory.category_id;
        this.name = torneoCategory.category_name;
    }
}

class Competition {
    constructor(torneoCompetition){
        this.torneoCompetition = torneoCompetition;
        this.displayed = true;
        this.name = torneoCompetition.competition_name;
        this.id = torneoCompetition.competition_id;
    }
}

class Group {
    constructor(torneoGroup){
        this.id = torneoGroup.group_id;
        this.name = torneoGroup.group_name;
        this.torneoGroup = torneoGroup;
        this.displayed = true;
        this.matches = [];
    }
}

class Referee {
      constructor(torneoReferee){
          this.id = torneoReferee.referee_id;
          this.name = torneoReferee.last_name + " " + torneoReferee.first_name;
          this.torneoReferee = torneoReferee;
          this.displayed = true;
          this.href="https://lentopallo.torneopal.fi/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id; 
    }  
}

const REF4 = ["M1", "ML", "MSC", "N1", "NSC"];
const REF2 = ["M2", "M3"];

const SKIP_COMPETITION = ["aluetesti", "beach2016", "masku2016", "power2016",
  // Junnuja:
 "vb2016n"];

const SKIP_CATEGORY = ["TB", "PB", "PC", "PD", "PE", "PF", "PD6", "PDAlku", "PDT", "PDalku", "PET", "TD-AM", "TDT", "TE", "TE-Tiikeri", "TPE", "TPF", "TD", "TET", "TPD", "TPD", "TF", "testi", "TESTI", "Testi"];

const SKIP_CATEGORIES = [
     { competition_id: "vb2016epohj",
       skip_list: ["NH"] // Ei näemmä nimetä tuomareita
     },
     { competition_id: "vb2016esavo",
       skip_list: ["MES", "NES"] // Ei näemmä nimetä tuomareita
     },
     { competition_id: "vb2016ksuomi",
       skip_list: ["KSDp", "KSEp", "KSDt", "KSEt", "KSD6vs6", "KSEtoim", "KSFtoim"]
     },
     { competition_id: "vb2016isuomi",
       skip_list: ["PB Itä", "PC Itä", "TB Itä", "TC Itä", "PD6vs6", "Itä PD", "TD6vs6"]
     },
     { competition_id: "vb2016lsuomi",
       skip_list: ["PAAM", "PBAM", "PCAM" , "PDAM", "PEAM", "TAAM", "TBAM", "TCAM", "TDAM", "TEAM", "NuoSEKA",
                   "MKaKS", "MTTS", "NTTS", "MTTS-Aas", "MTTS Ai", "MTTS Al", "MTTS-Ays", "MTTS B"]
     },
     { competition_id: "vb2016esuomi",
       skip_list: ["MKunto"]
     },
     { competition_id: "vb2016lappi",
       skip_list: ["MA", "MB", "NA"]
     },
     { competition_id: "vb2016psavo",
       skip_list: ["MPS", "NPS"]
     },
     { competition_id: "vb2016ppohj",
       skip_list: ["PM", "PN"]
     },
 ];

var match_without_date = function(m){
    // Pois ottelut, joilla ei ole päivämäärää
    return m.datetime < new Date(2029, 1, 1, 1, 1, 1, 1);
};



var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
};

var order_match = function(a,b){
    a.datetime < b.datetime;
    return date_a < date_b;
};

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            alertShown: false,
            datestring: "2016-12-31",
            date: new Date("2016-12-31"),
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
        },
        created: function () {
            var self = this;
            
            self.refereeMap = new Map();

            var REFEREES_TEST = false;
            
            var url = "https://lentopallo.torneopal.fi/taso/rest/getReferees?api_key=qfzy3wsw9cqu25kq5zre"; 
            
            if(REFEREES_TEST) url = "/ajax/referees.json";


            $.get(url, function(data){
                self.referees = [];
                for(let referee of data.referees){
                    
                    let newReferee = new Referee(referee);
                    tuomariDetails = getTuomariDetails(referee.referee_id);
                    newReferee.PostiNo = tuomariDetails.PostiNo;
                    newReferee.Kunta = tuomariDetails.Kunta;
                    newReferee.Luokka = tuomariDetails.Luokka;

                    self.refereeMap.set(referee.referee_id, newReferee);
                    self.referees.push(newReferee);    
                }
                if(REFEREES_TEST) self.loadCookies();
            });

            if(REFEREES_TEST) return;
            $("#loader").show();
            var loader_count = 0;

            $.get("https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre", function(data){
                for(let torneoCompetition of data.competitions){
                    let url = "https://lentopallo.torneopal.fi/taso/rest/getCategories?api_key=qfzy3wsw9cqu25kq5zre&competition_id=" + torneoCompetition.competition_id;
                    if(SKIP_COMPETITION.includes(torneoCompetition.competition_id)) continue; 
                    let competition = new Competition(torneoCompetition);
                    competition.categories = [];
                    self.competitions.push(competition);
                    $.get(url, function(data){
                        if(data.call.status === "error") return;
                        //console.log(data);
                        for(let torneoCategory of data.categories){
                            if(SKIP_CATEGORY.includes(torneoCategory.category_id)) continue;
                            
                            let skip_this = false;
                            for(let skip of SKIP_CATEGORIES){
                                if(skip.competition_id === torneoCategory.competition_id && skip.skip_list.includes(torneoCategory.category_id)){
                                    skip_this = true;
                                    break;
                                } 
                            }
                            if(skip_this) continue;

                            // Lohkot & ottelut
                            let url2 = "https://lentopallo.torneopal.fi/taso/rest/getCategory?api_key=qfzy3wsw9cqu25kq5zre&category_id=" + torneoCategory.category_id + "&competition_id=" + torneoCategory.competition_id + "&matches=1";
                            //console.log(url2);
                            ++loader_count;
                            $.get(url2, function(data){
                                if(data.call.status === "error"){
                                    --loader_count;
                                    return;
                                }

                                let detailedTorneoCategory = data.category
                                
                                let category = new Category(data.category);

                                let my_groups = [];

                                for(let torneoGroup of detailedTorneoCategory.groups){
                                    let group = new Group(torneoGroup);

                                    for(let torneoMatch of detailedTorneoCategory.matches){
                                        if(torneoMatch.group_id !== group.id) continue;
                                        //console.log(self.matches.length);
                                        let match = new Match(torneoMatch, competition, category, group);
                                        if(match.datetime >= new Date() && match.datetime < new Date(2030,1,1,0,0,0,0)){
                                            // Lisätään vain jos ottelu on vasta tulossa
                                            self.matches.push(match);
                                            group.matches.push(match);
                                        }

                                    }
                                    my_groups.push(group);
                                }
                                category.groups = my_groups;
                                competition.categories.push(category);
                                console.log("loader_count: " + loader_count);
                                if(--loader_count < 1){
                                     console.log("loadCookies, match count: " + self.matches.length.toString() + "   loader_count: " + loader_count);
                                     self.loadCookies();
                                     self.checkDoubleBooking();
                                     $("#loader").hide();
                                }
                            });
                        }
                    });
                }
            });
            
            
            // $.get("/data/ottelut.json", function (data) {
            // //$.get("https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre", function (data) {
            //     //self.matches = data.matches.map(fill_date).filter(match_without_date);
            //     self.matches = data.matches.map(fill_date).map(fill_referees);//
            //     //self.matches = matches3;
            // });

            // $.get("/data/categories.json", function (data) {
            // //$.get("https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre", function (data) {
            //     self.categories = data.categories.filter((cat)=>cat.category_id!="TESTI");
            //     //self.matches = matches3;
            // });

            
        },
        computed: {
            matches_of_selected_referees: function(){
                let ret = this.matches.filter((m)=>m.isDisplayed(this.refereeMap));
                return ret;
            },
            
            matches_of_displayed_categories: function(){
                this.date = new Date(this.datestring);
                return this.matches.filter((m)=>m.competition.displayed && m.category.displayed && m.group.displayed).filter((m)=>m.datetime<this.date);
            },

            matches_with_incomplete_referees: function(){
                this.date = new Date(this.datestring);
                let matches_before_time = this.matches_of_displayed_categories.filter((m)=>m.datetime<this.date);
                let matches_without_referee =matches_before_time.filter((m)=>m.referee_status.length > 0);
                return matches_without_referee;  
            },
        },
        methods: {
            buttonklik: function(){
                this.klikattu = "Sä klikkasit mua!";
            },
            saveCookies: function(){
                var list = [];
                for(let competition of this.competitions){
                    for(let category of competition.categories){
                        for(let group of category.groups){
                            if(!group.displayed) list.push(category.id + "." + category.id + "." + group.id);
                        }
                    }
                }
                setCookie("tuomarilistacookie", JSON.stringify(list), 300);

                list = [];
                for(let referee of this.referees){
                    if(referee.displayed === false) list.push(referee.id);
                }
                setCookie("referees_cookie", JSON.stringify(list), 300);
            },
            loadCookies: function(){
                let str = getCookie("tuomarilistacookie");
                if(str){
                    let list = JSON.parse(str);
                    for(let competition of this.competitions){
                        for(let category of competition.categories){
                            for(let group of category.groups){
                                for(let item of list){
                                    let arr = item.split(".");
                                    if(category.id === arr[0] && category.id === arr[1] && group.id === arr[2]) group.displayed = false;
                                }
                            }
                        }
                    }
                }
                str = getCookie("referees_cookie");
                if(!str) return;

                let list = JSON.parse(str);
                for(let referee of this.referees){
                    for(let item of list){
                        if(referee.id === item) referee.displayed = false;
                    }
                }
            },
            getReferee: function(id){
                for(let referee of this.referees){
                    if(referee.id === id) return referee;
                }
                return null;
            },
            checkDoubleBooking: function(){
                // Käydään läpi kaikki ottelut ja merkitään tuplabuukkaukset eri listalle.
                this.double_booking = [];
                let list = this.matches.sort(function(a,b){return a.datetime -b.datetime;});
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
        }
    });
});

