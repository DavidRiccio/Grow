<template>
  <footer class="footer bg-dark text-light py-3 text-center">
    <div class="container">
      <p>&copy; {{ currentYear }} Mi Sitio Web. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  position: relative;
  width: 100%;
  bottom: 0;
}
</style>

<script lang="ts">
export default {
  name: "BaseFooter"
};
</script>

