<template>
  <div class="app">
    <h1 class="app__title">Notifme</h1>

    <template v-if="domIsReady">
      <v-container>
        <h2 class="app__list">My WatchList</h2>
        <v-row v-for="item in links" :key="item">
          <h1>
            <a :href="item" @click.prevent="openLink(item)">{{ item }}</a>
          </h1>
        </v-row>
      </v-container>
      <button class="button" @click="addLink">add</button>
      <button class="button" v-if="!editMode" @click="setEdit">start</button>
      <button class="button" v-else @click="setEdit">stop</button>
      <button class="button" v-if="!done" @click="setDone">Done</button>
    </template>
    <h2 v-else class="app__title">Loading...</h2>
    <div v-if="done">
      <div v-if="email == undefined">
        <input id="email" placeholder="Please enter your email" />
        <button class="button" @click="saveEmail">Save</button>
      </div>
      <div v-else>
        <h1>Enter Reference Name</h1>

        <!-- Text box for entering the name of the link -->
        <input v-model="linkName" placeholder="Enter link name" />

        <!-- Save button -->
        <button class="button" @click="saveLink">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { domIsReady, getTabId } from "./utils/chrome";
import SearchTerm from "./components/Add.vue";
import SetGoogleBackground from "./components/SetGoogleBackground.vue";
import Popup from "./components/Popup.vue";
import axios from "axios";

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
      email: undefined,
      apiData: [],
      receivedData: {
        url: "",
        xPathList: [],
        lastButtonXpath: "",
      },
    };
  },
  mounted() {
    this.awaitReady();
    console.log("get here");

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("get here 2");
      console.log(request.action);
      if (request.action === "sendData") {
        // Update the component's data with the received data
        console.log("get here 3");
        this.receivedData.url = request.url;
        this.receivedData.xPathList = request.xPathList;
        this.receivedData.lastButtonXpath = request.lastButtonXpath;
      }
    });
  },
  created() {
    const isEnabled = sessionStorage.getItem("isEnabled");
    if (isEnabled) {
      this.editMode = isEnabled === "true";
    } else {
      this.editMode = false;
    }
    const email = localStorage.getItem("email");
    if (email) {
      this.email = email;
    }
  },
  methods: {
    async awaitReady() {
      await domIsReady();
      this.domIsReady = true;
      this.tabId = await getTabId();
      // this.fetchData();
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
    setDone() {
      console.log("Nothing");
      this.done = !this.done;
      console.log(this.done);
      console.log("this final xpath" + this.receivedData.lastButtonXpath);
      console.log("this final xpath list" + this.receivedData.xPathList);
    },
    setEdit() {
      this.editMode = !this.editMode;
      sessionStorage.setItem("isEnabled", this.editMode);
      chrome.runtime.sendMessage({
        action: "updateEditMode",
        editMode: this.editMode,
      });
    },
    saveEmail() {
      this.email = document.getElementById("email").value;
      localStorage.setItem("email", this.email);
    },
    async sendPostRequest() {
      try {
        // Specify the data you want to send in the request body
        const requestData = {
          email: this.email,
          url: this.receivedData.url,
          clicks: this.receivedData.xPathList,
          final_xpath: this.receivedData.lastButtonXpath,
          name: this.linkName,
        };

        // Make a POST request with the specified data
        const response = await axios.post(
          "http://your-flask-api-endpoint",
          requestData
        );

        // Handle the response
        console.log("Response:", response.data);
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
      }
    },

    // async fetchData() {
    //   try {
    //     // Make a GET request to your Flask API endpoint
    //     const response = await axios.get('http://your-flask-api-endpoint');

    //     // Update the component's data with the fetched data
    //     this.apiData = response.data;
    //   } catch (error) {
    //     // Handle errors
    //     console.error('Error:', error);
    //   }
    // }
  },
};
</script>

<style lang="scss">
@import "./scss/reset";

.button {
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  margin-bottom: 15px;
  background-color: #1a936f; /* Green color */
  color: #fff; /* White text */
  padding: 5px 10px; /* Adjust padding for better proportions */
  border-radius: 10px; /* Rounded edges */
  border: none; /* Remove border */
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s; /* Smooth transition */

  /* Ensure the button takes full width */
  display: block;

  /* Adjust the button width based on its content */
  width: fit-content;

  /* Add a subtle glow effect on hover */
  &:hover {
    background-color: #0d7052; /* Darker green on hover */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Subtle shadow on hover */
  }
}

.app {
  height: 500px;
  width: 300px;
  margin: 0 auto; /* Center horizontally */
  display: flex;
  flex-direction: column;
  background-color: #c0fdfb;
  align-items: center;
  align-self: flex-start; /* Keep it at the top */
  padding: 10px;

  &__title{
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 25px;
    margin-bottom: 15px;
    text-align: center;
    color: #333;
    letter-spacing: 1px;
  }
  &__list {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
    color: #333;
    letter-spacing: 1px;
  }

}
</style>
