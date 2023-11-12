<template>
  <div class="add">
    <button @click="addToList" class="add-term__btn">
      Add
    </button>
    <p>Your Term is: {{ searchTerm }}</p>
  </div>
</template>



<script>
export default {
  props: {
    tabId: {
      type: String,
    }
  },
  data() {
    return {
      searchTerm: '',
    }
  },
  methods: {
    async addToList() {
      const message = generateMessage(POPUP_SCRIPT_ID, GET_SEARCH_TERM, {})
      this.searchTerm = await sendMessage(this.tabId, message)
    },
  }
}
</script>

<style lang="scss">
$btn-background: #2c67be;
$btn-color: #ffffff;

.search-term {
  &__btn {
    width: 100%;
    background: $btn-background;
    color: $btn-color;
    border: none;
    padding: 5px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>