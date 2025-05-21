<template>
  <div class="select-service-container card border-0 p-4">
    <h3 id="service-heading" class="text-warning fw-bold mb-4 text-center">Selecciona un Servicio</h3>
    
    <div class="row g-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="col-12 col-sm-6 col-md-6"
      >
        <div
          @click="selectService(service)"
          @keydown.enter="selectService(service)"
          @keydown.space.prevent="selectService(service)"
          :class="[
            'service-item d-flex justify-content-between align-items-center p-3 rounded shadow-sm w-100',
            { 'active-service': selectedService?.id === service.id }
          ]"
          tabindex="0"
          role="button"
          :aria-pressed="selectedService?.id === service.id"
          :aria-label="`Seleccionar servicio: ${service.name}, precio: ${service.price} euros`"
        >
          <span class="fw-bold me-2">{{ service.name }}</span>
          <span class="badge bg-dark text-warning fs-6">{{ service.price }}€</span>
        </div>
      </div>
    </div>
    
    <div v-if="services.length === 0" class="alert alert-warning mt-3" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      No hay servicios disponibles
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
      // Emitir un evento para notificar que un servicio ha sido seleccionado
      // Esto permitirá al componente padre (bookingForm) habilitar el botón siguiente
      this.$emit("serviceSelected", true);
    },
  },
};
</script>

<style scoped>
.select-service-container {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.service-item {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.2s ease-in-out;
  height: 80px;
  cursor: pointer;
  overflow: hidden;
}

.service-item span:first-child {
  white-space: normal;
  overflow-wrap: break-word;
  flex: 1;
  min-width: 0;
}

.service-item span:last-child {
  flex-shrink: 0;
  white-space: nowrap;
}

.service-item:hover,
.service-item:focus {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.service-item:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

.active-service {
  background-color: #ffd700 !important;
  border-color: #ffaa00 !important;
  color: #212529;
  font-weight: 600;
}

.active-service .badge {
  background-color: #212529 !important;
}
</style>