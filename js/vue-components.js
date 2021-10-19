Vue.component('vue-input', {
                template: `
                    <div class="form-group">
                        <label :for="randomId">{{ label }}:</label>
                        <input :id="randomId" :value="value" @input="onInput" class="form-control">
                    </div>
                `,
                props: ['value', 'label'],
                data: function () {
                    return {
                        randomId: this._uid
                    }
                },
                methods: {
                    onInput: function (event) {
                        this.$emit('input', event.target.value)
                    }
                },
});
Vue.component('vue-date-input', {
                template: `
                    <div class="form-group">
                        <label :for="randomId">{{ label }}:</label>
                        <input type="date" :id="randomId" :value="value" @input="onInput" class="form-control">
                    </div>
                `,
                props: ['value', 'label'],
                data: function () {
                    return {
                        randomId: this._uid
                    }
                },
                methods: {
                    onInput: function (event) {
                        this.$emit('input', event.target.value)
                    }
                },
});
Vue.component('vue-input-area', {
                template: `
                    <div class="form-group">
                        <label :for="randomId">{{ label }}:</label>
                        <textarea rows="5" cols="40" :id="randomId" :value="value" @input="onInput" class="form-control"></textarea>
                    </div>
                `,
                props: ['value', 'label'],
                data: function () {
                    return {
                        randomId: this._uid
                    }
                },
                methods: {
                    onInput: function (event) {
                        this.$emit('input', event.target.value)
                    }
                },
});
Vue.component('vue-referees', {
              props: ['referees'],
              template: `
                      <div class="panel panel-default tuomarilista">
                          <div id="tuomarit-panel-heading" class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">Tuomarit: valittu {{selected_referees.length}}/{{referees.length}}</a>
                            </h4>
                          </div>
                          <div id="tuomaritCollapse" class="panel-collapse collapse in">
                              <div id="tuomarit-panel-buttons">
                                  <button class="myButton" id="kaikki"  @click="select_all_referees()">Valitse kaikki</button>
                                  <button class="myButton" id="ei_mitaan" @click="select_no_referees()">Tyhjennä valinnat</button>
                              </div>

                              <div id="tuomarit-vain-valitut" style="margin-top: 3px;">
                                  <span class="checkbox-label" style="margin-bottom: 3px;"><input type="checkbox" v-model="selectedOnly"> Näytä vain valitut tuomarit</span>
                              </div>

                              <div id="tuomarit-luokat" style="margin-top: 6px">
                                <template v-for="luokka in classes">
                                    <span class="checkbox-label"><input type="checkbox" v-model="luokka.displayed"> {{luokka.Luokka}}</span>
                                </template>
                              </div>
 
                              <div id="tuomarit-lista" style="margin-top: 10px; overflow-y: scroll;">
                                <table style="margin-top: 5px;"> 
                                  <tr>
                                      <th>&nbsp;</td>
                                      <th><a @click="setSort('id')">Id</a></th>
                                      <th><a @click="setSort('nimi')">Nimi</a></th>
                                      <th><a @click="setSort('luokka')">Luokka</a></th>
                                      <th><a @click="setSort('posti')">Posti</a></th>
                                      <th><a @click="setSort('kunta')">Kunta</a></th>
                                      <!--th>Tuplat</td-->
                                      <th>Määrät</td>
                                  </tr>
                                  <tr v-for="referee in sorted_referees" v-if="isDisplayed(referee)">
                                      <td><input type="checkbox" v-model="referee.displayed"></td>
                                      <td>{{referee.id}}</td>
                                      <td><a :href="referee.href + '&alkupvm=2021-09-01&print=1&piilota=tarkkailija&jarjestys=pvm,klo'" target="blank">{{referee.name}}</a></td>
                                      <td>{{referee.Luokka}}</td>
                                      <td>{{referee.PostiNo}}</td>
                                      <td>{{referee.Kunta}}</td>
                                      <!--td><input type="checkbox" v-model="referee.showDouble"></td-->
                                      <td><input type="checkbox" v-model="referee.showWorkLoad"></td>
                                  </tr>
                            
                            
                              </div>
                            <!--div class="panel-footer">Panel Footer</div-->
                          </div>
              
              `,
              data: function() {
                  return {
                      classes: [{Luokka: 'Liiga', displayed: true},
                                {Luokka: 'PS', displayed: true},
                                {Luokka: 'I', displayed: true},
                                {Luokka: 'II', displayed: true},
                                {Luokka: 'III', displayed: true},
                                {Luokka: 'O', displayed: true},
                                {Luokka: 'NT', displayed: true},
                                {Luokka: 'Ei', displayed: true},
                      ],
                      displayedClasses: ["Liiga", "PS", "I", "II", "III", "O", "NT"],
                      selectedOnly: true,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString(),
                      sortField: '',
                      sortOrderAsc: true,
                  }
              },
              methods:{
                  isDisplayed: function(referee){
                      if(this.displayedClasses.includes(referee.Luokka)==false) return false;
                      return !this.selectedOnly || (this.selectedOnly && referee.displayed); 
                  },
                  
                  setSort: function(field){
                      if(field == this.sortField){
                          this.sortOrderAsc = !this.sortOrderAsc;
                          this.sortField = ""; 
                          this.sortField = field; 
                      } 
                      else {
                          this.sortField = field;
                          this.sortOrderAsc = true;
                      }
                  },
                  select_all_referees: function(){
                      for(let referee of this.referees){
                          referee.displayed = true;
                      }
                  },
                  select_no_referees: function(){
                      for(let referee of this.referees){
                          referee.displayed = false;
                      }
                  }
              },
              computed: {
                  sorted_referees: function(){
                      //console.log("sorted_referees");
                      var self = this;
                      this.displayedClasses = [];
                      for(let clas of self.classes){
                          if(clas.displayed) this.displayedClasses.push(clas.Luokka);
                      }

                      let ret = this.referees.filter((r)=> this.displayedClasses.includes(r.Luokka));


                      switch(this.sortField.toLowerCase()){
                          case 'nimi': 
                              return this.referees.sort(function(a,b){
                                  let ret = a.name.localeCompare(b.name);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          case 'luokka': 
                              return this.referees.sort(function(a,b){
                                  let ret = a.Luokka.localeCompare(b.Luokka);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          case 'kunta': 
                              return this.referees.sort(function(a,b){
                                  let ret = a.Kunta.localeCompare(b.Kunta);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          case 'posti': 
                              return this.referees.sort(function(a,b){
                                  let ret = parseInt(a.PostiNo,10) - parseInt(b.PostiNo, 10);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          default: 
                              return this.referees.sort(function(a,b){
                                  let ret = a.id - b.id;
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                      }
                  },

                  selected_referees: function(){
                      let ret = this.referees.filter((m)=>m.displayed);
                      return ret;
                  }
              },  
});
Vue.component('vue-competitions', {
              props: ['competitions', 'show_all'],
              template: `
                      <div class="panel panel-default sarjalista">
                          <div id="sarjat-panel-heading" class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">Sarjat ja lohkot:</a>
                            </h4>
                          </div>
                          <div id="sarjatCollapse" class="panel-collapse collapse in" style="overflow-y: scroll;">
                              <ul>
                                    <li v-for="competition in showed_competitions(competitions)">
                                        <input type="checkbox" v-model="competition.displayed">
                                        {{competition.name}}  {{(competition.id)}}
                                        <span v-if="competition.development && competition.isFinished()">LOPPU comp: {{competition.id}}</span>
                                        <span class="id">({{competition.id}})</span>
                                        <span class="info"> {{pelaamattaCompe(competition)}}</span>
                                        <span class="nimettavia"> {{nimettaviaCompe(competition)}}</span>

                                        <button class="myButton" v-if="!competition.loaded && competition.displayed" @click="loadCategoriesOnParent(competition)">Lataa</button>

                                        <ul>

                                            <li v-for="category in showed_categories(competition.categories)" v-if="competition.displayed">
                                                <input type="checkbox" v-model="category.displayed">
                                                <span class="id">({{competition.id}}.{{category.id}})</span>
                                                <span class="info"> {{pelaamattaCategory(category)}}</span>
                                                <span class="nimettavia"> {{nimettaviaCategory(category)}}</span>

                                                {{category.name}}  {{(category.id)}}

                                                <button class="myButton" v-if="!category.loaded && category.displayed" @click="loadGroupsOnParent(competition, category)">Lataa</button>

                                                <span v-if="competition.development" style="background: #fcc;">   comp: {{competition.id}}  cat: {{category.id}}</span>
                                                <ul>
                                                    <li v-for="group in showed_groups(category.groups)" v-if="category.displayed" :id="group_element_id(category.id, group.id)">
                                                        <input type="checkbox" v-model="group.displayed"> {{group.name}}
                                                        <span class="id">({{competition.id}}.{{category.id}}.{{group.id}})</span>
                                                        <span class="info"> {{pelaamattaLohko(group)}}</span>
                                                        <span class="nimettavia"> {{nimettaviaLohko(group)}}</span>
                                                        <ul>
                                                            <li v-for="team in group.teams" v-if="group.displayed">
                                                                <input type="checkbox" v-model="team.displayed"> {{team.name}}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <!--div class="panel-footer">Panel Footer</div-->
                                <div onclick="$('.id').css('display','inline-block')">id</div>
                                <div onclick="$('.info').css('display','inline-block')">pelaamatta</div>
                                <div onclick="$('.nimettavia').css('display','inline-block')">nimettavia</div>
                          </div>
              
              `,
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
              mounted: function(){
                  let self=this; 
                  bus.on("ETSI_SARJALISTALTA_2", function(ids){
                      let id = self.group_element_id(ids.category_id, ids.group_id);

                      let dom_ele = document.getElementById(id);
                      dom_ele.scrollIntoView();

                      let element = $("#" + id);
                      vilkuta_elementtia(element);
                  });  
              },
              methods: {
                  showed_competitions(competitions){
                      if(this.show_all) return competitions;
                      let ret = [];
                      competitions.map(c => {
                          if(c.pelaamatta() > 0 || c.nimettavia() > 0) ret.push(c);
                      });  
                      return ret;
                  },

                  showed_categories(categories){
                      if(this.show_all) return categories;
                      let ret = [];
                      categories.map(c => {
                          if(c.pelaamatta() > 0 || c.nimettavia() > 0) ret.push(c);
                      });  
                      return ret;
                  },

                  showed_groups(groups){
                      if(this.show_all) return groups;
                      let ret = [];
                      groups.map(c => {
                        if(c.pelaamatta() > 0 || c.nimettavia() > 0) ret.push(c);
                      });  
                      return ret;
                  },
                
                  pelaamattaLohko(lohko){
                      let p = lohko.pelaamatta();
                      let t = lohko.total();
                      if(t == 0 && p == 0) return "";
                      return p.toString() + "/" + t;
                  },
                  nimettaviaLohko(lohko){
                      let p = lohko.nimettavia();
                      let t = lohko.total();
                      if(t == 0 && p == 0) return "";
                      return p.toString() + "/" + t;
                  },
                
                  pelaamattaCategory(kate){
                      let p = kate.pelaamatta();
                      let t = kate.total();
                      if(t == 0 && p == 0) return "";
                      return p.toString() + "/" + t;
                  },
                  nimettaviaCategory(kate){
                      let p = kate.nimettavia();
                      let t = kate.total();
                      if(t == 0 && p == 0) return "";
                      return p.toString() + "/" + t;
                  },
                
                  pelaamattaCompe(kompe){
                      let p = kompe.pelaamatta();
                      let t = kompe.total();
                      if(t == 0 && p == 0) return "";
                      return p.toString() + "/" + t;
                  },
                  nimettaviaCompe(kompe){
                      let p = kompe.nimettavia();
                      let t = kompe.total();
                      if(t == 0 && p == 0) return "";
                      return p.toString() + "/" + t;
                  },
                
                  alert: function(mgg){
                      alert(mgg);
                  },
                  
                  loadCategoriesOnParent: function(competition){
                      competition.displayed = true;
                      this.$emit('load_categories_from_child', competition.id)
                  },

                  loadGroupsOnParent: function(competition, category){
                      category.displayed = true;
                      this.$emit('load_groups_from_child', competition.id, category.id)
                  },

                  group_element_id: function(category_id, group_id){
                      return "group_" + category_id + "_" + group_id;
                  }
              },
});
Vue.component('vue-estematriisi', {
    template: `
    <div v-if="show" style="background: #eee; max-width: 600px;">
        <div class="panel-heading">
        <a :href="getSrc()" target=_>Tuomareiden esteet päivälle {{pvm}}</a>
        <button class="btn btn-default" style="padding: 2px 8px 2px 8px; color: red; float: right; margin-right: -5px;" @click="hidePopup()">X</button>
        </div>
        <div class="panel-body" style="width: 600px; ">    
            <iframe id="estematriisiIframe" style="z-index: 300; width: 100%; height: 600px;" frameborder=0></iframe>
        </div>
    </div>
    `,
    data: function() {
        return {
            pvm: "PVM",
            show: false,
        }
    },    
    created: function(){
        let self=this;

        bus.on("ESTEMATRIISI_SHOW", function(pvm){
            self.show_estematriisi(pvm);
        })
    },
    methods: {
        show_estematriisi: function(pvm){
            this.pvm = pvm;
            this.show = true;

            let src = this.getSrc();

            setTimeout(function(){
                console.log("Avataan, url: " + src);
                document.getElementById('estematriisiIframe').src = src;
            }, 100);
        },
        hidePopup: function(){
            this.show = false;
        },
        getSrc: function(){
            let id_string = window.SELECTED_REFEREE_IDS.map(r=>r.toString()).join(","); 
            let src = `https://www.lentopalloerotuomarit.fi/esteet/?pvm=${this.pvm}&ids=${id_string}`;
            return src;
        }
    }
});
Vue.component('vue-matches', {
              props: ['initial_matches', 'show_days_ahead', 'nimeamattomat_lkm', 'referee_ids'],
              computed: {
                  matches_before: function(){
                      let dt = moment();
                      let yesterday = moment();
                      dt.add(this.show_days_ahead, 'days');
                      yesterday.add(-1, 'days');
                      let ret = this.initial_matches.filter((m)=>moment(m.datetime) <= dt);
                      ret = ret.filter((m)=>moment(m.datetime) >= yesterday);
                      ret = ret.filter((m)=>m.status != 'Played');
                      
                      this.displayed_matches_count = ret.filter((m)=> m.isDisplayed()).length;
                      this.$emit('input', this.displayed_matches_count);

                      return ret;
                  }
              },
              template: `
                    <div>
                        <h3>Nimeämättömiä otteluita yhteensä {{displayed_matches_count}}</h3>
                        <vue-estematriisi :referee_ids="referee_ids"></vue-estematriisi>
                        <vue-match v-for="match in matches_before" :match="match"></vue-match>
                    </div>
              `,
              methods: {
                  get_initial_date: function(){
                  }

              },
              data: function() {
                  
                  return {
                      displayed_matches_count: 0,
                      matches: this.initial_matches,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
});
Vue.component('vue-all-matches', {
    props: ['initial_matches', 'show_days_ahead'],
    computed: {
        matches_before: function(){
            let dt = moment();
            let yesterday = moment();
            dt.add(this.show_days_ahead, 'days');
            yesterday.add(-7, 'days');
            let ret = this.initial_matches.filter((m)=>{return moment(m.datetime) <= dt});
            ret = ret.filter((m)=>moment(m.datetime) >= yesterday);
            
            return ret.sort((m1, m2)=>m1.datetime-m2.datetime);
        }
    },
    template: `
        <div>
            <div v-for="match in matches_before" :class="{played: match.played}">
                <vue-week-separator v-if="match.weekSeparator" :week="match.week"></vue-week-separator>
                <div class='match' v-if="match.isDisplayed()" style="margin: 0px; padding: 2px;">
                <div class="box" style="width:170px;"> 
                    <span class="ajankohta-label">
                        <div class="ib" style="width: 20px;">{{match.weekday}}</div>
                        <div class="ib" style="width: 70px; text-align: right;">{{match.datetime.toLocaleDateString()}}</div>
                        klo {{match.toTimeString()}}
                    </span>
                </div>
                <div class="box" style="min-width:60px;"><a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> </div>
                    <div class="box" style="min-width:70px;"><a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> </div>
                    <div class="box" style="min-width:60px;"><a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a></div>
                    <div class="box" style="width:170px;"><span class="pelipaikka-label">{{match.getVenue()}}</span></div>
                    <div class="box" style="width:180px;">
                        {{match.torneoMatch.team_A_name}} -
                        {{match.torneoMatch.team_B_name}}
                    </div>
                    <div class="box">
                        <span v-for="referee in match.referees" class='referee-list-label'>
                            {{referee}}
                        </span>
                        <span v-if="match.referee_status!==''">
                            Puuttuu: 
                            <span v-for="referee in match.referee_status.split(' ')" class='referee-label'>
                                {{referee}}
                            </span>
                        </span>
                    </span>
                </div>                        
            </div>
        </div>
    `,
    methods: {
        get_initial_date: function(){
        }

    },
    data: function() {
        
        return {
            displayed_matches_count: 0,
            matches: this.initial_matches,
            id: this._uid,
            collapseId: this._uid,
            collapseHref: "#" + this._uid.toString()
        }
    },
});
Vue.component('vue-week-separator', {
    props: ['week'],
    template: `
        <div>
            <div style="display: inline-block; color: #aaf; font-size: 10px;">Viikko {{week}}</div>
            <div style="display: inline-block; border: 0.5px solid #ddf; height: 1px; width: 80%; vertical-align: top; margin-top: 9px;"></div>
        </div>
    `,
})

Vue.component('vue-match', {
    props: ['match', 'forceDisplay'],
    template: `
            <div class='match' v-if="forceDisplay || match.isDisplayed()">
                <vue-week-separator v-if="match.weekSeparator" :week="match.week"></vue-week-separator>
                <div class="box" style="min-width:30px;"><a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> </div>
                <div class="box" style="min-width:70px;"><a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> </div>
                <div class="box" style="min-width:60px;"><a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a></div>
                <div class="box" style="width:170px;"> 
                    <span class="ajankohta-label">
                        <div class="ib" style="width: 20px;">{{match.weekday}}</div>
                        <div class="ib" style="width: 70px; text-align: right;">{{match.datetime.toLocaleDateString()}}</div>
                        klo {{match.toTimeString()}}
                    </span>
                </div>
                <div class="box" style="width:170px;"><span class="pelipaikka-label">{{match.getVenue()}}</span></div>
                <div class="box" style="width:180px;">
                {{match.torneoMatch.team_A_name}} -
                {{match.torneoMatch.team_B_name}}
                </div>
                <div class="box">
                <span v-if="match.referee_status!==''">
                    <a :href="match.torneo_edit_href" target=_ title="Avaa ottelu torneopalissa (vaatii kirjautumisen!)"><img src="tp.png"></a>&nbsp;
        
                    <a @click="show_estematriisi()" :title="estematriisititle"><img src="block.png" height=16></a>&nbsp;
        
                    <a @click="etsi_sarjalistalta(match)" title="Etsi tämä lohko Sarjat-välilehdeltä"><img src="Look-icon.png" height=16></a>&nbsp;
        
                    <span v-for="referee in match.referees" class='referee-list-label'>
                        {{referee}}
                    </span>

                    <span v-for="referee in match.referee_status.split(' ')" class='referee-label'>
                        {{referee}}
                    </span>
                </span>
                </span>
            </div>
    `,
    data: function() {
        var pvm = moment(this.match.datetime).format("YYYY-MM-DD");
        return {
            pvm: pvm,
            estematriisititle: "Avaa esteellisyyssivu päivälle " + pvm,
            estematriisilink: "https://www.lentopalloerotuomarit.fi/esteet/?pvm=" + pvm,
            id: this._uid,
            collapseId: this._uid,
            collapseHref: "#" + this._uid.toString()
        }
    },
    methods: {
        show_estematriisi: function(){
            bus.emit("ESTEMATRIISI_SHOW", this.pvm)
        },

        etsi_sarjalistalta: function(match){
            bus.emit("ETSI_SARJALISTALTA_1", { category_id: match.category.id, group_id: match.group.id });
        }
    }
});
Vue.component('vue-double-booking', {
              props: ['double_booking_item'],
              template: `
                  <div class='double-booking' v-if="double_booking_item.referee != null && double_booking_item.referee.displayed">
                      Tuomari: <a :href="double_booking_item.referee.href" target="_blank">{{double_booking_item.referee.name}}</a><br>
                      <vue-match v-for="match in double_booking_item.matches" :match="match" forceDisplay="true"></vue-match>
                  </div>
              `,
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              }
});

Vue.component('vue-tuplat', {
              props: ["duplicates", "tuplabuukkaukset_lkm"],
              template: `
                      <div>
                          <h1>Tuplabuukkaukset <span style="font-size: 18px;" class="referee-label">{{displayed_items_count}}</span></h1>
                          <vue-double-booking v-for="item in duplicates" :double_booking_item="item"></vue-double-booking>
                      </div>
              `,
              computed: {
                  displayed_items_count: function(){
                      let count = this.duplicates.filter((d)=> d.referee!=null && d.referee.displayed).length;
                      this.$emit('input', count);
                      return count;
                  }
              },
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              }
});

Vue.component('vue-esteet', {
    props: ["name", "src"],
    template: `
        <div @click="hidePopup()">
            <div style="z-index: 100; background: grey; opacity: 0.5; position: fixed; top: 0; left: 0px; width: 100%; height: 100%;">
            </div>
            <div class="panel panel-default" style="z-index: 200; position: fixed; top: 100px; left: 100px; width: 80%; height: 80%;">
                <div class="panel-heading">
                    <a :href="src" target=_>Tuomarin {{name}} esteet</a>
                    <button class="btn btn-default" style="padding: 2px 8px 2px 8px; color: red; float: right; margin-right: -5px;" @click="hidePopup()">X</button>
                </div>
                <div class="panel-body" style="width: 100%; height: 700px;">    
                    <iframe id="esteIframe" sandbox style="z-index: 300; width: 100%; height: 660px;" frameborder=0></iframe>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            
        }
    },
    methods: {
        hidePopup: function(event){
            $("#esteet").hide();
        }
    }
});


Vue.component('vue-tehtavat', {
    props: ["initial_matches", "referees", "series"],
    template: `
            <div>
                <h1>Tehtävämäärät</h1>
                <div>
                <template v-for="sarja in local_series">
                    <span class="checkbox-label"><input type="checkbox" v-model="sarja.displayed"> {{sarja.id}}</span>
                </template>
                </div>

                <div style="margin-top: 5px">
                    <button class="myButton" id="saveSarja" @click="save">Talleta valitut sarjat ja näytettävät kuukaudet</button>
                </div>
                <table style="margin-top: 3px;">
                    <tr>
                        <th>Nimi</th>
                        <th>Luokka</th>
                        <th><a :class="{ monthActive: syys_displayed, monthInactive: !syys_displayed}" @click="toggle('syyskuu')">Syyskuu</a></th>
                        <th><a :class="{ monthActive: loka_displayed, monthInactive: !loka_displayed}" @click="toggle('lokakuu')">Lokakuu</a></th>
                        <th><a :class="{ monthActive: marras_displayed, monthInactive: !marras_displayed}" @click="toggle('marraskuu')">Marraskuu</a></th>
                        <th><a :class="{ monthActive: joulu_displayed, monthInactive: !joulu_displayed}" @click="toggle('joulukuu')">Joulukuu</a></th>
                        <th><a :class="{ monthActive: tammi_displayed, monthInactive: !tammi_displayed}" @click="toggle('tammikuu')">Tammikuu</a></th>
                        <th><a :class="{ monthActive: helmi_displayed, monthInactive: !helmi_displayed}" @click="toggle('helmikuu')">Helmikuu</a></th>
                        <th><a :class="{ monthActive: maalis_displayed, monthInactive: !maalis_displayed}" @click="toggle('maaliskuu')">Maaliskuu</a></th>
                        <th><a :class="{ monthActive: huhti_displayed, monthInactive: !huhti_displayed}" @click="toggle('huhtikuu')">Huhtikuu</a></th>
                    </tr>
                    <tr v-for="referee in referees">
                        <td>
                            <img @click="showEste(referee)" src="block.png" height=16 title="Näytä tuomarin esteet" style="cursor: pointer">
                            <a @click="showRefereeWindow(referee)" title="Näytä tuomarin ottelulista" style="cursor: pointer">{{referee.name}}</a>
                        </td>
                        <td>{{referee.Luokka}}</td>
                        <td class="workload-month">
                            <vue-workload-month v-if="syys_displayed" :matches="getMatches(referee.id, 'syyskuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month v-if="loka_displayed" :matches="getMatches(referee.id, 'lokakuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month v-if="marras_displayed" :matches="getMatches(referee.id, 'marraskuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month  v-if="joulu_displayed" :matches="getMatches(referee.id, 'joulukuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month  v-if="tammi_displayed" :matches="getMatches(referee.id, 'tammikuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month  v-if="helmi_displayed" :matches="getMatches(referee.id, 'helmikuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month  v-if="maalis_displayed" :matches="getMatches(referee.id, 'maaliskuu')"></vue-workload-month>
                        </td>
                        <td class="workload-month">
                            <vue-workload-month  v-if="huhti_displayed" :matches="getMatches(referee.id, 'huhtikuu')"></vue-workload-month>
                        </td>
                    </tr>
                </table>
                <vue-esteet id="esteet" style="display: none" :name="referee_name" :src="src"></vue-esteet>
                <vue-referee-window id="referee-window" style="display: none" :name="referee_name" :src="src"></vue-referee-window>
            </div>
    `,
    data: function() {
        return {
            //local_series: this.series,
            local_series: [],
            syys_displayed: true,
            loka_displayed: true,
            marras_displayed: true,
            joulu_displayed: true,
            tammi_displayed: true,
            helmi_displayed: true,
            maalis_displayed: true,
            huhti_displayed: true,
            matches: [],
            id: this._uid,
            collapseId: this._uid,
            collapseHref: "#" + this._uid.toString(),

            referee_name: "",
            show: true,
            src: "",
        }
    },
    methods: {
        showRefereeWindow(referee){
            $("#referee-window").show();
            this.referee_name = referee.name;
            
            let src= referee.href + "&alkupvm=2021-09-01&print=1&piilota=tarkkailija&jarjestys=pvm,klo";
            this.src=src;

            document.getElementById('refereeIframe').src = src;
        },

        showEste(referee){
            $("#esteet").show();
            this.referee_name = referee.name;
            
            let src= "https://lentopallo-extranet.torneopal.fi/taso/tuomari.php?tuomari=" + referee.id + "&turnaus=vb2021a&sivu=esteet";
            this.src=src;

            document.getElementById('esteIframe').src = src;
        },
    
        save: function(){
            //Talletetaan valinnat
            let list = [];
            for(let sarja of this.local_series){
                if(sarja.displayed === false) list.push(sarja.id);
            }
            Lockr.set(PREFIX + "notSelectedSerieIds", list);

            // Talletetaan kuukaudet
            Lockr.set(PREFIX + "syys_displayed", this.syys_displayed);
            Lockr.set(PREFIX + "loka_displayed", this.loka_displayed);
            Lockr.set(PREFIX + "marras_displayed", this.marras_displayed);
            Lockr.set(PREFIX + "joulu_displayed", this.joulu_displayed);
            Lockr.set(PREFIX + "tammi_displayed", this.tammi_displayed);
            Lockr.set(PREFIX + "helmi_displayed", this.helmi_displayed);
            Lockr.set(PREFIX + "maalis_displayed", this.maalis_displayed);
            Lockr.set(PREFIX + "huhti_displayed", this.huhti_displayed);
        },
        toggle: function(month){
            switch(month.toLowerCase()){
                case 'syyskuu':
                    this.syys_displayed = !this.syys_displayed;
                    break;
                case 'lokakuu':
                    this.loka_displayed = !this.loka_displayed;
                    break;
                case 'marraskuu':
                    this.marras_displayed = !this.marras_displayed;
                    break;
                case 'joulukuu':
                    this.joulu_displayed = !this.joulu_displayed;
                    break;
                case 'tammikuu':
                    this.tammi_displayed = !this.tammi_displayed;
                    break;
                case 'helmikuu':
                    this.helmi_displayed = !this.helmi_displayed;
                    break;
                case 'maaliskuu':
                    this.maalis_displayed = !this.maalis_displayed;
                    break;
                case 'huhtikuu':
                    this.huhti_displayed = !this.huhti_displayed;
                    break;
            }
        },
        loadMonths: function(){
            this.syys_displayed = Lockr.get(PREFIX + "syys_displayed", true);
            this.loka_displayed = Lockr.get(PREFIX + "loka_displayed", true);
            this.marras_displayed = Lockr.get(PREFIX + "marras_displayed", true);
            this.joulu_displayed = Lockr.get(PREFIX + "joulu_displayed", true);
            this.tammi_displayed = Lockr.get(PREFIX + "tammi_displayed", true);
            this.helmi_displayed = Lockr.get(PREFIX + "helmi_displayed", true);
            this.maalis_displayed = Lockr.get(PREFIX + "maalis_displayed", true);
            this.huhti_displayed = Lockr.get(PREFIX + "huhti_displayed", true);
        },
        getMatches: function(referee_id, month){
            var self = this;
            let ret = this.matches.filter((m)=> m.referee_ids.includes(referee_id));
            
            for(let sarja of this.local_series){
                if(sarja.displayed === false){
                    ret = ret.filter((m)=>m.category.id !== sarja.id);
                }
            }

            switch(month.toLowerCase()){
                case 'syyskuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 8 && m.datetime.getFullYear() == 2021); break;
                case 'lokakuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 9 && m.datetime.getFullYear() == 2021); break;
                case 'marraskuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 10 && m.datetime.getFullYear() == 2021); break;
                case 'joulukuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 11 && m.datetime.getFullYear() == 2021); break;
                case 'tammikuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 0 && m.datetime.getFullYear() == 2022); break;
                case 'helmikuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 1 && m.datetime.getFullYear() == 2022); break;
                case 'maaliskuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 2 && m.datetime.getFullYear() == 2022); break;
                case 'huhtikuu':
                    ret = ret.filter((m)=> m.datetime.getMonth() == 3 && m.datetime.getFullYear() == 2022); break;
            }
            return ret;
        },
        handleChecks: function(){
            // Ladataan ja talletetaan localStoragesta
            //console.log("checked: " + this.series.filter((s)=> s.displayed).length);
                
        },
        
    },
    created: function(){
        this.loadMonths();
    },
    beforeUpdate: function(){
        this.handleChecks();
    },
    updated: function(){
        this.local_series = this.series;
        this.matches = this.initial_matches;
        this.handleChecks();
        //console.log("Updated: " + this.referees.length + " referees, " + this.initial_matches.length + " matches  " + this.series.length + " series");
    }
});

Vue.component('vue-workload-month', {
              props: ["matches"],
              template: `
                      <div>
                          <vue-workload-match v-for="match in matches" :match="match"></vue-workload-match>
                      </div>
              `,
              data: function() {
                  return {
                      //local_series: this.series,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
});
Vue.component('vue-workload-match', {
    props: ["match"],
    template: `
            <span :id="id" class="workload-label" :class="match.torneoMatch.category_id" @click="showPopup">
            <div class="match_popup" :id="popupId"  @click="hidePopup($event)">
                <p>
                    <a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> 
                    <a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> 
                    <a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a> 
                    {{match.datetime.toLocaleDateString()}} 
                    klo {{match.toTimeString()}}
                    {{match.getVenue()}}
                    {{match.torneoMatch.team_A_name}} -
                    {{match.torneoMatch.team_B_name}}
                </p>
            </div>
            {{match.torneoMatch.category_id}}
            </span>
    `,
    data: function() {
        return {
            //local_series: this.series,
            popupActive: false,
            id: this._uid,
            popupId: this._uid + "_popup",
            collapseId: this._uid,
            collapseHref: "#" + this._uid.toString()
        }
    },
    methods: {
        showPopup: function(){
            if(this.popupActive) return;
            $("#overlay").show();
            
            let span = $("#" + this.id);
            span.addClass("match_label_highlight");
            let position = span.position();

            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            let height = parseInt(span.css("height"), 10);

            position.top += 24;

            let div = $("#" + this.popupId);
            div.show();
            //div.css("z-index", "1003");
            //div.css("background", "white");
            div.css("top", position.top);
            div.css("left", "100px");
            div.css("width", 0.7*w);
            this.popupActive = true;
        },
        hidePopup: function(event){
            let span = $("#" + this.id);
            span.removeClass("match_label_highlight");

            $("#" + this.popupId).hide();
            $("#overlay").hide();
            var self=this;
            setTimeout(function(){
                self.popupActive = false;
            }, 0);
        }
    }
});

Vue.component('vue-referee-window', {
    props: ["name", "src"],
    template: `
        <div @click="hidePopup()">
            <div style="z-index: 100; background: grey; opacity: 0.5; position: fixed; top: 0; left: 0px; width: 100%; height: 100%;">
            </div>
            <div class="panel panel-default" style="z-index: 200; position: fixed; top: 100px; left: 100px; width: 80%; height: 80%;">
                <div class="panel-heading">
                    <a :href="src" target=_>Tuomarin {{name}} ottelut</a>
                    <button class="btn btn-default" style="padding: 2px 8px 2px 8px; color: red; float: right; margin-right: -5px;" @click="hidePopup()">X</button>
                </div>
                <div class="panel-body" style="width: 100%; height: 700px;">    
                    <iframe id="refereeIframe" sandbox style="z-index: 300; width: 100%; height: 660px;" frameborder=0></iframe>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            
        }
    },
    methods: {
        hidePopup: function(event){
            $("#referee-window").hide();
        }
    }
});

Vue.component('vue-linkin-tilaus', {
    template: `
        <div>
            <label for="email">Email:</label>
            <input type="email" v-model="to_email" placeholder="Sähköposti" id="email">
            <button class="btn" @click="laheta()">Lähetä</button>
        </div>
    `,
    data: function() {
        return {
            to_email: ''            
        }
    },
    methods: {
        laheta(){
            let self=this;
            requestLink(this.to_email, function(result){
                if(result.status == "OK"){
                    toastr.info("Linkki on lähetetty osoitteeseen " + self.to_email);
                } else {
                    toastr.error("Linkin lähetys epäonnistui. Syy: " + result.status);
                }
            })
        }
    }
});

Vue.component('vue-timestamp', {
    template: `
        <div :style="styl" class="age" :title="title()" @click="aleTitle()">
            {{textIka()}} 
        </div>
    `,
    data: function() {
        let initial_mome = moment("2000-01-01");
        return {
            stamp: initial_mome,
            text: initial_mome.format("YYYY-MM-DD hh:mm:ss"),
            ika: '0',
            styl: {
                color: 'red',
            }
        }
    },
    created: function(){
        let self=this;
        this.age();
        bus.on("PAIVITA_TIMESTAMP", function(incoming_stamp){
            self.stamp = moment(incoming_stamp);
            self.setAge();
        })
    },
    methods: {
        aleTitle: function(){
            alert(this.title());
        },
        textIka: function(){
            if(this.ika > 60 * 24 * 1000) return "<ei haettu>";
            if(this.ika < 1) return `Nyt`;
            if(this.ika < 2) return `${this.ika} minuutti`;
            if(this.ika < 60) return `${this.ika} minuuttia`;
            let m = this.ika % 60;
            let h = Math.floor(this.ika / 60);
            if(h < 2) return `${h} tunti`;
            if(h < 24) return `${h} tuntia`;
            let d=Math.floor(h/24);
            return `${d} päivää`
        },
        title: function(){
            let paiva = viikonpaiva(this.stamp);
            let dat = this.stamp.format("DD.MM.YYYY");
            let klo = this.stamp.format("HH:mm:ss");
            let text_ika = this.textIka();
            if(text_ika == '<ei haettu>') return "Tietoja ei ole vielä haettu palvelimelta.";
            if(text_ika == 'Nyt') return "Tiedot haettu torneopalista juuri äsken.";
            return `Tiedot haettu torneopalista ${text_ika} sitten, ${paiva} ${dat} klo ${klo}`;
        },
        setAge: function(){
            let self=this;
            self.age();
            
            setTimeout(function(){
                self.setAge();
            }, 30*1000);
        },
        age: function(){
            let self=this;
            var sec = moment().diff(this.stamp, 'seconds') // 1
            this.ika = Math.floor(sec/60);
 
            if(this.ika < 20) this.styl = {
                "background-color": "#9f9",
                "border": "2px solid #7c7",
                "color": "#383",
            }
            else if(this.ika < 60) this.styl = {
                "background-color": "yellow",
                "border": "2px solid #fda",
                "color": "#b84",
            }
            else this.styl = {
                "background-color": "#f42",
                "border": "2px solid #f75",
                "color": "white",
            }
        }
    }
});

