<template>
  <footer class="footer text-light py-3">
    <div class="container">
      <div class="row align-items-center">
        <!-- Columna izquierda -->
        <div class="col-md-4 text-center text-md-start mb-2 mb-md-0">
          <div class="logo-footer d-flex justify-content-center justify-content-md-start">
            <img src="../assets/img/Logo principal con tagline.png" alt="Logo" class="logo-dark-footer">
          </div>
        </div>

        <!-- Columna central -->
        <div class="col-md-4 text-center mb-2 mb-md-0">
          <p class="mb-0">&copy; {{ currentYear }} GrowStudio.<br>Todos los derechos reservados.</p>
        </div>

        <!-- Columna derecha -->
        <div class="col-md-4 text-center text-md-end">
          <div class="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-3">
            <!-- Redes Sociales -->
            <div class="d-flex gap-2">
              <a href="https://www.instagram.com/grow.tnf/" target="_blank" class="text-light">
                <i class="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://api.whatsapp.com/message/G7FUM5KPBIWUE1?autoload=1&app_absent=0" target="_blank" class="text-light">
                <i class="bi bi-whatsapp fs-5"></i>
              </a>
              <a href="https://tiktok.com/@grow.tnf" target="_blank" class="text-light">
                <i class="bi bi-tiktok fs-5"></i>
              </a>
            </div>
            
            <!-- Link Contacto -->
            <router-link to="/contact" class="btn btn-outline-light btn-sm">
              Contáctanos
            </router-link>
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
  background-color: #1a1a1a;
  padding: 1rem;
  min-height: 80px;
  border-top: 2px solid #ffd700; /* Borde dorado */
}

.logo-footer img {
  max-height: 40px;
  width: auto;
  padding: 5px;
}

/* Efectos hover */
.text-light:hover {
  color: #ffd700 !important;
  transition: color 0.3s ease;
}

.btn-outline-light {
  border-color: #ffd700;
  color: #ffd700;
}

.btn-outline-light:hover {
  background-color: #ffd700;
  color: #1a1a1a;
}

/* Responsive */
@media (max-width: 768px) {
  .gap-3 {
    gap: 1rem !important;
  }
  .logo-footer {
    margin-bottom: 1rem;
  }
  
  .btn-outline-light {
    margin-top: 1rem;
  }
}
</style>