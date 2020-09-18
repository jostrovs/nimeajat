let paikka = "helsinki";

var queryPaikka = getQueryString()['paikka'];
if(queryPaikka) paikka = queryPaikka;

let referees_helsinki = [
    {
        id: 1674,
        name: "Haavisto Jere",
        luokka: "I",
    },
    {
        id: 1242,
        name: "Häll Jukka",
        luokka: "I",
    },
    {
        id: 1985,
        name: "Hätinen Juha",
        luokka: "I",
    },
    {
        id: 1270,
        name: "Korpilahti Antti",
        luokka: "I",
    },
    {
        id: 1579,
        name: "Ostrovskij Jori",
        luokka: "I",
    },
    // {
    //     id: 1263,
    //     name: "Rönnqvist Sini",
    //     luokka: "I",
    // },
    {
        id: 1321,
        name: "Rönnqvist Suvi",
        luokka: "I",
    },
    {
        id: 1193,
        name: "Tenhola Helena",
        luokka: "I",
    },
    {
        id: 1188,
        name: "Tiitto Mika",
        luokka: "I",
        last_of_class: true,
    },
    {
        id: 1171,
        name: "Harju Kari",
        luokka: "II",
    },
    {
        id: 2080,
        name: "Hassinen Jukka",
        luokka: "II",
    },
    {
        id: 1375,
        name: "Hyttinen Pasi",
        luokka: "II",
    },
    {
    id: 2412,
    name: "Isomaa Jarmo",
    luokka: "II",
    },                {
        id: 1998,
        name: "Jääskeläinen Kari",
        luokka: "II",
    },
    {
        id: 1331,
        name: "Kantanen Mikko",
        luokka: "II",
    },
    {
        id: 1284,
        name: "Kenttälä Kauko",
        luokka: "II",
    },
    {
        id: 1560,
        name: "Keronen Pavel",
        luokka: "II",
    },
    {
        id: 1600,
        name: "Lehtineva Antti",
        luokka: "II",
    },
    {
        id: 2680,
        name: "Ovaska Kari",
        luokka: "II",
    },
    {
        id: 1649,
        name: "Perkinen Elina",
        luokka: "II",
    },
    // {
    //     id: 2143,
    //     name: "Perkinen Teppo",
    //     luokka: "II",
    // },
    {
        id: 1367,
        name: "Rouhiainen Paavo",
        luokka: "II",
    },
    {
        id: 1771,
        name: "Snellman Joni",
        luokka: "II",
        last_of_class: true,
    },
    {
        id: 2562,
        name: "Heikola Tiina",
        luokka: "III",
    },
    {
        id: 2694,
        name: "Hurttala Alina",
        luokka: "III",
    },
    {
        id: 2688,
        name: "Hurttala Tiina",
        luokka: "III",
    },
    {
        id: 2689,
        name: "Jantunen Mika",
        luokka: "III"
      },
    {
        id: 1169,
        name: "Kalliokunnas Kauko",
        luokka: "III",
    },
    {
        id: 2090,
        name: "Keski-Nikkola Ilona",
        luokka: "III",
    },
    {
        id: 2697,
        name: "Kivioja Joona",
        luokka: "III",
    },
    {
        id: 2701,
        name: "Kokkonen Sauli",
        luokka: "III",
    },
    // {
    //     id: 2202,
    //     name: "Lind Elina",
    //     luokka: "NT",
    // },
    {
        id: 1220,
        name: "Mononen Timo",
        luokka: "III",
    },
    {
        id: 1360,
        name: "Muje Tero",
        luokka: "III",
    },
    {
        id: 2300,
        name: "Niemi Jarmo",
        luokka: "III",
    },
    {
        id: 1641,
        name: "Näveri Martti",
        luokka: "III",
    },
    {
        id: 1226,
        name: "Ojala Teuvo",
        luokka: "III",
    },
    {
        id: 2575,
        name: "Ostrovskij Aino",
        luokka: "III",
    },
    {
        id: 1257,
        name: "Parjanen Olli",
        luokka: "III",
    },
    {
        id: 2816,
        name: "Puhakka Pasi",
        luokka: "III",
    },
    {
        id: 2434,
        name: "Pussinen Susanna",
        luokka: "III",
    },
    // {
    //     id: 1624,
    //     name: "Pekkala Eero",
    //     luokka: "III",
    // },
    {
        id: 1371,
        name: "Rannikko Altti",
        luokka: "III",
    },
    {
        id: 2564,
        name: "Taajamo Jali",
        luokka: "III",
    },
    {
        id: 1239,
        name: "Torkkeli Heikki",
        luokka: "III",
    },
    // {
    //     id: 2590,
    //     name: "Vainio Samuel",
    //     luokka: "III",
    // },
    {
        id: 2601,
        name: "Vauhkonen Miro",
        luokka: "III",
    },
    {
        id: 2691,
        name: "Välimäki Ada",
        luokka: "III",
    },
    {
        id: 2692,
        name: "Välimäki Pasi",
        luokka: "III",
    },
];

let referees_liiga = [
    {
        "id": "1202",
        "name": "Aro Kenneth",
        "luokka": "Liiga"
    },
    {
        "id": "1218",
        "name": "Caven Mira",
        "luokka": "Liiga"
    },
    {
        "id": "1617",
        "name": "Försti Tuomo",
        "luokka": "Liiga"
    },
    {
        "id": "1554",
        "name": "Hakala Raine",
        "luokka": "Liiga"
    },
    {
        "id": "1288",
        "name": "Hakkarainen Pasi",
        "luokka": "Liiga"
    },
    {
        "id": "1567",
        "name": "Hassinen Ville",
        "luokka": "Liiga"
    },
    {
        "id": "1207",
        "name": "Hautala Ari",
        "luokka": "Liiga"
    },
    {
        "id": "1187",
        "name": "Isotalo Tommi",
        "luokka": "Liiga"
    },
    {
        "id": "1243",
        "name": "Jokelainen Ari",
        "luokka": "Liiga"
    },
    {
        "id": "1209",
        "name": "Juotasniemi Tomi",
        "luokka": "Liiga"
    },
    {
        "id": "1987",
        "name": "Järvinen Tomi",
        "luokka": "Liiga"
    },
    {
        "id": "1383",
        "name": "Kiimalainen Heikki",
        "luokka": "Liiga"
    },
    {
        "id": "1358",
        "name": "Laiti Mihkal",
        "luokka": "Liiga"
    },
    {
        "id": "1234",
        "name": "Lehtonen Jouni",
        "luokka": "Liiga"
    },
    {
        "id": "1295",
        "name": "Mäkinen Timo",
        "luokka": "Liiga"
    },
    {
        "id": "1368",
        "name": "Mäntylä Janne",
        "luokka": "Liiga"
    },
    {
        "id": "2401",
        "name": "Mönkkönen Viivi",
        "luokka": "Liiga"
    },
    {
        "id": "1324",
        "name": "Natunen Ilmo",
        "luokka": "Liiga"
    },
    {
        "id": "1272",
        "name": "Oravainen Marko",
        "luokka": "Liiga"
    },
    {
        "id": "1579",
        "name": "Ostrovskij Jori",
        "luokka": "Liiga"
    },
    {
        "id": "1359",
        "name": "Parkkinen Tommi",
        "luokka": "Liiga"
    },
    {
        "id": "1215",
        "name": "Peteri Kaisa",
        "luokka": "Liiga"
    },
    {
        "id": "1189",
        "name": "Puskala Pauli",
        "luokka": "Liiga"
    },
    {
        "id": "2247",
        "name": "Salmela Veli",
        "luokka": "Liiga"
    },
        {
        "id": "2206",
        "name": "Savinainen Juha",
        "luokka": "Liiga"
    },
    {
        "id": "1281",
        "name": "Sipola Juha",
        "luokka": "Liiga"
    },
    {
        "id": "1201",
        "name": "Virta Esa",
        "luokka": "Liiga"
    },
    {
        "id": "1267",
        "name": "Yli-Kivistö Keijo",
        "luokka": "Liiga",
    },
    {
        "id": "1175",
        "name": "Ylinen Arttu",
        "luokka": "Liiga",
        last_of_class: true,
    },
    {
        "id": "1219",
        "name": "Ikonen Pekka",
        "luokka": "PS"
    },
    {
        "id": "1270",
        "name": "Korpilahti Antti",
        "luokka": "PS"
    },
    {
        "id": "1251",
        "name": "Kuusisto Jarmo",
        "luokka": "PS"
    },
    {
        "id": "1318",
        "name": "Laukkanen Jouni",
        "luokka": "PS"
    },
    {
        "id": "2191",
        "name": "Lumme Juhani",
        "luokka": "PS"
    },
    {
        "id": "1214",
        "name": "Mannersuo Sari",
        "luokka": "PS"
    },
    {
        "id": "2220",
        "name": "Ojala Miikka",
        "luokka": "PS"
    },
    {
        "id": "1352",
        "name": "Puskala Juha",
        "luokka": "PS"
    },
    {
        "id": "1607",
        "name": "Rantala Markku",
        "luokka": "PS"
    },
    {
        "id": "1372",
        "name": "Sairomaa Tomi",
        "luokka": "PS"
    },
    {
        "id": "1377",
        "name": "Sundell Jori",
        "luokka": "PS"
    },
    {
        "id": "1310",
        "name": "Suomi Harri",
        "luokka": "PS"
    },
    {
        "id": "1630",
        "name": "Uusi-Pohjola Heikki",
        "luokka": "PS"
    },
    {
        "id": "1176",
        "name": "Välimäki Pasi",
        "luokka": "PS"
    },
    {
        "id": "1556",
        "name": "Ylisiurua Markku",
        "luokka": "PS",
        last_of_class: true,
    },
    // {
    //     "id": "1556",
    //     "name": "Hassinen Jaakko",
    //     "luokka": "I",
    //     last_of_class: true,
    // }
];





let myReferees = [];

switch(paikka){
    case 'liiga':
        myReferees = referees_liiga;
        break;
    default:
        myReferees = referees_helsinki;
        break;
}

