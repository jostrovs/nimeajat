var PREFIX = "JUNIORS_TUOMARILISTA_";

const SKIP_COMPETITION = ["SARJAPOHJA", "aluetesti", "beach2016", "masku2016", "power2016",

  // Masters:
 "vb2016v",

 // Liitto
 "vb2016a",

 ];

const SKIP_CATEGORY = ["testi", "TESTI", "Testi", 
                       "MJatko", "M4", "M5", "N3", "MKars", "MNousu", "NKars", "NNousu",
                       "M4-PRIIMA", "KSN4", "KSM4", "KSN3",
                       "MTreKS MC", "MTreKS MA", "MTreKS MB", "NLSms V-S", "NTreKS NA", "NTreKS NB",
                       "MPK", "HN", ];

const SKIP_CATEGORIES = [
     { competition_id: "vb2016epohj",
       skip_list: ["NH"] // Ei näemmä nimetä tuomareita
     },
     { competition_id: "vb2016esavo",
       skip_list: ["MES", "NES"] // Ei näemmä nimetä tuomareita
     },
     { competition_id: "vb2016lsuomi",
       skip_list: ["MKaKS"]
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

