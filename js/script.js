const PREFIX = "TUOMARILISTA_";

var initialSettings = function(){
    // Jos ei mitään suodatuksia ole asetettu, näytetään oletuksena vain liiton sarjat ja pari liigatuomaria
    let comp = Lockr.getArr(PREFIX + "Competitions");
    if(comp.length < 1){
        comp = ["SARJAPOHJA", "vb2016epohj", "vb2016esavo", "vb2016esuomi", "vb2016isuomi", "vb2016ksuomi", "vb2016lappi", "vb2016lsuomi", "vb2016pkarjala", "vb2016ppohj", "vb2016psavo"];
        Lockr.set(PREFIX + "Competitions", comp);
    }

    let refe = Lockr.getArr(PREFIX + "Referees");
    if(refe.length < 1){
        for(let i=1164;i<2500;++i){
            if(i != 1202 && i != 1288 && i!= 1225 && i != 1201){
                refe.push(i.toString());                
            }
        }
        Lockr.set(PREFIX + "Referees", refe);
    }
};

class Match{
    constructor(torneoMatch, competition, category, group){
        this.number = torneoMatch.match_number;
        this.id = torneoMatch.match_id;
        this.torneoMatch = torneoMatch;
        this.displayed = true;
        this.hasTime = true;
        
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
        this.teams = [];
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
}

class Referee {
      constructor(torneoReferee){
          this.id = torneoReferee.referee_id;
          this.name = torneoReferee.last_name + " " + torneoReferee.first_name;
          this.torneoReferee = torneoReferee;
          this.displayed = true;
          this.showWorkLoad = true;
          this.showDouble = true;
          this.href="https://lentopallo.torneopal.fi/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id; 
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

$(document).ready(function () {
    initialSettings();

    var app = new Vue({
        el: '#app',
        data: {
            show_days_ahead: 60,
            nimeamattomat_lkm: 0,
            tuplabuukkaukset_lkm: 0,
            alertShown: false,
            datestring: "2016-12-31",
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
            loader_count: 0            
        },
        
        created: function () {
            var self = this;
            $("#loader").show();

            this.loadReferees();

            this.loadCompetitions();
        },
        computed: {
            last_shown_day: function(){
                var now = new Date();
                now.setDate(now.getDate() + this.show_days_ahead);
                let ret = now.toLocaleDateString();
                return ret;                
            },
            
            matches_of_selected_referees: function(){
                let ret = this.matches.filter((m)=>m.isDisplayed(this.refereeMap));
                ret = this.matches.sort(function(a,b){ return a.datetime-b.datetime;});
                return ret;
            },

            matches_of_workload_referees: function(){
                let ret = this.matches.filter((m)=>m.isWorkloadDisplayed(this.refereeMap));
                ret = ret.sort(function(a,b){ return a.datetime-b.datetime;});
                //console.log("matches_of_workload_referees");
                return ret;
            },
            
            series_of_workload_referee_matches: function(){
                // Poimitaan otteluista sarjat
                var inc = [];
                var ret = [];
                let notSelectedSerieIds = Lockr.get("notSelectedSerieIds", []);
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
                return this.matches.filter((m)=>m.competition.displayed && m.category.displayed && m.group.displayed);
            },

            matches_with_incomplete_referees: function(){
                let matches_without_referee =this.matches_of_displayed_categories
                                             .filter((m)=>m.referee_status.length > 0)
                                             .sort((m1, m2)=> m1.datetime-m2.datetime);
                return matches_without_referee;  
            },
        },
        methods: {
            loadReferees: function(){
                var self = this;
                self.refereeMap = new Map();

                var url = "https://lentopallo.torneopal.fi/taso/rest/getReferees?api_key=qfzy3wsw9cqu25kq5zre"; 
                //url = "/ajax/referees.json";

                $.get(url, function(data){
                    self.referees = [];
                    for(let referee of data.referees){
                        
                        let newReferee = new Referee(referee);
                        tuomariDetails = getTuomariDetails(referee.referee_id);
                        newReferee.PostiNo = tuomariDetails.PostiNo;
                        newReferee.Kunta = tuomariDetails.Kunta;
                        newReferee.Luokka = tuomariDetails.Luokka;
                        switch(newReferee.Luokka){
                            case "Liiga": newReferee.LuokkaNo = 0; break;
                            case "Pääsarja": newReferee.LuokkaNo = 1; break;
                            case "I": newReferee.LuokkaNo = 2; break;
                            case "II": newReferee.LuokkaNo = 3; break;
                            case "III": newReferee.LuokkaNo = 4; break;
                            case "NT": newReferee.LuokkaNo = 5; break;
                            default: newReferee.LuokkaNo = 4;
                        }

                        self.refereeMap.set(referee.referee_id, newReferee);
                        self.referees.push(newReferee);    
                    }
                });
            },

            loadCompetitions: function(){
                var self = this;

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
                                ++self.loader_count;
                                $.get(url2, function(data){
                                    if(data.call.status === "error"){
                                        --self.loader_count;
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
                                            if(match.datetime < new Date(2030,1,1,0,0,0,0)){
                                                self.matches.push(match);
                                                group.matches.push(match);
                                            }
                                        }
                                        group.fillTeams();
                                        my_groups.push(group);
                                    }
                                    category.groups = my_groups;
                                    competition.categories.push(category);
                                    $("#loader").text("Ladataan tietoja, sarjoja jäljellä " + self.loader_count + "...");
                                    if(--self.loader_count < 1){
                                        self.loadCookies();
                                        self.checkDoubleBooking();
                                        $("#loader").hide();
                                    }
                                });
                            }
                        });
                    }
                });
                
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
            },
            loadCookies: function(){
                const PREFIX = "TUOMARILISTA_";

                this.show_days_ahead = Lockr.get(PREFIX + "ShowDaysAhead", "60");

                let comp = Lockr.getArr(PREFIX + "Competitions");
                let cat = Lockr.getArr(PREFIX + "Categories");
                let gro = Lockr.getArr(PREFIX + "Groups");
                let tea = Lockr.getArr(PREFIX + "Teams");

                if(comp.length < 1) comp = ["vb2016a"];

                for(let competition of this.competitions){
                    // Käsitellään kilpailujen ruksit
                    for(let compItem of comp){
                        if(competition.id === compItem) competition.displayed = false;
                    }

                    for(let category of competition.categories){
                        // Käsitellään sarjojen ruksit
                        for(let catItem of cat){
                            let arr = catItem.split(".");
                            if(competition.id === arr[0] && category.id === arr[1]) category.displayed = false;
                        }
                        
                        for(let group of category.groups){
                            // Käsitellään lohkojen ruksit
                            for(let groItem of gro){
                                let arr = groItem.split(".");
                                if(competition.id === arr[0] && category.id === arr[1] && group.id === arr[2]) group.displayed = false;
                            }
                            
                            for(let team of group.teams){
                                // Käsitellään joukkueiden ruksit
                                for(let teaItem of tea){
                                let arr = teaItem.split(".");
                                    if(competition.id === arr[0] && category.id === arr[1] && group.id === arr[2] && team.id === arr[3]) team.displayed = false;
                                }
                            }
                        }
                    }
                }

                let disp = Lockr.getArr(PREFIX + "Referees");
                let doub = Lockr.getArr(PREFIX + "RefereeDoubles");
                let work = Lockr.getArr(PREFIX + "RefereeWorkload");

                for(let referee of this.referees){
                    if(disp.includes(referee.id)) referee.displayed = false;
                    if(doub.includes(referee.id)) referee.showDouble = false;
                    if(work.includes(referee.id)) referee.showWorkLoad = false;
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
        }
    });
});

