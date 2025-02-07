<template>
  <div class="d-flex flex-column min-vh-100 mt-5">
    <Navbar />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <BaseFooter class="mt-auto" />
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

<style>
/* Asegurar altura completa */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
