<template>
  <div class="container-fluid">
    <div class="row col-12">
      <nav class="navbar navbar-light bg-white fixed-top shadow-sm mb-5">
        <div class="container d-flex align-items-center position-relative">
          <!-- Logo -->
          <div class="logo-container start-0">
            <router-link to="/" class="text-decoration-none text-dark">
              <img src="../assets/img/Logo principal con tagline.png" alt="Logo" width="60px">
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="navigation-container mx-auto">
            <router-link to="/" class="nav-item text-decoration-none">Inicio</router-link>
            <router-link to="/products" class="nav-item text-decoration-none">Productos</router-link>
            <router-link to="/contact" class="nav-item text-decoration-none">Contacto</router-link>
            <router-link to="/courses" class="nav-item text-decoration-none">Cursos</router-link>
            <router-link to="/haircuts" class="nav-item text-decoration-none">Cortes</router-link>
            <router-link to="/events" class="nav-item text-decoration-none">Eventos</router-link>
          </div>

          <!-- Cart Icon -->
          <div class="cart-container end-0">
            <router-link to="/cart" class="text-decoration-none d-flex align-items-center">
              <i class="bi bi-cart-fill"></i>
            </router-link>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar'
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  height: 80px; /* Altura fija */
}
.logo-container {
  position: absolute;
  left: 0;
}
.navigation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
  background-color: #0e0e0e;
  border-radius: 50px; /* Rounded container */
  transition: all 0.3s;
}
.cart-container {
  position: absolute;
  right: 0;
}
.cart-icon {
  font-size: 1.5rem;
  color: #000;
  transition: color 0.3s;
}
.cart-icon:hover {
  color: #333;
}
.nav-item {
  padding: 10px 15px;
  font-weight: bold;
  color: #ffffff;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 10px;
}

.nav-item:hover {
  background-color: #ffffff;
  color: #333;
}
</style>
