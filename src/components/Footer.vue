<template>
  <footer class="footer bg-dark text-light py-3 text-center">
    <div class="container">
      <p>&copy; {{ currentYear }} GrowStudio. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: #2d2d2d;
  color: white;
  padding: 1rem;
  height: 60px; /* Altura fija */
  margin-top: auto;
}
.logo-footer{
  background-color: white;
}
</style>

<script lang="ts">
export default {
  name: "BaseFooter"
};
</script>

