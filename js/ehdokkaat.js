var USE_CACHE = false;

var cachedGet = function(url, callback){
    let key = sha512(url);
    let data = localStorage[key];
    if(USE_CACHE && data){
        console.log("Data haettu cachesta: " + key);
        callback(JSON.parse(data));
    } else {
        $.get(url, function(d){
            data = d;
            if(USE_CACHE){
                localStorage[key] = JSON.stringify(data);
                console.log("Talletettu cacheen: " + key);
            }
            callback(data);
        })
    }
};



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

moment.locale('fi');
let dayNames = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"];
let temp_referees= [];


let id=1;
let start_date, end_date;

let esteet = [];

let zebra=true;
for(let i=0;i<myReferees.length;++i){
    myReferees[i].matches=[];
    myReferees[i].zebra = zebra;
    zebra = !zebra;
} 

// Ladataan tuomarit ja pelit
let load_count=0;
function loadReferees(){
    temp_referees = []; 

    var self = this;

    [start_date, end_date] = dateRange(moment());
    let startDate = "2019-08-01";

    for(let referee of myReferees){
        var url = `https://lentopallo.torneopal.fi/taso/rest/getMatches?referee_id=${referee.id}&start_date=${startDate}&api_key=qfzy3wsw9cqu25kq5zre`; 
        referee.matches = [];
        referee.href=url;

        let referee_esteet = getRefereeEsteet(referee.id);

        for(let ref_este of referee_esteet){
            referee.matches.push({
                este: true,
                moment: moment(ref_este.Pvm),
                text: ref_este.Este,
            });
        }

        load_count++;
        cachedGet(url, function(data){
            for(let match of data.matches){
                referee.matches.push({
                    id: match.match_id,
                    number: match.match_number,
                    moment: moment(match.date),
                    time: match.time,
                    category_id: match.category_id,
                    group_name: match.group_name,
                    koti: match.team_A_name,
                    vieras: match.team_B_name,
                    paikka: match.venue_name,
                    kaupunki: match.venue_city_name,
                });
            }
            setTimeout(()=>{load_count--},1);
        });
        temp_referees.push(referee);
    }
    waitForLoader();
};

let tiedot_haettu = "";

function loadEsteet(){
    cachedGet("./ajax/esteet.txt", function(data_txt){
        let data = JSON.parse(data_txt);
        esteet = data.kaikki_esteet;
        
        tiedot_haettu = data.tiedot_haettu;

        loadReferees();
    });
};

function getRefereeEsteet(id){
    return esteet.filter(it=>it.referee_id == id);
};

function waitForLoader(){
    if(load_count < 1){
        initVue();
        return;
    } 
    setTimeout(this.waitForLoader, 300);
};

function dateRange(date){
    moment.locale('fi');
    let m = moment(date);
    let w = m.week();
    let start = moment(date).subtract(7, 'days').locale('fi');
    let end = moment(date).add(7, 'days').locale('fi');

    let startWeek = start.startOf('week');

    let endWeek = end.endOf('week');

    return [start, end];
};

$(document).ready(function () {
    loadEsteet();
});
function initVue(){
    var app = new Vue({
        el: '#app',
        data: {
            referees: temp_referees,
            start_date: start_date,
            end_date: end_date,
            date: moment().format("YYYY-MM-DD"),
            tiedot_haettu: tiedot_haettu,
            tiedot_haettu_title: "Estetiedot päivitetty: " + tiedot_haettu,
            ero: {
                paivat: 0,
                tunnit: 0,
                minuutit: 0,
                sekunnit: 0
            },
            interval: 1000,
        },
        
        created: function () {
            if(localStorage.matriisiDate) this.date = moment(localStorage.matriisiDate).format("YYYY-MM-DD");

            bus.on("SET_DATE", this.setDate);

            this.laskePaivitys();
        },

        mounted(){
            if(USE_CACHE) $("#cache-in-use").css("display", "inline-block");
        },

        watch: {
            date: function(val){
                this.setDate(val);
            }
        },

        computed: {
            columns: function(){
                let ret = [{
                    tuomari: true,
                    dayName: "",
                    dayNo: 0,
                    endOfWeek: false,
                }];
                let m = moment(this.start_date);
                while(m.isBefore(moment(this.end_date))){
                    ret.push({
                        tuomari: false,
                        moment: moment(m),
                        dayName: dayNames[moment(m).day()],
                        dayNo: moment(m).date(),
                        endOfWeek: moment(m).day() ==0,
                        today: moment(m).isSame(moment(this.date)),
                    });
                    m.add(1, 'days');
                }
                return ret;
            },

            eroTeksti(){
                let ero = this.ero;
                if(ero.sekunnit < 60) return `${ero.sekunnit} sekuntia`;
                this.interval = 60000;
                if(ero.minuutit < 60) return `${ero.minuutit} minuuttia`;
                if(ero.tunnit < 24) return `${ero.tunnit} tuntia`;
                return `${ero.paivat} päivää`;
            }
        },
        methods: {
            laskePaivitys(){
                let self=this;

                let now = moment();
                let haettu = moment(this.tiedot_haettu);
        
                let diffDays = now.diff(haettu, 'days');
                let diffHours = now.diff(haettu, 'hours');
                let diffMinutes = now.diff(haettu, 'minutes');
                let diffSeconds = now.diff(haettu, 'seconds');
        
                this.ero.paivat = diffDays;
                this.ero.tunnit = diffHours;
                this.ero.minuutit = diffMinutes;
                this.ero.sekunnit = diffSeconds;
                
                setTimeout(function(){
                    self.laskePaivitys();
                }, self.interval);
            },
            
            setDate(newDate){
                //console.log("In set date");

                [this.start_date, this.end_date] = dateRange(moment(newDate));
                localStorage.matriisiDate = newDate;
                this.date = newDate;
            },
            
            delta(days){
                //console.log("In delta");

                let date = moment(this.date);
                date.add(days, 'days');
                this.date = date.format('YYYY-MM-DD');
            },

            getCells(referee){
                //console.log("Ladataan " + referee.name);
                let ret = [];
                for(let col of this.columns){
                    let c = {
                        key: id++,
                        tuomari: false,
                        dayName: col.dayName,
                        dayNo: col.dayNo,
                        endOfWeek: col.endOfWeek,
                        moment: col.moment,
                        today: col.today,
                        zebra: referee.zebra,
                    };
                    if(col.tuomari){
                        c.tuomari = true;
                        ret.push(c);
                        continue;
                    }
                    c.text = "-";
                    c.match = false;
                    for(let match of referee.matches){
                        if(match.moment.isSame(col.moment)){
                            c.text = "lkjkl";
                            c.match = match;
                            //console.log("Asetan tuomarin: " + referee.name + "  " + c.moment.format("DD.MM."));
                        }
                    }
                    ret.push(c);
                }
                return ret;
            },

            resize: function(){}

        }
    });
};

