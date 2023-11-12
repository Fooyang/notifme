<template>
  <div class="app">
    <h1 class="app__title">Notifme</h1>
    
    <template v-if="domIsReady">
      <SearchTerm class="app__search-term" :tabId="tabId"/>
      <SetGoogleBackground :tabId="tabId"/>
      <v-container>
        <h2 class="list__list">My WatchList</h2>
        <v-row v-for="item in links" :key="item">
          <h1><a :href="item" @click.prevent="openLink(item)">{{ item }}</a></h1>
        </v-row>
      </v-container>
      <div>
        <button class="button" @click="addLink">Add</button>
      </div>
    </template>
    <h2 v-else class="app__title"> Loading...</h2>
  </div>
</template>

<script>
import { domIsReady, getTabId } from './utils/chrome'
import SearchTerm from './components/Add.vue'
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
      this.editMode = !this.editMode;
    }
  },
}
</script>

<style lang="scss">
@import './scss/reset';

.button {
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  background-color: green;
  margin: 0 auto; /* Center the button horizontally */
  display: block; /* Ensure the button takes full width */
  width: fit-content; /* Adjust the button width based on its content */
  margin-bottom: 8px;
}

.app {
  height: 500px;
  width: 300px; /* Set the container height to 100% of the viewport height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;

  &__search-term {
    margin-bottom: 10px;
  }

  &__title,
  &__list {
    font-weight: bold;
    font-size: 16px; /* Adjust the title font size for consistency */
    margin-bottom: 10px;
    text-align: center;
  }
}
</style>
