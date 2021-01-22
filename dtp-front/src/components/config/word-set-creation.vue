<template lang="html">
  <section class="word-set-creation">
    <ul>
      <li>
        <category-selection
            :category-color="'#4D58C2'"
            :input-color="'#DF9D00'"
            :board-color="'#555555'"
            :default-tags="words"
            :input-limit="28"
            :creation="true"
            :placeholder="'Pick or create some words!'"
        >
        </category-selection>
      </li>
      <li>
        <category-selection
          :default-tags="words"
          :board-color="'#777777'"
          :input-limit="28"
          :placeholder="'Seek existing tags 🔎'"
        ></category-selection>
      </li>
    </ul>
  </section>

</template>

<script lang="js">

import CategorySelection from "@/components/config/category-selection";
export default  {
  name: 'word-set-creation',
  components: {CategorySelection},
  props: [],
  mounted () {

  },
  data: function(){
    return {
      words: [
        { key: 'web-development', value: 'Animals' },
        { key: 'web', value: 'Web' },
        { key: 'web-internet', value: 'Movies' },
        { key: 'web-culture', value: 'Web Culture' },]
    }
  },
  methods: {

  },
  computed: {

  }
}


</script>

<style scoped lang="scss">
.word-set-creation {

}
ul {
  list-style-type: none;
}

</style>
