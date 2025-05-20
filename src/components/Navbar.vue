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
        <div v-if="isAuthenticated" class="user-info">
          <span class="text-light me-2">Hola, {{ username }}</span>
          <button @click="handleLogout" class="btn-logout">
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

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Navbar',
  data() {
    return {
      isAuthenticated: false,
      username: ''
    }
  },
  async mounted() {
    await this.checkAuthStatus();
    if (this.isAuthenticated) {
      await this.fetchUsername();
    }
  },
  methods: {
    async checkAuthStatus() {
      this.isAuthenticated = !!localStorage.getItem('authToken');
    },

    async fetchUsername() {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        this.username = response.data.username;
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
        this.handleLogout();
      }
    },

    handleLogout() {
      localStorage.removeItem('authToken');
      this.isAuthenticated = false;
      this.username = '';
      this.$router.push('/login');
    }
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