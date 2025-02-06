<template>
  <div class="app-container">
    <Navbar></Navbar>
    <br>
    <main class="content">
      <router-view />
    </main>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import BaseFooter from './components/Footer.vue';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    BaseFooter
  },
});
</script>

<style scoped>
.footer {
  position: fixed;
  display: flex;
  justify-content: center;
  width: 100%;
  bottom: 0;
  left: 0;
}
</style>
