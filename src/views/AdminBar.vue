<template>
  <nav v-if="role === 'A'" class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      ></button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#">Panel de Administrador</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Añadir Evento</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Añadir Producto</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div v-if="role === 'A'" class="bg-warning text-dark py-2 text-center fw-semibold shadow-sm">
    ⚠️ Estás conectado como <strong>Administrador</strong>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const role = computed(() => userStore.role);
</script>
