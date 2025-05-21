<template>
  <div class="select-service-container">
    <h3 class="text-warning fw-bold mb-4 text-center">Selecciona un Servicio</h3>
    <div class="row g-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="col-12 col-md-6 d-flex"
      >
        <div
          @click="selectService(service)"
          class="service-item flex-fill d-flex justify-content-between align-items-center cursor-pointer rounded shadow-sm"
          :class="{ 'active-service': selectedService?.id === service.id }"
        >
          <span class="fw-bold">{{ service.name }} </span>
          <span>{{ service.price }}€</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    selectedService: Object,
  },
  data() {
    return {
      services: [],
    };
  },
  created() {
    axios
      .get("http://localhost:8000/api/services/")
      .then((response) => {
        this.services = response.data;
      })
      .catch((error) => {
        console.error("Error cargando servicios:", error);
        alert("No se pudieron cargar los servicios");
      });
  },
  methods: {
    selectService(service) {
      this.$emit("selectService", service);
    },
  },
};
</script>

<style scoped>
.select-service-container {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.service-item {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1.25rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-height: 80px; /* altura fija para uniformidad */
}

.service-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.active-service {
  background-color: #ffd700 !important;
  border-color: #ffaa00 !important;
  color: white;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
