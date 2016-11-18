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
              props: ['matches', 'initial_date'],
              template: `
                      <div class="panel panel-default ottelulista">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">
                                    <p>Matches (total {{matches.length}}):</p>
                                </a>
                            </h4>
                          </div>
                          <div :id="collapseId" class="panel-collapse collapse in">
                                <!--<p>Matches (total {{matches_with_incomplete_referees.length}}):</p>-->
                                <input type="date" v-model="date" class="form-control">
                                {{date}}
                                <ul>
                                    <!--<li v-for="match in matches_with_incomplete_referees">{{match.category_id}}  {{match.match_number}} {{match.weekday}} {{match.datelocal}} {{match.team_A_name}}-{{match.team_B_name}}  {{match.timelocal}}  {{match.venue_name}}  {{match.referee_1_name}}  {{match.referee_2_name}}  {{match.assistant_referee_1_name}}  {{match.assistant_referee_2_name}} Puuttuu: {{match.referee_status}}    Group: {{match.group_id}}</li>-->
                                    <li v-for="match in matches">{{match.number}} {{match.weekday}} {{match.datelocal}} {{match.team_A_name}}-{{match.team_B_name}}  {{match.timelocal}}  {{match.venue_name}}  {{match.referee_1_name}}  {{match.referee_2_name}}  {{match.assistant_referee_1_name}}  {{match.assistant_referee_2_name}} Puuttuu: {{match.referee_status}}    Group: {{match.group_id}}  Special: {{match.special}}</li>
                                    <!--<li v-for="match in matches_of_displayed_categories">{{match.category_id}}  {{match.match_number}} {{match.weekday}} {{match.datelocal}} {{match.team_A_name}}-{{match.team_B_name}}  {{match.timelocal}}  {{match.venue_name}}  {{match.referee_1_name}}  {{match.referee_2_name}}  {{match.assistant_referee_1_name}}  {{match.assistant_referee_2_name}} Puuttuu: {{match.referee_status}}    Group: {{match.group_id}}</li>-->
                                </ul>
                            <!--div class="panel-footer">Panel Footer</div-->
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
Vue.component('vue-match', {
              props: ['match'],
              template: `
                  <div class='match'>
                      {{match.torneoMatch.category_id}} 
                      {{match.torneoMatch.match_number}} 
                      {{match.datetime.toLocaleDateString()}} 
                      {{match.datetime.toLocaleTimeString()}}
                      {{match.torneoMatch.venue_name}}
                      {{match.torneoMatch.team_A_name}}
                      {{match.torneoMatch.team_B_name}}
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
                  <div class='double-booking'>
                      Referee: {{double_booking_item.referee.name}}<br>
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
