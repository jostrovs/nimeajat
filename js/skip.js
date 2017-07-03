const SKIP_COMPETITION = ["SARJAPOHJA", "aluetesti", "beach2016", "masku2016", "power2016",

  // Junnuja:
 "vb2016n",
 "vb2016v",


 ];

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


