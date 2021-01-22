<template lang="html">

  <div class="tags-workspace">
    <ul class="button" :style="boardStyle">
      <li class="button" :style="categoryStyle" v-for="(s,idx) in selectedTags" :key="idx">
        #{{s.value}}
        <button class="del" @click="remove(s)">✖</button>
      </li>
      <li class="inputs" :style="inputStyle">
        <button class="del" style="display: inline-block;" @click="_submit()">➕</button>
        <input class="inputs" v-bind:maxlength="inputLimit" :style="inputStyle" v-bind:placeholder="placeholder" type="text" v-model="inputMessage"
               @keydown.enter="_submit()"
               @keydown.delete="_erase()">

        <select ref="selection" :style="inputStyle" class="choices inputs" id="pet-select" v-if="this.existingTags.some(_checks)">
          <option class="button"
                  v-for="(s,idx) in this.existingTags.filter(_checks).slice(0, 5)" :key="idx"
                  @click="add(s)">
            {{s.value}}
          </option>
        </select>
      </li>
    </ul>
  </div>
</template>

<script lang="js">
//https://github.com/seniorcote/vue-tags-component

Array.prototype.remove = function() {
  let what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

export default  {
  name: 'category-selection',
  components: {},
  props: {
    limit: {
      type: Number,
      default: -1
    },
    inputLimit: {
      type: Number,
      default: 64
    },
    categoryColor: {
      type: String,
      default: "#4CAF50"
    },
    inputColor: {
      type: String,
      default: "#5C5FA1"
    },
    boardColor: {
      type: String,
      default: "#4CAF50"
    },
    creation: {
      type: Boolean,
      default:false
    },
    placeholder:{
      type:String,
      default:"Seek categories 🔎"
    },
    defaultTags:{
      type: Array
    }
  },
  mounted () {
    this.existingTags = this.existingTags.concat(this.defaultTags);
  },
  data: function () {
    return {
      inputMessage: "",
      selectedTags: [],
      existingTags: []
    }
  },
  methods: {
    add: function(s) {
      this.existingTags.remove(s);
      this.selectedTags.push(s);
      if (this.limit > 0 && this.selectedTags.length > this.limit) {
        this.selectedTags.splice(0, this.selectedTags.length - this.limit);
      }
    },
    remove: function(s) {
      this.selectedTags.remove(s);
      this.existingTags.push(s);
    },
    _submit: function() {
      let input = this.inputMessage.length === 0 ? this.$refs.selection !== undefined ? this.$refs.selection.value : "" : this.inputMessage;
      //duplicates checking
      if (this.selectedTags.some(s=>s.value.toLowerCase()===(input.toLowerCase()))) {
        return ;
      }
      //all similarities
      let filtered = this.existingTags.filter((s)=>s.value.toLowerCase().includes(input.toLowerCase()));
      if (filtered.length > 0) {
        let s = filtered[0];
        this.add(s);
      } else if (this.creation && this.inputMessage.length > 0) {
        this.add({"key":this.inputMessage, "value":this.inputMessage });
      }
      //clear input
      this.inputMessage = "";
    },
    _erase: function() {
      if (this.inputMessage.length === 0 && this.selectedTags.length > 0) {
        this.remove(this.selectedTags[this.selectedTags.length-1]);
      }
    },
    _checks: function(cat) {
      return cat.value.toLowerCase().includes(this.inputMessage.toLowerCase());
    }
  },
  computed: {
    categoryStyle () {
      return 'background-color: ' + this.categoryColor + ";";
    },
    inputStyle () {
      return 'background-color: ' + this.inputColor + ";";
    },
    boardStyle () {
      return 'background-color: ' + this.boardColor + ";";
    }
  },
}


</script>

<style scoped lang="scss">
.tags-workspace {
  display: inline;
}
::placeholder {
  color: white;
}

.button {
  display: inline-block;
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 3px 5px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  border-radius: 10px;
  border: 3px solid #00000045;
}
ul {
  margin: 0;
  padding: 1px;
  text-align: left;
  width:80%;
  //border: 1px solid #ccc;
  font:16px/26px Georgia, Garamond, Serif;
  overflow:auto;
  overflow-y:scroll;
  scroll-behavior: smooth;
  list-style: none;
}
.del {
  padding: 1px;
  display: compact;
  background-color: #FFFFFF44;
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid #00000000;
}
.choices {
  max-width: 300px;
}
.inputs {
  display: inline-block;
  background-color: #5C5FA1;
  color: white;
  padding: 1px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  border-radius: 25px;
  border: 3px solid #00000035;
}

.tag {
  margin: 10px auto;
  background: #00bfb6;
  padding: 5px;
  text-align: center;
  font-weight: 900;
  color: #fff;
  position:inherit;
  display: inline;
  border-radius: 25px;
  border: 2px solid #00000000;
}

</style>
