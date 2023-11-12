<template>
  <div class="app">
    <h1 class="app__title">Notifme</h1>

    <template v-if="domIsReady">
      <SearchTerm class="app__search-term" :tabId="tabId" />
      <SetGoogleBackground :tabId="tabId" />
      <v-container>
        <h2 class="list__list">My WatchList</h2>
        <v-row v-for="item in links" :key="item">
          <h1>
            <a :href="item" @click.prevent="openLink(item)">{{ item }}</a>
          </h1>
        </v-row>
      </v-container>
      <button @click="addLink">add</button>
      <button v-if="!editMode" @click="setEdit">start</button>
      <button v-else @click="setEdit">stop</button>
      <button v-if="!done" @click="setDone">Done</button>
    </template>
    <h2 v-else class="app__title">Loading...</h2>
    <div v-if="done">
      <div v-if="email == undefined">
        <input id="email" placeholder="Please enter your email" />
        <button @click="saveEmail">Save</button>
      </div>
      <div v-else>
        <h1>Enter Reference Name</h1>
      
        <!-- Text box for entering the name of the link -->
        <input v-model="linkName" placeholder="Enter link name" />

        <!-- Save button -->
        <button @click="saveLink">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { domIsReady, getTabId } from "./utils/chrome";
import SearchTerm from "./components/Add.vue";
import SetGoogleBackground from "./components/SetGoogleBackground.vue";
import Popup from "./components/Popup.vue";



export default {
  components: {
    SearchTerm,
    SetGoogleBackground,
    Popup,
},
  data() {
    return {
      domIsReady: false,
      tabId: "",
      links: [],
      editMode: false,
      done: false,
      linkName: "",
      email: undefined
    };
  },
  mounted() {
    this.awaitReady();
  },
  created() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'enabled') {
        // Update the component's data with the received data
        this.editMode = request.data;
      }
    });
    chrome.runtime.sendMessage({ action: "getEnabled" });
    const email = localStorage.getItem('email');
    if (email) {
      this.email = email;
    }
  },
  methods: {
    async awaitReady() {
      await domIsReady();
      this.domIsReady = true;
      this.tabId = await getTabId();
    },
    saveLink() {
      // Implement your logic to save the link with the entered name
      // For example, you can emit an event or perform an action
      // using this.linkName as the entered link name.
      // For simplicity, I'll just log it to the console here.
      this.links.push(this.linkName);
      console.log("Link name to save:", this.linkName);
    },
    addLink() {
      this.links.push("https://www.google.com/");
    },
    // fix this
    openLink(link) {
      chrome.runtime.sendMessage({ action: "openNewTab", link });
    },
    getDone() { 
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

      });
    },
    setDone() { 
      console.log("Nothing");
      this.done = !this.done;
    },
    setEdit() {
      this.editMode = !this.editMode;
      // sessionStorage.setItem('isEnabled', this.editMode); 
      chrome.runtime.sendMessage({
        action: "updateEditMode",
        editMode: this.editMode,
      });
    },
    saveEmail() {
      this.email = document.getElementById("email").value;
      localStorage.setItem('email', this.email);
    }
  },
};

</script>

<style lang="scss">
@import "./scss/reset";

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