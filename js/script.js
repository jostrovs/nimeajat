var initialSettings = function(){
    // Jos ei mitään suodatuksia ole asetettu, näytetään oletuksena vain liiton sarjat ja pari liigatuomaria
    let comp = Lockr.getArr(PREFIX + "Competitions");
    if(comp.length < 1){
        comp = ["SARJAPOHJA", "vb2016epohj", "vb2016esavo", "vb2016esuomi", "vb2016isuomi", "vb2016ksuomi", "vb2016lappi", "vb2016lsuomi", "vb2016pkarjala", "vb2016ppohj", "vb2016psavo"];
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
        this.groups=[];
        this.development=false;
        this.isNew=true;
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
            loader_count: 0,
            cookies: { vie: {}, tuo: ""},
            dontLoadCookies: false,

            competitionSkip: [],
            categorySkip: [],
            groupSkip: [],
        },
        
        created: function () {
            var self = this;
            $("#loader").show();

            this.loadSkips();

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

            all_matches: function(){
                let ret = this.matches_of_displayed_categories;

                return ret;
            }
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

            loadCompetitions: function(){
                var self = this;

                //console.log("getCompetitions: https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre");
                $.get("https://lentopallo.torneopal.fi/taso/rest/getCompetitions?api_key=qfzy3wsw9cqu25kq5zre", function(data){
                    for(let torneoCompetition of data.competitions){
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
                $.get(url, function(data){
                    if(data.call.status === "error") return;
                    //console.log(data);
                    for(let torneoCategory of data.categories){
                        
                        if(self.isSkipCategory(torneoCompetition.competition_id, torneoCategory.category_id)) continue;

                        // Lohkot & ottelut
                        //console.log("    getCategory: " + torneoCategory.category_id + "&competition_id=" + torneoCategory.competition_id);
                        let url2 = "https://lentopallo.torneopal.fi/taso/rest/getCategory?api_key=qfzy3wsw9cqu25kq5zre&category_id=" + torneoCategory.category_id + "&competition_id=" + torneoCategory.competition_id + "&matches=1";
                        //console.log(url2);
                        self.loader(1);
                        $.get(url2, function(data){
                            if(data.call.status === "error"){
                                self.loader(-1);
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
                            self.loader(-1);
                        });
                    }
                });
            },

            loader: function(delta){
                this.loader_count = this.loader_count + delta;
                //console.log("LOADER: " + this.loader_count);
                $("#loader").text("Ladataan tietoja, sarjoja jäljellä " + this.loader_count + "...");

                if(this.loader_count < 1){
                    if(!this.dontLoadCookies) this.loadCookies();
                    this.checkDoubleBooking();
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

            loadSkips: function(){
                const PREFIX = "TUOMARILISTA_";

                let json = {};

                this.competitionSkip = Lockr.getArr(PREFIX + "Competitions");
                this.categorySkip = Lockr.getArr(PREFIX + "Categories");
                this.groupSkip = Lockr.getArr(PREFIX + "Groups");
            },

            loadCookies: function(){
                const PREFIX = "TUOMARILISTA_";

                let json = {};

                this.show_days_ahead = json.ShowDaysAhead = Lockr.get(PREFIX + "ShowDaysAhead", "60");

                let comp = json.Competitions = Lockr.getArr(PREFIX + "Competitions");
                let cat = json.Categories = Lockr.getArr(PREFIX + "Categories");
                let gro = json.Groups = Lockr.getArr(PREFIX + "Groups");
                let tea = json.Teams = Lockr.getArr(PREFIX + "Teams");

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

                let disp = json.Referees = Lockr.getArr(PREFIX + "Referees");
                let doub = json.RefereeDoubles = Lockr.getArr(PREFIX + "RefereeDoubles");
                let work = json.RefereeWorkload = Lockr.getArr(PREFIX + "RefereeWorkload");
    
                for(let referee of this.referees){
                    if(disp.includes(referee.id)) referee.displayed = false;
                    if(doub.includes(referee.id)) referee.showDouble = false;
                    if(work.includes(referee.id)) referee.showWorkLoad = false;
                }

                this.cookies.vie = json;
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

