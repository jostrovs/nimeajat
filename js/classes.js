moment.locale('fi');

class Match{
    constructor(torneoMatch, competition, category, group){
        this.number = torneoMatch.match_number;
        this.id = torneoMatch.match_id;
        this.torneoMatch = torneoMatch;
        this.displayed = true;
        this.hasTime = true;
        this.played = torneoMatch.status == 'Played';
        this.status = torneoMatch.status;

        this.referees = [];
        this.href="https://lentopallo.api.torneopal.com/taso/ottelu.php?otteluid=" + this.id;
        this.torneo_edit_href="https://lentopallo-extranet.torneopal.fi/taso/ottelu.php?otteluid=" + this.id;

        this.fill_date();
        this.fill_referees();

        this.competition = competition;
        
        this.category = category;
        this.category_href="https://lentopallo.api.torneopal.com/taso/sarja.php?turnaus=" + competition.id + "&sarja=" + category.id;
        
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

        this.toCSV = function(){
            let refe = "";
            for(let r of this.referees){
                if(refe.length > 0) refe += "; ";
                refe += r;
            }

            let puuttuu = "";
            if(this.referee_status != '') puuttuu = "Puuttuu: " + this.referee_status;

            return this.weekday + "," + 
                   omadate(this.datetime) + ",klo," +
                   this.toTimeString() + "," + 
                   this.torneoMatch.category_id + "," + 
                   this.group.id + "," + 
                   this.torneoMatch.match_number + "," + 
                   this.getVenue() + "," + 
                   this.torneoMatch.team_A_name + "-" + this.torneoMatch.team_B_name + "," + 
                   refe + "," + 
                   puuttuu;

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
               omadate(this.datetime) + "   " + 
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

        this.datelocal = omadate(date_a);
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

        //debugger;

        let mo = moment(this.torneoMatch.date);
        let we = mo.week();
        this.week = we;
    }

    hasReferees(){
        return this.referees.length > 0;
    }

    n2_vt(match){
        if(match.competition_id != 'vb2023a') return false;
        if(match.category_id != 'N2') return false;
        if(match.group_name.length < 10) return false;
        var prefix1 = match.group_name.substring(0, 7);
        var prefix2 = "Pudotuspelit".substring(0,7);
        return prefix1 == prefix2;
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
        else if(this.n2_vt(m)){ // Naisten 2-sarjan 2-tuomarin pelit
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

    nimettava(){
        return this.status != "Played" && this.status != "Planned";
    }

    pelaamatta(){
        return this.status != "Played" && this.status != "Planned";
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
        this.loaded = false;
        if(DEVELOPMENT) this.development=true;
    }

    pelaamatta(){
        let ret = 0;
        this.groups.map(g=>{
            ret += g.pelaamatta();
        });
        return ret;
    }
    nimettavia(){
        let ret = 0;
        this.groups.map(g=>{
            ret += g.nimettavia();
        });
        return ret;
    }
    total(){
        let ret = 0;
        this.groups.map(g=>{
            ret += g.total();
        });
        return ret;
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

    pelaamatta(){
        let ret = 0;
        this.categories.map(c=>{
            ret += c.pelaamatta();
        });
        return ret;
    }
    nimettavia(){
        let ret = 0;
        this.categories.map(c=>{
            ret += c.nimettavia();
        });
        return ret;
    }
    total(){
        let ret = 0;
        this.categories.map(c=>{
            ret += c.total();
        });
        return ret;
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

    pelaamatta(){
        let ret = 0;
        this.matches.map(m=>{
            if(m.pelaamatta()) ret++;
        });
        return ret;
    }

    nimettavia(){
        let ret = 0;
        this.matches.map(m=>{
            if(m.nimettava()) ret++;
        });
        return ret;
    }

    total(){
        let ret = 0;
        this.matches.map(m=>{
            ret++;
        });
        return ret;
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
          this.name = pois_umlaut(torneoReferee.last_name + " " + torneoReferee.first_name);
          this.gsm = torneoReferee.gsm;
          this.PostiNo = torneoReferee.posti;
          this.Kunta = pois_umlaut(torneoReferee.kunta);
          this.Email = torneoReferee.email;
          this.Luokka = torneoReferee.lk;
          this.torneoReferee = torneoReferee;
          this.displayed = true;
          this.showWorkLoad = true;
          this.showDouble = true;
          this.href="https://lentopallo.api.torneopal.com/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id; 

          if(this.Luokka == "I-luokka") this.Luokka = "I";
          if(this.Luokka == "II-luokka") this.Luokka = "II";
          if(this.Luokka == "III-luokka") this.Luokka = "III";
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