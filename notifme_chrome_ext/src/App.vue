<template>
  <div class="app">
    <h1 class="app__title">Notifme</h1>

    <template v-if="domIsReady">
      <SearchTerm class="app__search-term" :tabId="tabId"/>
      <SetGoogleBackground :tabId="tabId"/>
      <v-container>
        <v-row v-for="item in links" :key="item">
          <h1><a :href="item" @click.prevent="openLink(item)">{{ item }}</a></h1>
        </v-row>
      </v-container>
      <button @click="addLink">add</button>
    </template>

    <h2 v-else class="app__title"> Loading...</h2>
  </div>
</template>

<script>
import { domIsReady, getTabId } from './utils/chrome'
import SearchTerm from './components/SearchTerm.vue'
import SetGoogleBackground from './components/SetGoogleBackground.vue'

export default {
  components: {
    SearchTerm,
    SetGoogleBackground
  },
  data() {
    return {
      domIsReady: false,
      tabId: '',
      links: [],
      editMode: false
    }
  },
  mounted() {
    this.awaitReady()

  },
  methods: {
    async awaitReady() {
      await domIsReady()
      this.domIsReady = true
      this.tabId = await getTabId()
    },
    addLink() {
      this.links.push("https://www.google.com/");
    },
    // fix this
    openLink(link) {
      chrome.runtime.sendMessage({ action: "openNewTab", link });
    },
    setEdit() {
      editMode = !editMode;
    }
  },
}
</script>

<style lang="scss">
@import './scss/reset';

.app {
  height: 100px;
  width: 200px;
  padding: 10px;

  &__search-term {
    margin-bottom: 10px;
  }

  &__title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
    text-align: center;
  }
}
</style>