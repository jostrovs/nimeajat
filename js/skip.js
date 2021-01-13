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
    "vb2020n.PA.6", "vb2020n.PA.7", "vb2020n.PA.8", "vb2020n.PA.9", "vb2020n.PA.10",  
    //"vb2020n.PA.11", 
    "vb2020n.PA.12", // "vb2020n.PA.13", "vb2020n.PA.14", "vb2020n.PA.15",  

    // A-tytöt taso
    "vb2020n.TA.1", "vb2020n.TA.2", "vb2020n.TA.3", "vb2020n.TA.4", "vb2020n.TA.5", "vb2020n.TA.6", "vb2020n.TA.7", "vb2020n.TA.8", "vb2020n.TA.9",  
    "vb2020n.TA.10", "vb2020n.TA.11", "vb2020n.TA.12", "vb2020n.TA.13", "vb2020n.TA.14", "vb2020n.TA.15", "vb2020n.TA.16", "vb2020n.TA.17", "vb2020n.TA.18",  


    // C-pojat taso
    "vb2020n.PC.1", "vb2020n.PC.2", "vb2020n.PC.3", "vb2020n.PC.4", "vb2020n.PC.5", "vb2020n.PC.6", "vb2020n.PC.7", "vb2020n.PC.8", "vb2020n.PC.9", 
    "vb2020n.PC.10", "vb2020n.PC.11", "vb2020n.PC.12", "vb2020n.PC.13", "vb2020n.PC.14", "vb2020n.PC.15", "vb2020n.PC.16", "vb2020n.PC.17", "vb2020n.PC.18", "vb2020n.PC.20", // 1-pooli
    "vb2020n.PC.21", "vb2020n.PC.22", "vb2020n.PC.23", "vb2020n.PC.24", "vb2020n.PC.25", "vb2020n.PC.26", "vb2020n.PC.27", "vb2020n.PC.28", "vb2020n.PC.29",  // 2-pooli


    // C-tytöt taso
    "vb2020n.TC.1", "vb2020n.TC.2", "vb2020n.TC.3", "vb2020n.TC.4", "vb2020n.TC.5", "vb2020n.TC.6", "vb2020n.TC.7", "vb2020n.TC.8", "vb2020n.TC.9", "vb2020n.TC.10", 
    "vb2020n.TC.11", "vb2020n.TC.12", "vb2020n.TC.13", "vb2020n.TC.14", "vb2020n.TC.15", "vb2020n.TC.16", "vb2020n.TC.17", "vb2020n.TC.18", "vb2020n.TC.19", "vb2020n.TC.20", 
    "vb2020n.TC.21", "vb2020n.TC.22", "vb2020n.TC.23", "vb2020n.TC.24", "vb2020n.TC.25", "vb2020n.TC.26", "vb2020n.TC.27", "vb2020n.TC.28", "vb2020n.TC.29", "vb2020n.TC.30", 

    "vb2020n.TC.31","vb2020n.TC.32", "vb2020n.TC.33", "vb2020n.TC.34", "vb2020n.TC.35", "vb2020n.TC.36", "vb2020n.TC.37", "vb2020n.TC.38", "vb2020n.TC.39", "vb2020n.TC.40",  // 1-pooli
    "vb2020n.TC.41","vb2020n.TC.42", "vb2020n.TC.43", "vb2020n.TC.44", "vb2020n.TC.45", "vb2020n.TC.46", "vb2020n.TC.47", "vb2020n.TC.48", "vb2020n.TC.49", "vb2020n.TC.50",  
    "vb2020n.TC.51","vb2020n.TC.52", "vb2020n.TC.53", "vb2020n.TC.54", "vb2020n.TC.55", "vb2020n.TC.56", "vb2020n.TC.57", "vb2020n.TC.58", "vb2020n.TC.59", "vb2020n.TC.60",  

    "vb2020n.TC.61","vb2020n.TC.62", "vb2020n.TC.63", "vb2020n.TC.64", "vb2020n.TC.65", "vb2020n.TC.66", "vb2020n.TC.67", "vb2020n.TC.68", "vb2020n.TC.69", "vb2020n.TC.70",  // 2-pooli
    "vb2020n.TC.71","vb2020n.TC.72", "vb2020n.TC.73", "vb2020n.TC.74", "vb2020n.TC.75", "vb2020n.TC.76", "vb2020n.TC.77", "vb2020n.TC.78", "vb2020n.TC.79", "vb2020n.TC.80",  
    "vb2020n.TC.81","vb2020n.TC.82", "vb2020n.TC.83", "vb2020n.TC.84", "vb2020n.TC.85", "vb2020n.TC.86", "vb2020n.TC.87", "vb2020n.TC.88", "vb2020n.TC.89", "vb2020n.TC.90",  

    // B-pojat taso
    "vb2020n.PB.1", "vb2020n.PB.2", "vb2020n.PB.3", "vb2020n.PB.4", "vb2020n.PB.5", "vb2020n.PB.6",  
    "vb2020n.PB.7", "vb2020n.PB.8", "vb2020n.PB.9", "vb2020n.PB.10", "vb2020n.PB.11", "vb2020n.PB.12", // 1-pooli
    "vb2020n.PB.13", "vb2020n.PB.14", "vb2020n.PB.15", "vb2020n.PB.16", "vb2020n.PB.17", "vb2020n.PB.18", // 2-pooli

    // B-tytöt taso
    "vb2020n.TB.1", "vb2020n.TB.2", "vb2020n.TB.3", "vb2020n.TB.4", "vb2020n.TB.5", "vb2020n.TB.6", "vb2020n.TB.7", "vb2020n.TB.8", "vb2020n.TB.9", "vb2020n.TB.10", 
    "vb2020n.TB.11", "vb2020n.TB.12", "vb2020n.TB.13", "vb2020n.TB.14", "vb2020n.TB.15", "vb2020n.TB.16", "vb2020n.TB.17", "vb2020n.TB.18", "vb2020n.TB.19", "vb2020n.TB.20", 

    "vb2020n.TB.21", "vb2020n.TB.22", "vb2020n.TB.23", "vb2020n.TB.24", "vb2020n.TB.25", "vb2020n.TB.26", "vb2020n.TB.27", "vb2020n.TB.28", "vb2020n.TB.29", "vb2020n.TB.30", 
    "vb2020n.TB.31", "vb2020n.TB.32", "vb2020n.TB.33", "vb2020n.TB.34", "vb2020n.TB.35", "vb2020n.TB.36", "vb2020n.TB.37", "vb2020n.TB.38", "vb2020n.TB.39", "vb2020n.TB.41",  
    "vb2020n.TB.42", // 1-pooli

    "vb2020n.TB.43", "vb2020n.TB.44", "vb2020n.TB.45", "vb2020n.TB.46", "vb2020n.TB.47", "vb2020n.TB.48", "vb2020n.TB.49", "vb2020n.TB.50", "vb2020n.TB.51", "vb2020n.TB.52", 
    "vb2020n.TB.53", "vb2020n.TB.54", "vb2020n.TB.55", "vb2020n.TB.56", "vb2020n.TB.57", "vb2020n.TB.58", "vb2020n.TB.59", "vb2020n.TB.60", "vb2020n.TB.61", "vb2020n.TB.62",  
    "vb2020n.TB.63", // 2-pooli

    
];
