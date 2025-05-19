<template>
  <nav id="navbar" class="navbar navbar-expand-lg navbar-dark  fixed-top shadow-sm">
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

      <!-- Cart Icon -->
      <router-link to="/cart" class="d-flex align-items-center">
        <i class="bi bi-cart-fill fs-3 text-light"></i>
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
});
</script>

<style scoped>
#navbar{
  background-color: black;
}
.navbar {
  height: 80px; /* Fixed height */
  z-index: 1000;
}

.navbar-toggler {
  background-color: #ffb100; /* Light color for the hamburger menu button */
}

.navbar-nav .nav-link {
  font-weight: bold;
  color: #fff;
  padding: 10px 15px;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease, letter-spacing 0.2s ease;
}

.navbar-nav .nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #ffb100;
  transition: width 0.2s ease;
}

.navbar-nav .nav-link:hover {
  color: white;
  letter-spacing: 2px;
}

.navbar-nav .nav-link:hover::before {
  width: 100%; /* Line appears when hovering */
}

.navbar-nav .nav-link.active {
  color: #333;
  background-color: #fff;
}

.cart-icon {
  color: #fff;
  transition: color 0.3s;
}

.cart-icon:hover {
  color: #ccc;
}

/* Estilos para el logo dentro de un círculo */
.logo-container {
  background-color: #fff; /* Fondo blanco */
  border-radius: 50%; /* Hace el círculo */
  padding: 5px; /* Espaciado entre el borde y la imagen */
  display: inline-block;
}

.navbar-brand img {
  max-height: 60px; /* Ajusta el tamaño del logo */
  width: auto; /* Mantiene la proporción del logo */
}

@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
  }
}
</style>
