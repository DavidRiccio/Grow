<template>
  <div class="select-barber-container">
    <h3 class="text-warning fw-bold mb-4 text-center">Selecciona un Barbero</h3>
    
    <div v-if="loading" class="text-center text-secondary">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando barberos...</p>
    </div>
    
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>
    
    <div v-else>
      <ul class="list-group">
        <li 
          v-for="barber in barbers" 
          :key="barber.id" 
          class="list-group-item mb-3 rounded shadow-sm d-flex justify-content-between align-items-center"
        >
          <span class="fw-bold">{{ barber.user }}</span>
          <button 
            @click="$emit('selectBarber', barber)" 
            class="btn btn-outline-warning fw-bold"
            :class="{ 'btn-warning text-white': selectedBarber?.id === barber.id }"
          >
            Seleccionar
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    selectedBarber: Object,
  },
  data() {
    return {
      barbers: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchBarbers();
  },
  methods: {
    async fetchBarbers() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No hay token de autenticación");
        }

        const response = await axios.get("http://localhost:8000/api/barbers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Formato de respuesta inválido");
        }

        this.barbers = response.data;
      } catch (error) {
        console.error("Error fetching barbers:", error);
        this.error =
          error.response?.data?.message || "Error al cargar barberos";

        if (error.response?.status === 401) {
          this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.select-barber-container {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.list-group-item {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1.25rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.list-group-item:hover {
  transform: translateY(-3px);
}

.btn-warning {
  background-color: #ffd700;
  border-color: #ffaa00;
}

.btn-warning.text-white:hover {
  background-color: #ffaa00;
  transform: scale(1.05);
}

.alert-danger {
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.2);
}
</style>
