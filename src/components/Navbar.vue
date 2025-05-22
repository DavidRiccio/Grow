<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark fixed-top bg-black border-bottom border-dark-subtle"
    aria-label="Navegación principal"
  >
    <div class="container-fluid px-3 px-lg-5">
      <router-link
        to="/"
        class="navbar-brand me-0 me-lg-4 text-warning fw-bold d-flex align-items-center"
      >
        <span class="d-none d-lg-inline">Grow</span>
      </router-link>

      <button
        class="navbar-toggler border-secondary shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Alternar navegación"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-lg-center" id="navbarNav">
        <ul class="navbar-nav py-3 py-lg-0">
          <li class="nav-item my-1 my-lg-0 mx-lg-2">
            <router-link
              to="/"
              class="nav-link text-light fw-semibold px-3 py-2 rounded-pill text-center"
              active-class="active"
            >
              <i class="bi bi-house-door me-2 d-lg-none"></i>Inicio
            </router-link>
          </li>
          <li class="nav-item my-1 my-lg-0 mx-lg-2">
            <router-link
              to="/products"
              class="nav-link text-light fw-semibold px-3 py-2 rounded-pill text-center"
              active-class="active"
            >
              <i class="bi bi-box-seam me-2 d-lg-none"></i>Productos
            </router-link>
          </li>
          <li class="nav-item my-1 my-lg-0 mx-lg-2">
            <router-link
              to="/services"
              class="nav-link text-light fw-semibold px-3 py-2 rounded-pill text-center"
              active-class="active"
            >
              <i class="bi bi-tools me-2 d-lg-none"></i>Servicios
            </router-link>
          </li>
          <li class="nav-item my-1 my-lg-0 mx-lg-2">
            <router-link
              to="/events"
              class="nav-link text-light fw-semibold px-3 py-2 rounded-pill text-center"
              active-class="active"
            >
              <i class="bi bi-calendar-event me-2 d-lg-none"></i>Eventos
            </router-link>
          </li>
          <!-- Enlace a la ruta /admin solo si el rol es ADMIN -->
          <li class="nav-item my-1 my-lg-0 mx-lg-2" v-if="userStore.user?.role === 'A'">
            <router-link
              to="/admin"
              class="nav-link text-light fw-semibold px-3 py-2 rounded-pill text-center"
              active-class="active"
            >
              <i class="bi bi-shield-lock me-2 d-lg-none"></i>Admin
            </router-link>
          </li>
        </ul>
      </div>

      <div class="d-flex align-items-center ms-auto">
        <div v-if="userStore.isAuthenticated" class="d-flex align-items-center me-3">
          <span
            class="d-inline-flex justify-content-center align-items-center rounded-circle bg-warning text-dark me-2"
            style="width: 28px; height: 28px"
          >
            {{ userStore.user?.username?.charAt(0).toUpperCase() || "U" }}
          </span>
          <span class="d-none d-sm-inline text-light">{{ userStore.user?.username }}</span>
          <button
            @click="userStore.logout"
            class="btn btn-link text-warning ms-2 p-0"
            aria-label="Cerrar sesión"
          >
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>

        <router-link
          v-else
          to="/login"
          class="btn btn-outline-warning btn-sm rounded-pill px-3 me-3"
        >
          <i class="bi bi-person me-1"></i>
          <span class="d-none d-sm-inline">Iniciar sesión</span>
        </router-link>

        <router-link
          to="/cart"
          class="btn btn-warning position-relative rounded-circle p-2 d-flex justify-content-center align-items-center"
          aria-label="Carrito de compras"
          style="width: 38px; height: 38px"
        >
          <i class="bi bi-cart-fill"></i>
          <span
            v-if="cartItemCount > 0"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ cartItemCount > 9 ? "9+" : cartItemCount }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
// Variable reactiva para la cantidad de elementos en el carrito
const cartItemCount = ref(0);

// Función para establecer los elementos del carrito (esto se debería adaptar a tu store real)
onMounted(async () => {
  userStore.initialize();
  if (userStore.isAuthenticated && !userStore.user) {
    await userStore.fetchUser();
  }

  // Simulando que obtenemos los items del carrito desde algún lugar
  // Este valor deberías adaptarlo según tu implementación real
  cartItemCount.value = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems")).length
    : 0;
});
</script>

<style scoped>
.navbar {
  height: 70px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  z-index: 1030;
}

/* Animación para el menú móvil */
@media (max-width: 991.98px) {
  .navbar-collapse {
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid #333;
  }
}

/* Estilo para enlaces de navegación */
.nav-link {
  transition: all 0.3s ease;
  position: relative;
}

.nav-link.active {
  color: #ffb100 !important;
  background-color: rgba(255, 177, 0, 0.15);
}

.nav-link:hover:not(.active) {
  color: #ffb100 !important;
  background-color: rgba(255, 255, 255, 0.05);
}

/* Estilo para botones */
.btn-outline-warning {
  --bs-btn-color: #ffb100;
  --bs-btn-border-color: #ffb100;
  --bs-btn-hover-bg: #ffb100;
  --bs-btn-hover-border-color: #ffb100;
  --bs-btn-hover-color: #000;
  --bs-btn-active-bg: #cc8e00;
}

.btn-warning {
  background-color: #ffb100;
  border-color: #ffb100;
  color: #000;
}

.btn-warning:hover {
  background-color: #cc8e00;
  border-color: #cc8e00;
}

/* Estilo para la badge */
.badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25em 0.45em;
}
</style>
