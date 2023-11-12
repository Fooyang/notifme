<template>
  <div>
    <h1>Enter Reference Name</h1>
    
    <!-- Text box for entering the name of the link -->
    <input v-model="linkName" placeholder="Enter link name" />

    <!-- Save button -->
    <button @click="saveLink">Save</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkName: "", // Data property to store the entered link name
    };
  },
  methods: {
    saveLink() {
      // Implement your logic to save the link with the entered name
      // For example, you can emit an event or perform an action
      // using this.linkName as the entered link name.
      // For simplicity, I'll just log it to the console here.
      console.log("Link name to save:", this.linkName);
    },
  },
};
</script>

<style scoped>
/* Add your styling here */
</style>