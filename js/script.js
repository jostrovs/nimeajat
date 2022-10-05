let JOS_LOCAL_DATA = false;

moment.locale('fi');

$(document).ready(function () {
    initialSettings();

    $(window).resize(resizeWindow);
    resizeWindow();

    var app = new Vue({
        el: '#app',
        data: {
            refresher: false,

            fixture_only: false,
            
            show_days_ahead: 60,
            nimeamattomat_lkm: 0,
            tuplabuukkaukset_lkm: 0,
            alertShown: false,
            datestring: "2022-08-31",
            //date: new Date("2016-12-31"),
            matches: [],

            torneomatches: [],
            seriesData: {},

            show_all_series: true,
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

            dontLoadCookies: false,

            competitionSkip: [],
            categorySkip: [],
            groupSkip: [],
            teamSkip: [],

            kirjautuminen: {
                message: TOKEN ? 'Ladataan tietoja...' : 'Ei tunnistetta',
            },

            showCSV: false,
            encuri: encodeURI("data:text/csv;charset=utf-8,asd,dfg,wer,sdfg\r\nsdf,dfg,xcv,wer\r\n"),

            estematriisi_show: false,
        },
        
        created: async function () {
            var self = this;
            $("#loader").show();

            this.loadSkips();
   
            this.loadTimestamp();

            $("#loader").text("Ladataan tuomareita...");
            this.loadReferees(function(){
                $("#loader").text("Ladataan otteluita...");
                self.loadMatches(function(){
                    $("#loader").text("Ladataan sarjoja...");
                    self.loadSeries(function(){
                        self.loader_count=0;
                        self.loader(-1);
                    });
                });

            });
            
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

                let matches_without_referee =this.matches_of_displayed_categories;

                if(this.fixture_only){
                    matches_without_referee = matches_without_referee.filter((m) => m.status == 'Fixture');
                }

                matches_without_referee = matches_without_referee.filter((m)=>m.isDisplayed())
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

            loadTimestamp: function(){
                var self = this;
                var url = "https://www.lentopalloerotuomarit.fi/ottelulista/MIRROR.php?filename=timestamp.txt&timestamp=" + timestamp(); 
                $.get(url, function(data_){
                    let data = data_;
                    bus.emit("PAIVITA_TIMESTAMP", data_);
                });
            },

            loadReferees: function(callback){
                var self = this;
                self.refereeMap = new Map();

                var url = "https://lentopallo.torneopal.fi/taso/rest/getReferees?api_key=qfzy3wsw9cqu25kq5zre&timestamp=" + timestamp(); 
                //url = "/ajax/referees.json";
                url = "https://www.lentopalloerotuomarit.fi/list/autoreferees.php?timestamp=" + timestamp();
                if(JOS_LOCAL_DATA) url = "/data/autoreferees.json"; // JOS_LOCAL_DATA

                $.get(url, function(data_){
                    let data = data_;
                    if(!JOS_LOCAL_DATA) data = JSON.parse(data_);
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

                    callback();
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

            isSkipGroup: function(competition_id, category_id, group_id){
                for(let skipLine of this.groupSkip){
                    let arr = skipLine.split(".");
                    if(arr[0] === competition_id && arr[1] === category_id && arr[2] == group_id){
                        return true;
                    } 
                }

                return false;
            },

            loadMatches: function(callback){
                var self = this;

                let url = "https://www.lentopalloerotuomarit.fi/ottelulista/MIRROR.php?filename=ottelut.json&t=" + timestamp(); 
                if(JOS_LOCAL_DATA) url = "/data/ottelut.json"; // JOS_LOCAL_DATA 
                $.get(url, function(data){
                    if(!JOS_LOCAL_DATA) data = JSON.parse(data);
                    self.torneomatches = data.matches;
                    callback();
                });
            },

            loadSeries: function(callback){
                var self = this;

                let url = "https://www.lentopalloerotuomarit.fi/ottelulista/MIRROR.php?filename=series.json&t=" + timestamp(); 
                if(JOS_LOCAL_DATA) url = "/data/series.json"; // JOS_LOCAL_DATA 
                $.get(url, function(data){
                    if(!JOS_LOCAL_DATA) data = JSON.parse(data);
                    self.seriesData = data;
                    self.loadCompetitions();
                    callback();
                });
            },

            loadCompetitions: function(){
                var self = this;
                
                for(let torneoCompetition of self.seriesData.competitions){
                    if(torneoCompetition.season_id != "2022-23") continue;

                    let competition = new Competition(torneoCompetition);
                    competition.categories = [];

                    if(self.isSkipCompetition(torneoCompetition.competition_id)){
                        competition.displayed = false;
                    } 
                    self.loadCategories(competition);
                    self.competitions.push(competition);
                }
            },

            loadCategories: function(competition){
                var self = this;
                
                competition.loaded = true;

                let categories = self.seriesData.categories.filter(c => c.competition_id == competition.id);

                for(let torneoCategory of categories){
                    let category = new Category(torneoCategory);

                    if(torneoCategory.category_id == 'TESTI') continue;

                    if(self.isSkipCategory(competition.id, category.id)){
                        category.displayed = false;
                    } 
                    self.loadGroups(competition, category);
                    competition.categories.push(category);
                }
            },

            loadGroups: function(competition, category, pushPosition=-1){
                var self = this;

                let categoryn_tunniste = competition.id + "." + category.id;
                if(COMMON_SKIP.indexOf(categoryn_tunniste) >= 0){
                    // Skipataan yhteisistä, esim. menneet junnutasot.
                    console.log("COMMON_SKIP: " + categoryn_tunniste);
                    return;
                }

                if(!category || !category.torneoCategory || !category.torneoCategory.category_id){
                    console.log("Tyhjä category");
                    return;
                }

                category.groups = [];

                let groups = self.seriesData.groups.filter(g => g.competition_id == competition.id && g.category_id == category.id);

                for(let torneoGroup of groups){
                    let group = new Group(torneoGroup);

                    let lohkon_tunniste = competition.id + "." + category.id + "." + group.id;

                    let matches = self.torneomatches.filter(m => m.competition_id == competition.id && 
                                                             m.category_id == category.id &&
                                                             m.group_id == group.id);

                    group.matches = [];
                    for(let torneoMatch of matches){
                        let match = new Match(torneoMatch, competition, category, group);
                        if(match.datetime < new Date(2030,1,1,0,0,0,0)){
                            self.matches.push(match);
                            group.matches.push(match);
                        }
                    }
                    group.fillTeams();

                    if(self.isSkipGroup(competition.id, category.id, group.id)){
                        group.displayed = false;
                    } 
                    category.groups.push(group);
                }

                category.loaded = true;
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
                    toastr.info("Kaikki tiedot ladattu.")
                }
            },

            clearCookies: function(){
                Lockr.set(PREFIX + "ShowDaysAhead", 60);
                Lockr.set(PREFIX + "ShowAllSeries", true);
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
                Lockr.set(PREFIX + "ShowAllSeries", json.ShowAllSeries);
                Lockr.set(PREFIX + "Competitions", json.Competitions);
                Lockr.set(PREFIX + "Categories", json.Categories);
                Lockr.set(PREFIX + "Groups", json.Groups);
                Lockr.set(PREFIX + "Teams", json.Teams);
                Lockr.set(PREFIX + "Referees", json.Referees);
                Lockr.set(PREFIX + "RefereeDoubles", json.RefereeDoubles);
                Lockr.set(PREFIX + "RefereeWorkload", json.RefereeWorkload);

                this.loadCookies();
            },

            saveCookies: function(noserver){
                // Show days ahead
                Lockr.set(PREFIX + "ShowDaysAhead", this.show_days_ahead);
                Lockr.set(PREFIX + "ShowAllSeries", this.show_all_series);

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

                if(TOKEN){
                    // Jos talletustoken on annettu, niin talletetaan asetukset myös palvelimelle
                    if(noserver == "NO SERVER") return; // Jos latauksen jälkeen on pyydetty
                                                        // cookieSavea, niin ei talleteta silloin enää palvelimelle asti

                    var settingsObject = {
                        showdaysahead: this.show_days_ahead,
                        competitions: comp,
                        categories: cat,
                        groups: gro,
                        teams: tea,
                        referees: list,
                        doubles: double,
                        workload: workload,
                    };

                    saveSettingsObject(settingsObject,
                        function(){
                            // Success!
                            toastr.info("Asetukset talletettu onnistuneesti palvelimelle.")
                            //alert("Asetukset talletettu.");
                        },
                        function(status){
                            // Failure
                            toastr.error("Asetusten talletus ei onnistunut. Status: " + status);
                        });

                }

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

            applySettingsObject: function(settingsObject){
                let self=this;

                if(settingsObject.competitions.length < 1) competitions = ["vb2022a"];

                this.show_days_ahead = settingsObject.showdaysahead;

                let tarvitaan_uudelleenlatausta = false;

                for(let competition of this.competitions){
                    // Käsitellään kilpailujen ruksit
                    for(let compItem of settingsObject.competitions){
                        if(competition.id === compItem) competition.displayed = false;
                    }

                    if(competition.displayed && !competition.loaded) tarvitaan_uudelleenlatausta = true;

                    //console.log(competition.id);

                    for(let category of competition.categories){
                        // Käsitellään sarjojen ruksit
                        //console.log("C    " + category.id);
                        
                        for(let catItem of settingsObject.categories){
                            let arr = catItem.split(".");
                            if(competition.id === arr[0] && category.id === arr[1]) category.displayed = false;
                        }
                        
                        for(let group of category.groups){
                            // Käsitellään lohkojen ruksit
                            //console.log("C        " + group.id);
                            for(let groItem of settingsObject.groups){
                                let arr = groItem.split(".");
                                if(competition.id === arr[0] && category.id === arr[1] && group.id === arr[2]) group.displayed = false;
                            }
                            

                            for(let team of group.teams){
                                // Käsitellään joukkueiden ruksit
                                //console.log("C            " + team.id + " - " + team.name);
                                for(let teaItem of settingsObject.teams){
                                let arr = teaItem.split(".");
                                    if(competition.id === arr[0] && category.id === arr[1] && group.id === arr[2] && team.id === arr[3]) team.displayed = false;
                                }
                            }
                        }

                        if(category.displayed && !category.loaded) tarvitaan_uudelleenlatausta = true;

                    }
                }

    
                for(let referee of this.referees){
                    if(settingsObject.referees.includes(referee.id)) referee.displayed = false;
                    if(settingsObject.doubles.includes(referee.id)) referee.showDouble = false;
                    if(settingsObject.workload.includes(referee.id)) referee.showWorkLoad = false;
                }
              
                window.SELECTED_REFEREE_IDS = this.referees.filter(r=>r.displayed).map(r=>r.id);
                
                if(tarvitaan_uudelleenlatausta){
                    toastr.info("Sarja-asetukset ovat muuttuneet. Sivu täytyy ladata uudestaan.");
                    setTimeout(function(){
                        location.reload();
                    }, 2000);

                }

            },

            loadCookies: function(){
                let self=this;

                console.log("Load cookies");

                if(TOKEN){
                    // Talletustoken on annettu; ladataan asetukset palvelimelta

                    loadSettingsObject(function(json){
                        if(!json){
                            toastr.error("Palvelimelle talletettuja tietoja ei löytynyt.\r\nKatso lisää tietoja 'Kirjautuminen'-välilehdeltä");

                            self.kirjautuminen.message = "Tunniste OK, mutta palvelimelle talletettuja tietoja ei löytynyt";

                            //alert("Palvelimelle talletettuja tietoja ei löytynyt.");
                            var settings =  self.loadSettingsFromLocal();
                            return;
                        }
                        
                        if(GLOBAL_SETTINGS_OBJECT != undefined && GLOBAL_SETTINGS_OBJECT.status){
                            toastr.error("Tuntematon tunniste: " + TOKEN);
                            self.kirjautuminen.message = GLOBAL_SETTINGS_OBJECT.status;
                        }

                        var allSettings = JSON.parse(json);

                        var key = "P" + PREFIX;
                        var settingsObj = allSettings[key];

                        if(!settingsObj){
                            // Tämän prefixin asetuksia ei ole tiedostossa.
                            self.loadSettingsFromLocal();
                            return;
                        }

                        self.show_all_series = settingsObj.show_all_series;
                        self.competitionSkip = settingsObj.competitions;
                        self.categorySkip = settingsObj.categories;
                        self.groupSkip = settingsObj.groups;
                        self.teamSkip = settingsObj.teams;
    
                        self.applySettingsObject(settingsObj);
                        toastr.info("Asetukset ladattu palvelimelta.");

                        self.saveCookies("NO SERVER");
                    })
                } else {
                    // Talletustokenia ei ole; käytetään local storagen asetuksia
                    self.loadSettingsFromLocal();
                }

            },

            loadSettingsFromLocal: function(){
                let self=this;
                self.competitionSkip = Lockr.getArr(PREFIX + "Competitions");
                self.categorySkip = Lockr.getArr(PREFIX + "Categories");
                self.groupSkip = Lockr.getArr(PREFIX + "Groups");
                self.teamSkip = Lockr.getArr(PREFIX + "Teams");

                var settingsObj = {
                    showdaysahead: Lockr.get(PREFIX + "ShowDaysAhead", "60"),
                    
                    competitions: Lockr.getArr(PREFIX + "Competitions"),
                    categories: Lockr.getArr(PREFIX + "Categories"),
                    groups: Lockr.getArr(PREFIX + "Groups"),
                    teams: Lockr.getArr(PREFIX + "Teams"),

                    referees: Lockr.getArr(PREFIX + "Referees"),
                    doubles: Lockr.getArr(PREFIX + "RefereeDoubles"),
                    workload: Lockr.getArr(PREFIX + "RefereeWorkload"),
                }

                self.applySettingsObject(settingsObj);
                return settingsObj;
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
                            //console.log("VIERAS TUOMARI:" + match.referees.join(", ") + "    " + match.torneoMatch.team_A_name + "-" + match.torneoMatch.team_B_name);
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

            refresh_all: function(){
                if(!confirm("Ladataanko kaikki tiedot uudestaan palvelimelta?\r\nHuom! älä tee tätä turhaan, sillä kysely on raskas.")){
                    return;
                }
    
                this.refresher = true;
                $.get("https://www.lentopalloerotuomarit.fi/ottelulista/refresh.php?t=" + timestamp(), function(data_){
                    location.reload();
                });
            }            
        }
    });
});

