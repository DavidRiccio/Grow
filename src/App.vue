<template>
  <div class="container-fluid d-flex flex-column min-vh-100 p-0">
    <div class="row">
      <div class="col-12 px-0">
        <Navbar />
        <AdminBar />
        <!-- Agregar AdminBar aquí -->
      </div>
    </div>

    <div class="row flex-grow-1 g-0">
      <main class="col-12">
        <router-view />
      </main>
    </div>

    <div class="row mt-auto">
      <div class="col-12 px-0">
        <BaseFooter />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useUser Store } from './stores/userStore'; // Asegúrate de que la ruta sea correcta
import Navbar from './components/Navbar.vue';
import BaseFooter from './components/Footer.vue';
import AdminBar from './components/AdminBar.vue'; // Importar AdminBar

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    BaseFooter,
    AdminBar,
  },
  setup() {
    const userStore = useUser Store();

    onMounted(() => {
      if (!userStore.user) {
        userStore.fetchUser ();
      }
    });
  },
});
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

/* Asegurar que el contenido no sobrepase el footer */
</style>
