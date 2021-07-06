<template>
  <div id="home">
    <Header></Header>
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
export default defineComponent({
  name: "home",
  components: {
    Header,Footer
  },
});
</script>