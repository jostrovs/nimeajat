Vue.component('vue-empty', {
    template: `
    
    `,
    props: ['column'],
    data: function(){
        return {
            randomId: this._uid
        }
    }
});

Vue.component('vue-col-header', {
    template: `
        <div class="div-cell th cell" :style="style" @click="setDate()">
            <slot></slot>
        </div>
    `,
    props: ['column'],
    data: function(){
        return {
            randomId: this._uid,
        }
    },
    computed: {
        style: function(){
            if(this.column.tuomari){
                return {
                    background: "white",
                    width: "150px",
                }
            }
            
            let ret = {
                'border': '1px solid white',
            };

            if(this.column.today){
                ret.background= "#7a7";
            }

            if(this.column.endOfWeek){
                ret["margin-right"] = "21px";
            }
            return ret;
        }
    },
    methods: {
        setDate(){
            bus.emit("SET_DATE", this.column.moment.format("YYYY-MM-DD"))
        }
    }
});

Vue.component('vue-cell', {
    template: `
        <div class="div-cell cell" :style="style">
            <span v-if="c.tuomari">{{name}}</span>
            <span v-else-if="c.match" :title="title">{{c.match.category_id}}</span>
            <span v-else>{{c.text}}</span>
        </div>
    `,
    props: ['cell', 'name'],
    data: function(){
        let text = this.name;
        let title = "";
        if(this.cell.match) title = `${this.cell.match.koti}-${this.cell.match.vieras} klo ${this.cell.match.time}`;
        return {
            // text: text,
            varattu: this.cell.match,
            c: this.cell,
            title: title,
            randomId: this._uid,
        }
    },
    computed: {
        style: function(){
            let ret = {
                background: "white",
                border: "1px solid white",
            }
            if(this.cell.zebra){
                ret.background= "#eee";
            }
            if(this.cell.today){
                ret.background= "#cec";
            }
            if(this.cell.endOfWeek){
                ret["margin-right"] = "21px";
            }

            if(this.cell.tuomari){
                ret.width = "150px";
                ret["text-align"] = "left";
                return ret;
            } 
            if(this.varattu == false){
                return ret;
            } else {
                ret.background= "#777";
                if(this.cell.today) ret.background= "#a77";
                ret.color="white";
            }
            
            return ret;
        }
    }
});