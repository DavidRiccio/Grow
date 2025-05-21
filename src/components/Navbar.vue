<template>
  <nav id="navbar" class="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm">
    <div class="container-fluid d-flex justify-content-between align-items-center w-100">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
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

      <div class="d-flex align-items-center gap-3 me-3">
        <div v-if="userStore.isAuthenticated" class="user-info">
          <span class="text-light me-2">{{ userStore.user?.username }}</span>
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
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

onMounted(async () => {
  userStore.initialize();
  if (userStore.isAuthenticated && !userStore.user) {
    await userStore.fetchUser();
  }
});
</script>

<style scoped>
#navbar {
  background-color: black;
}

.navbar {
  height: 80px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-toggler {
  background-color: #ffb100;
}

.btn-logout {
  background: none;
  border: none;
  padding: 0;
  transition: opacity 0.3s, transform 0.2s;
  cursor: pointer;
}

.btn-logout:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.navbar-nav .nav-link {
  font-weight: bold;
  color: #fff;
  padding: 10px 15px;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease, letter-spacing 0.2s ease;
}

.navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #ffb100;
  transition: width 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: white;
  letter-spacing: 1.5px;
}

.navbar-nav .nav-link:hover::after {
  width: 100%;
}

.navbar-nav .nav-link.active {
  color: #333;
  background-color: #fff;
  border-radius: 4px;
}

.cart-icon {
  color: #fff;
  transition: color 0.3s, transform 0.2s;
}

.cart-icon:hover {
  color: #ffb100;
  transform: scale(1.1);
}

@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
  }
}
</style>
