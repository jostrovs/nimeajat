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

moment('fi');
let dayNames = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"];
let temp_referees= [];

let myReferees = [
    {
        id: 1242,
        name: "Häll Jukka",
        puh: "0400-750064",
        luokka: "I",
        email: "jukka.hall@kolumbus.fi"
    },
    {
        id: 1985,
        name: "Hätinen Juha",
        puh: "040-7750269",
        luokka: "I",
        email: "juha.hatinen@iki.fi"
    },
    {
        id: 1270,
        name: "Korpilahti Antti",
        puh: "050-5467260",
        luokka: "I",
        email: "antti.korpilahti@gmail.com"
    },
    {
        id: 1641,
        name: "Näveri Martti",
        puh: "0500-217402",
        luokka: "I",
        email: "martti.naveri@elisanet.fi"
    },
    {
        id: 1579,
        name: "Ostrovskij Jori",
        puh: "040-7636283",
        luokka: "I",
        email: "jostrovs@gmail.com"
    },
    {
        id: 1263,
        name: "Rönnqvist Sini",
        puh: "050-4390763",
        luokka: "I",
        email: "sini.ronnqvist@gmail.com"
    },
    {
        id: 1321,
        name: "Rönnqvist Suvi",
        puh: "050-4390764",
        luokka: "I",
        email: "suvi.ronnqvist@gmail.com"
    },
    {
        id: 1193,
        name: "Tenhola Helena",
        puh: "040-7551678",
        luokka: "I",
        email: "helena.tenhola@tieto.com"
    },
    {
        id: 1188,
        name: "Tiitto Mika",
        puh: "0440-326225",
        luokka: "I",
        email: "mika.tiitto@gmail.com",
        last_of_class: true,
    },
    {
        id: 1171,
        name: "Harju Kari",
        puh: "050-5941319",
        luokka: "II",
        email: "kharju18@welho.com"
    },
    {
        id: 2080,
        name: "Hassinen Jukka",
        puh: "045-3106166",
        luokka: "II",
        email: "jthassinen@gmail.com"
    },
    {
        id: 1375,
        name: "Hyttinen Pasi",
        puh: "050-3311091",
        luokka: "II",
        email: "pasiilpohyttinen@gmail.com"
    },
    {
    id: 2412,
    name: "Isomaa Jarmo",
    puh: "040-8661362",
    luokka: "II",
    email: "isomaa@gmail.com"
    },                {
        id: 1998,
        name: "Jääskeläinen Kari",
        puh: "050-5883610",
        luokka: "II",
        email: "kjaaskelainen10@gmail.com"
    },
    {
        id: 1331,
        name: "Kantanen Mikko",
        puh: "040-7169421",
        luokka: "II",
        email: "mikko.kantanen@vtt.fi"
    },
    {
        id: 1284,
        name: "Kenttälä Kauko",
        puh: "040-8316139",
        luokka: "II",
        email: "kauko.kenttala@pp.inet.fi"
    },
    {
        id: 1560,
        name: "Keronen Pavel",
        puh: "040-7416001",
        luokka: "II",
        email: "pavel.keronen@edu.hel.fi"
    },
    {
        id: 1600,
        name: "Lehtineva Antti",
        puh: "040-7088027",
        luokka: "II",
        email: "anttilehtineva@hotmail.com"
    },
    // {
    //     id: 2223,
    //     name: "Lankinen Ville",
    //     puh: "050-3200783",
    //     luokka: "II",
    //     email: "villelankinen@luukku.com"
    // },
    // {
    //     id: 1652,
    //     name: "Pinaeva Yana",
    //     puh: "046-8116733",
    //     luokka: "II",
    //     email: "yanaalisa@yandex.ru"
    // },
    {
        id: 1367,
        name: "Rouhiainen Paavo",
        puh: "040-7304984",
        luokka: "II",
        email: "Paavo.Rouhiainen@nls.fi",
        last_of_class: true,
    },
    // {
    //     id: 1574,
    //     name: "Sinerma Sakari",
    //     puh: "040-7498116",
    //     luokka: "II",
    //     email: "sakari.sinerma@espoo.fi"
    // },
    {
        id: 2112,
        name: "Andersson Erkki",
        puh: "0400-016252",
        luokka: "III",
        email: "erkki.andersson@gmail.com"
    },
    // {
    //     id: 1993,
    //     name: "Djatsenko Andrei",
    //     puh: "045-8939550",
    //     luokka: "III",
    //     email: "talo5@rambler.ru"
    // },
    {
        id: 1198,
        name: "Honkanen Väinö",
        puh: "0500-697479",
        luokka: "III",
        email: "vaino.honkanen@kolumbus.fi"
    },
    {
        id: 2192,
        name: "Hyttinen Anna",
        puh: "045-2467791",
        luokka: "III",
        email: "annasofiahyttinen@gmail.com"
    },
    //{id: 2083, name: "Jalkanen Tuukka", luokka: "III", email:"tuukka.jalkanen85@gmail.com"},
    {
        id: 1169,
        name: "Kalliokunnas Kauko",
        puh: "050-3256061",
        luokka: "III",
        email: "kalliokunnas@gmail.com"
    },
    {
        id: 2090,
        name: "Keski-Nikkola Ilona",
        puh: "044-2907030",
        luokka: "III",
        email: "ilona.keski-nikkola@hotmail.com"
    },
    {
        id: 2202,
        name: "Lind Elina",
        puh: "0440-407772",
        luokka: "NT",
        email: "elina.lind@saunalahti.fi"
    },
    {
        id: 1961,
        name: "Lindberg Risto",
        puh: "050-331 7747",
        luokka: "III",
        email: "limpulle@gmail.com"
    },
    // {
    //     id: 1603,
    //     name: "Metsäkoivu Tuuli",
    //     puh: "040-7267096",
    //     luokka: "III",
    //     email: "tuuli.metsakoivu@gmail.com"
    // },
    {
        id: 1220,
        name: "Mononen Timo",
        puh: "040-5152802",
        luokka: "III",
        email: "monosen.timppa@gmail.com"
    },
    {
        id: 1360,
        name: "Muje Tero",
        puh: "040-8621609",
        luokka: "III",
        email: "tero.muje@cinia.fi"
    },
    {
        id: 2300,
        name: "Niemi Jarmo",
        puh: "040-5039668",
        luokka: "III",
        email: "jarmo.niemi@iki.fi"
    },
    // {
    //     id: 1386,
    //     name: "Oikarinen Harri",
    //     puh: "0400-602484",
    //     luokka: "III",
    //     email: "harri.oikarinen@atea.fi"
    // },
    {
        id: 1226,
        name: "Ojala Teuvo",
        puh: "050-4409772",
        luokka: "III",
        email: ""
    },
    {
        id: 1257,
        name: "Parjanen Olli",
        puh: "050-5697080",
        luokka: "III",
        email: "arol.parja@pp.inet.fi"
    },
    // {
    //     id: 1624,
    //     name: "Pekkala Eero",
    //     puh: "0400-404340",
    //     luokka: "III",
    //     email: "ebromail@gmail.com"
    // },
    {
        id: 1649,
        name: "Perkinen Elina",
        puh: "0500-673631",
        luokka: "III",
        email: "nurminen.elinamaarit@hotmail.com"
    },
    {
        id: 2143,
        name: "Perkinen Teppo",
        puh: "040-7299005",
        luokka: "III",
        email: "perkinen@hotmail.com"
    },
    // {
    //     id: 1371,
    //     name: "Rannikko Altti",
    //     puh: "041-4519823",
    //     luokka: "III",
    //     email: "alttirannikko@hotmail.com"
    // },
    {
        id: 2434,
        name: "Pussinen Susanna",
        puh: "050-3079028",
        luokka: "III",
        email: "susu.pussinen@gmail.com"
    },
    {
        id: 1965,
        name: "Ruuska Noora",
        puh: "040-1860881",
        luokka: "III",
        email: "ruuska.noora@gmail.com"
    },
    // {
    //     id: 1584,
    //     name: "Rönnqvist Timo",
    //     puh: "040-5935429",
    //     luokka: "III",
    //     email: "timo.ronnqvist@vantaa.fi"
    // },
    {
        id: 1771,
        name: "Snellman Joni",
        puh: "044-5133610",
        luokka: "III",
        email: "joni.leander.s@gmail.com"
    },
    {
        id: 1239,
        name: "Torkkeli Heikki",
        puh: "040-5500128",
        luokka: "III",
        email: "heikki.torkkeli@wippies.fi"
    },
    // {
    //     id: 1545,
    //     name: "Väänänen Joona",
    //     puh: "050-5738975",
    //     luokka: "III",
    //     email: "joona.vaananen@hotmail.com"
    // }
];
let id=1;
let start_date, end_date;

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
    let startDate = "2018-08-01";

    for(let referee of myReferees){
        var url = `https://lentopallo.torneopal.fi/taso/rest/getMatches?referee_id=${referee.id}&start_date=${startDate}&api_key=qfzy3wsw9cqu25kq5zre`; 
        referee.matches = [];
        referee.href=url;

        load_count++;
        $.get(url, function(data){
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
    loadReferees();
});
function initVue(){
    var app = new Vue({
        el: '#app',
        data: {
            referees: temp_referees,
            start_date: start_date,
            end_date: end_date,
            date: moment().format("YYYY-MM-DD"),
        },
        
        created: function () {
            if(localStorage.matriisiDate) this.date = moment(localStorage.matriisiDate).format("YYYY-MM-DD");

            bus.on("SET_DATE", this.setDate);
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
                    dayName: "Tuomari",
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
            }
        },
        methods: {
            setDate(newDate){
                [this.start_date, this.end_date] = dateRange(moment(newDate));
                localStorage.matriisiDate = newDate;
                this.date = newDate;
            },
            
            delta(days){
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

