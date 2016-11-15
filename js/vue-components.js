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
                                <a data-toggle="collapse" :href="collapseHref">Tuomarit:</a>
                            </h4>
                          </div>
                          <div :id="collapseId" class="panel-collapse collapse in">
                              <ul>
                                  <li v-for="referee in referees"><input type="checkbox" v-model="referee.displayed"> {{referee.id}} - {{referee.name}} - {{referee.Luokka}} - {{referee.PostiNo}} - {{referee.Kunta}}</li>
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
