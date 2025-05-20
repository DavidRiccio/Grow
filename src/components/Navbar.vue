<template>
  <nav id="navbar" class="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm">
    <div class="container-fluid">

      <!-- Toggler (Hamburger) for mobile view -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation links -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/products" class="nav-link">Productos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/services" class="nav-link">Servicios</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/events" class="nav-link">Eventos</router-link>
          </li>
        </ul>
      </div>

      <!-- User Section -->
      <div class="d-flex align-items-center gap-3 me-3">
        <div v-if="userStore.isAuthenticated" class="user-info">
          <span class="text-light me-2">{{ userStore.user }}</span>
          <button @click="userStore.logout" class="btn-logout">
            <i class="bi bi-box-arrow-right text-light"></i>
          </button>
        </div>
        
        <router-link v-else to="/login" class="text-light text-decoration-none fw-bold">
          Login
        </router-link>

        <router-link to="/cart" class="cart-icon">
          <i class="bi bi-cart-fill fs-3 text-light"></i>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore';

const authStore = useAuthStore();
const userStore=useUserStore()

onMounted(async () => {
  if (authStore.isAuthenticated && !userStore.user) {
    await userStore.fetchUser();
  }
});
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-logout {
  background: none;
  border: none;
  padding: 0;
  transition: opacity 0.2s;
}

.btn-logout:hover {
  opacity: 0.8;
}

/* Mantener otros estilos existentes */
#navbar{
  background-color: black;
}
.navbar {
  height: 80px;
  z-index: 1000;
}
/* ... resto de estilos ... */
</style>