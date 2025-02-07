<template>
  <footer class="footer bg-dark text-light py-3">
    <div class="container">
      <div class="row align-items-center">
        <!-- Columna izquierda -->

        <!-- Columna central -->
        <div class="col-md-4 text-center mb-2 mb-md-0">
          <p class="mb-0">&copy; {{ currentYear }} GrowStudio.<br>Todos los derechos reservados.</p>
        </div>

        <!-- Columna derecha -->
        <div class="col-md-4 text-center text-md-end">
          <div class="d-flex justify-content-center justify-content-md-end gap-3">
            <a href="#" class="text-light text-decoration-none">Términos de uso</a>
            <a href="#" class="text-light text-decoration-none">Política de privacidad</a>
          </div>
        </div>
      </div>
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
  padding: 1rem;
  min-height: 60px;
  margin-top: auto;
}

.logo-footer {
  background-color: white;
  padding: 2px;
  border-radius: 4px;
}

/* Mantener enlaces en línea en móviles */
@media (max-width: 768px) {
  .gap-3 {
    gap: 1rem !important;
  }
}
</style>

<script lang="ts">
export default {
  name: "BaseFooter"
};
</script>
