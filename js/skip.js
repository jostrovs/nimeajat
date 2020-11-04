const SKIP_COMPETITION = ["SARJAPOHJA", "aluetesti", "beach2016", "masku2016", "power2016",

  // Junnuja:
 "vb2016n",
 "vb2016v",
 

 ];

const SKIP_CATEGORY = ["TESTI"];//["TB", "PB", "PC", "PD", "PE", "PF", "PD6", "PDAlku", "PDT", "PDalku", "PET", "TD-AM", "TDT", "TE", "TE-Tiikeri", "TPE", "TPF", "TD", "TET", "TPD", "TPD", "TF", "testi", "TESTI", "Testi"];

const SKIP_CATEGORIES = [];
const SKIP_CATEGORIES2 = [
     { competition_id: "vb2016epohj",
       skip_list: ["NH"] // Ei näemmä nimetä tuomareita
     },
 ];

const COMMON_SKIP = [
    // Aikuisten kategorioita
    
    // A-pojat taso
    "vb2020n.PA.1", "vb2020n.PA.2", "vb2020n.PA.3", "vb2020n.PA.4", "vb2020n.PA.5",  

    // A-tytöt taso
    "vb2020n.TA.1", "vb2020n.TA.2", "vb2020n.TA.3", "vb2020n.TA.4", "vb2020n.TA.5", "vb2020n.TA.6", "vb2020n.TA.7", "vb2020n.TA.8", "vb2020n.TA.9",  

    // C-pojat taso
    "vb2020n.PC.1", "vb2020n.PC.2", "vb2020n.PC.3", "vb2020n.PC.4", "vb2020n.PC.5", "vb2020n.PC.6", "vb2020n.PC.7", "vb2020n.PC.8", "vb2020n.PC.9", 
    "vb2020n.PC.10", "vb2020n.PC.11", "vb2020n.PC.12", "vb2020n.PC.13", "vb2020n.PC.14", "vb2020n.PC.15", "vb2020n.PC.16", "vb2020n.PC.17", "vb2020n.PC.18", "vb2020n.PC.20", // 1-pooli


    // C-tytöt taso
    "vb2020n.TC.1", "vb2020n.TC.2", "vb2020n.TC.3", "vb2020n.TC.4", "vb2020n.TC.5", "vb2020n.TC.6", "vb2020n.TC.7", "vb2020n.TC.8", "vb2020n.TC.9", "vb2020n.TC.10", 
    "vb2020n.TC.11", "vb2020n.TC.12", "vb2020n.TC.13", "vb2020n.TC.14", "vb2020n.TC.15", "vb2020n.TC.16", "vb2020n.TC.17", "vb2020n.TC.18", "vb2020n.TC.19", "vb2020n.TC.20", 
    "vb2020n.TC.21", "vb2020n.TC.22", "vb2020n.TC.23", "vb2020n.TC.24", "vb2020n.TC.25", "vb2020n.TC.26", "vb2020n.TC.27", "vb2020n.TC.28", "vb2020n.TC.29", "vb2020n.TC.30", 

    "vb2020n.TC.31","vb2020n.TC.32", "vb2020n.TC.33", "vb2020n.TC.34", "vb2020n.TC.35", "vb2020n.TC.36", "vb2020n.TC.37", "vb2020n.TC.38", "vb2020n.TC.39", "vb2020n.TC.40",  
    "vb2020n.TC.41","vb2020n.TC.42", "vb2020n.TC.43", "vb2020n.TC.44", "vb2020n.TC.45", "vb2020n.TC.46", "vb2020n.TC.47", "vb2020n.TC.48", "vb2020n.TC.49", "vb2020n.TC.50",  
    "vb2020n.TC.51","vb2020n.TC.52", "vb2020n.TC.53", "vb2020n.TC.54", "vb2020n.TC.55", "vb2020n.TC.56", "vb2020n.TC.57", "vb2020n.TC.58", "vb2020n.TC.59", "vb2020n.TC.60",  

    // B-pojat taso
    "vb2020n.PB.1", "vb2020n.PB.2", "vb2020n.PB.3", "vb2020n.PB.4", "vb2020n.PB.5", "vb2020n.PB.6",  
    //"vb2020n.PB.7", "vb2020n.PB.8", "vb2020n.PB.9", "vb2020n.PB.10", "vb2020n.PB.11", "vb2020n.PB.12", // 1-pooli

    // B-tytöt taso
    "vb2020n.TB.1", "vb2020n.TB.2", "vb2020n.TB.3", "vb2020n.TB.4", "vb2020n.TB.5", "vb2020n.TB.6", "vb2020n.TB.7", "vb2020n.TB.8", "vb2020n.TB.9", "vb2020n.TB.10", 
    "vb2020n.TB.11", "vb2020n.TB.12", "vb2020n.TB.13", "vb2020n.TB.14", "vb2020n.TB.15", "vb2020n.TB.16", "vb2020n.TB.17", "vb2020n.TB.18", "vb2020n.TB.19", "vb2020n.TB.20", 

    "vb2020n.TB.21", "vb2020n.TB.22", "vb2020n.TB.23", "vb2020n.TB.24", "vb2020n.TB.25", "vb2020n.TB.26", "vb2020n.TB.27", "vb2020n.TB.28", "vb2020n.TB.29", "vb2020n.TB.30", 
    "vb2020n.TB.31", "vb2020n.TB.32", "vb2020n.TB.33", "vb2020n.TB.34", "vb2020n.TB.35", "vb2020n.TB.36", "vb2020n.TB.37", "vb2020n.TB.38", "vb2020n.TB.39", "vb2020n.TB.41",  
    "vb2020n.TB.42", // 1-pooli

    
];
