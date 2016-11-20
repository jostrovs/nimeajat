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
Vue.component('vue-referees', {
              props: ['referees'],
              template: `
                      <div class="panel panel-default tuomarilista">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">Tuomarit: (valittu {{selected_referees.length}}/{{referees.length}}</a>
                            </h4>
                          </div>
                          <div :id="collapseId" class="panel-collapse collapse in">
                              <button id="kaikki" @click="select_all_referees()">Valitse kaikki</button>
                              <button id="ei_mitaan" @click="select_no_referees()">Tyhjennä valinnat</button>
                              <table>
                                  <tr>
                                      <th>&nbsp;</td>
                                      <th><a @click="setSort('id')">Id</a></th>
                                      <th><a @click="setSort('nimi')">Nimi</a></th>
                                      <th><a @click="setSort('luokka')">Luokka</a></th>
                                      <th><a @click="setSort('posti')">Posti</a></th>
                                      <th><a @click="setSort('kunta')">Kunta</a></th>
                                  </tr>
                                  <tr v-for="referee in sorted_referees">
                                      <td><input type="checkbox" v-model="referee.displayed"></td>
                                      <td>{{referee.id}}</td>
                                      <td>{{referee.name}}</td>
                                      <td>{{referee.Luokka}}</td>
                                      <td>{{referee.PostiNo}}</td>
                                      <td>{{referee.Kunta}}</td>
                                  </tr>
                            <!--div class="panel-footer">Panel Footer</div-->
                          </div>
              
              `,
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString(),
                      sortField: '',
                      sortOrderAsc: true,
                  }
              },
              methods:{
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
                      var self = this;
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
              props: ['competitions'],
              template: `
                      <div class="panel panel-default sarjalista">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">Sarjat ja lohkot:</a>
                            </h4>
                          </div>
                          <div :id="collapseId" class="panel-collapse collapse in">
                                <ul>
                                    <li v-for="competition in competitions">
                                        {{competition.name}}
                                        <ul>
                                            <li v-for="category in competition.categories">
                                                {{category.name}}
                                                <ul>
                                                    <li v-for="group in category.groups">
                                                        <input type="checkbox" v-model="group.displayed"> {{group.name}}
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            <!--div class="panel-footer">Panel Footer</div-->
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
Vue.component('vue-matches', {
              props: ['initial_matches', 'initial_date'],
              computed: {
                  matches_before: function(){
                      console.log(this.initial_matches.length);
                      let dt = Date.parse(this.date);
                      return this.initial_matches.filter((m)=>m.datetime <= dt);
                  }
              },
              template: `
                      <div class="panel panel-default ottelulista">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">
                                   <p>Nimeämättömiä otteluita yhteensä {{matches_before.length}}</p>
                                </a>
                            </h4>
                          </div>
                          <div :id="collapseId" class="panel-collapse collapse in">
                                <p>
                                    Näytä ottelut ennen: <input style="width:200px;" type="date" v-model="date" class="form-control">
                                </p>                                
                                <vue-match v-for="match in matches_before" :match="match"></vue-match>
                          </div>
              
              `,
              data: function() {
                  return {
                      matches: this.initial_matches,
                      date: this.initial_date,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
});
Vue.component('vue-match', {
              props: ['match'],
              template: `
                  <div class='match'>
                      <a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> 
                      <a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> 
                      <a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a> 
                      <span class="ajankohta-label">{{match.datetime.toLocaleDateString()}} 
                      klo {{match.toTimeString()}}</span>
                      <span class="pelipaikka-label">{{match.torneoMatch.venue_name}}</span>
                      {{match.torneoMatch.team_A_name}} -
                      {{match.torneoMatch.team_B_name}}
                      <span v-if="match.referee_status!==''">
                          Puuttuu: 
                          <span v-for="referee in match.referee_status.split(' ')" class='referee-label'>
                              {{referee}}
                          </span>
                      </span>
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
Vue.component('vue-double-booking', {
              props: ['double_booking_item'],
              template: `
                  <div class='double-booking' v-if="double_booking_item.referee.displayed">
                      Tuomari: <a :href="double_booking_item.referee.href" target="_blank">{{double_booking_item.referee.name}}</a><br>
                      <vue-match v-for="match in double_booking_item.matches" :match="match"></vue-match>
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
              props: ["duplicates", "initial_date"],
              template: `
                      <div>
                          <h1>Tuplabuukkaukset</h1>
                          <vue-double-booking v-for="item in duplicates" :double_booking_item="item"></vue-double-booking>
                      </div>
              `,
              data: function() {
                  return {
                      date: this.initial_date,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              }
});
