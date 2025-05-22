<template>
  <div class="select-service-container">
    <div class="container-fluid p-0">

      <!-- Estado de carga -->
      <div v-if="loading" class="row justify-content-center" role="status" aria-live="polite">
        <div class="col-12">
          <div class="text-center p-3">
            <div 
              class="spinner-border text-warning mb-2" 
              style="width: 2rem; height: 2rem;"
              aria-label="Cargando servicios"
            >
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-white-50 mb-0 small">Cargando servicios...</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="row" role="alert" aria-live="assertive">
        <div class="col-12">
          <div class="alert alert-danger d-flex align-items-center justify-content-between p-2">
            <div class="d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
              <small>{{ error }}</small>
            </div>
            <button 
              @click="fetchServices" 
              class="btn btn-outline-light btn-sm"
              aria-label="Reintentar cargar servicios"
            >
              <i class="bi bi-arrow-clockwise" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de servicios compacta -->
      <div v-else class="row g-2" role="group" aria-label="Lista de servicios disponibles">
        <div 
          v-for="(service, index) in services"
          :key="service.id"
          class="col-12"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div 
            @click="selectService(service)"
            @keydown.enter="selectService(service)"
            @keydown.space.prevent="selectService(service)"
            class="service-card h-100 border-0 p-2"
            :class="{
              'service-active': selectedService?.id === service.id
            }"
            tabindex="0"
            role="button"
            :aria-pressed="selectedService?.id === service.id"
            :aria-label="`${selectedService?.id === service.id ? 'Deseleccionar' : 'Seleccionar'} servicio ${service.name}, precio ${service.price} euros`"
          >
            <div class="d-flex align-items-center justify-content-between">
              <!-- Información del servicio -->
              <div class="service-info flex-grow-1 me-3">
                <h6 class="service-name text-white fw-bold mb-1">
                  {{ service.name }}
                </h6>
                <div v-if="service.description" class="service-description">
                  <small class="text-white-50 d-block">
                    {{ service.description }}
                  </small>
                </div>
                <div v-if="service.duration" class="service-duration">
                  <small class="text-warning d-block">
                    <i class="bi bi-clock me-1" aria-hidden="true"></i>
                    {{ formatDuration(service.duration) }}
                  </small>
                </div>
              </div>

              <!-- Precio y estado -->
              <div class="service-price-section d-flex flex-column align-items-end">
                <div class="price-badge mb-1">
                  <span class="badge bg-warning text-dark fw-bold px-2 py-1">
                    {{ service.price }}€
                  </span>
                </div>
                <div class="selection-indicator">
                  <i 
                    class="selection-icon" 
                    :class="selectedService?.id === service.id ? 'bi bi-check-circle-fill text-warning' : 'bi bi-circle text-white-50'"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="!loading && !error && services.length === 0" class="row" role="status" aria-live="polite">
        <div class="col-12">
          <div class="alert alert-info text-center p-3">
            <i class="bi bi-info-circle mb-2" aria-hidden="true"></i>
            <p class="small mb-2">No hay servicios disponibles</p>
            <button 
              @click="fetchServices" 
              class="btn btn-outline-info btn-sm"
              aria-label="Actualizar lista de servicios"
            >
              <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Información de selección para lectores de pantalla -->
      <div v-if="selectedService" class="visually-hidden" role="status" aria-live="polite">
        Servicio seleccionado: {{ selectedService.name }}, precio: {{ selectedService.price }} euros
        <span v-if="selectedService.duration">, duración: {{ formatDuration(selectedService.duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'SelectService',
  props: {
    selectedService: {
      type: Object,
      default: null
    },
  },
  emits: ['selectService', 'serviceSelected'],
  data() {
    return {
      services: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchServices();
  },
  methods: {
    async fetchServices() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get("http://localhost:8000/api/services/");
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Formato de respuesta inválido");
        }
        
        this.services = response.data;
      } catch (error) {
        console.error("Error fetching services:", error);
        this.error = error.response?.data?.message || "Error al cargar servicios";
      } finally {
        this.loading = false;
      }
    },
    
    selectService(service) {
      this.$emit('selectService', service);
      this.$emit('serviceSelected', true);
      
      // Anunciar cambio para accesibilidad
      this.$nextTick(() => {
        const durationText = service.duration ? `, duración ${this.formatDuration(service.duration)}` : '';
        const announcement = `Servicio ${service.name} seleccionado, precio ${service.price} euros${durationText}`;
        this.announceToScreenReader(announcement);
      });
    },
    
    announceToScreenReader(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'visually-hidden';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },

    formatDuration(isoDuration) {
      // Si ya viene en formato simple (ej: "30", "45"), asumimos que son minutos
      if (/^\d+$/.test(isoDuration)) {
        return `${isoDuration}min`;
      }
      
      // Formato ISO 8601: PT30M, PT1H30M, etc.
      const match = isoDuration.match(
        /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
      );
      
      if (!match) return isoDuration;
      
      const days = match[1] ? parseInt(match[1]) : 0;
      const hours = match[2] ? parseInt(match[2]) : 0;
      const minutes = match[3] ? parseInt(match[3]) : 0;
      const seconds = match[4] ? parseInt(match[4]) : 0;
      
      let parts = [];
      
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}min`);
      if (seconds > 0 && hours === 0 && minutes === 0) {
        // Solo mostrar segundos si no hay horas/minutos
        parts.push(`${seconds}s`);
      }
      
      return parts.join(' ') || '0min';
    }
  },
};
</script>

<style scoped>
/* Contenedor principal compacto */
.select-service-container {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  min-height: 200px;
  max-height: 65vh;
  overflow-y: auto;
}

/* Scroll personalizado */
.select-service-container::-webkit-scrollbar {
  width: 6px;
}

.select-service-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.select-service-container::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 3px;
}

.select-service-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.5);
}

/* Título compacto */
.section-title {
  font-size: 1.4rem;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  margin-bottom: 0;
}

/* Cards de servicio compactas */
.service-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)) !important;
  border: 1px solid rgba(255, 215, 0, 0.15) !important;
  backdrop-filter: blur(15px);
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-height: 70px;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.08), transparent);
  transition: left 0.4s ease;
  z-index: 0;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2) !important;
  border-color: rgba(255, 215, 0, 0.3) !important;
}

.service-card:hover::before {
  left: 100%;
}

.service-card:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

.service-card > div {
  position: relative;
  z-index: 1;
}

/* Servicio activo */
.service-active {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.08)) !important;
  border-color: rgba(255, 215, 0, 0.4) !important;
  box-shadow: 0 6px 15px rgba(255, 215, 0, 0.25) !important;
}

.service-active .service-name {
  color: #ffd700 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Información del servicio */
.service-info {
  min-width: 0;
}

.service-name {
  font-size: 0.9rem;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.service-description {
  max-height: 2.4em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.65) !important;
}

/* Sección de precio */
.service-price-section {
  flex-shrink: 0;
  min-width: 60px;
}

.price-badge .badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 0.3rem 0.5rem;
  border-radius: 12px;
  white-space: nowrap;
}

.selection-icon {
  font-size: 1.1rem;
  transition: all 0.25s ease;
}

.service-active .selection-icon {
  transform: scale(1.1);
}

/* Estados de error y vacío compactos */
.alert-danger {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.12), rgba(220, 53, 69, 0.08));
  border: 1px solid rgba(220, 53, 69, 0.25);
  color: #ff6b7a;
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.alert-info {
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.12), rgba(13, 202, 240, 0.08));
  border: 1px solid rgba(13, 202, 240, 0.25);
  color: #7dd3fc;
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

/* Animaciones suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-card {
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

/* Responsive optimizado para espacios reducidos */
@media (max-width: 575.98px) {
  .select-service-container {
    padding: 0.75rem;
    border-radius: 8px;
    max-height: 55vh;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .service-card {
    min-height: 65px;
    padding: 0.5rem !important;
  }
  
  .service-name {
    font-size: 0.8rem;
  }
  
  .service-description small {
    font-size: 0.7rem;
  }
  
  .price-badge .badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
  
  .selection-icon {
    font-size: 1rem;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .service-card {
    min-height: 68px;
  }
  
  .service-name {
    font-size: 0.85rem;
  }
}

@media (min-width: 768px) {
  .select-service-container {
    max-height: 70vh;
  }
  
  .service-card {
    min-height: 75px;
  }
  
  .service-name {
    font-size: 0.95rem;
  }
  
  .price-badge .badge {
    font-size: 0.8rem;
    padding: 0.35rem 0.6rem;
  }
}

/* Orientación paisaje en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  .select-service-container {
    padding: 0.5rem;
    max-height: 75vh;
  }
  
  .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .service-card {
    min-height: 55px;
    padding: 0.4rem !important;
  }
  
  .service-name {
    font-size: 0.75rem;
  }
  
  .service-description {
    max-height: 1.2em;
    -webkit-line-clamp: 1;
  }
  
  .price-badge .badge {
    font-size: 0.65rem;
    padding: 0.15rem 0.3rem;
  }
}

/* Preferencias de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .service-card,
  .selection-icon {
    transition: none !important;
  }
  
  .service-card:hover {
    transform: none !important;
  }
  
  .service-card::before {
    display: none;
  }
  
  .service-card {
    animation: none !important;
    opacity: 1 !important;
  }
}

@media (prefers-contrast: high) {
  .service-card {
    border: 2px solid #ffd700 !important;
    background: rgba(0, 0, 0, 0.85) !important;
  }
  
  .service-name {
    color: #ffffff !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .text-white-50 {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  
  .service-active {
    background: rgba(255, 215, 0, 0.2) !important;
    border-color: #ffd700 !important;
  }
}

/* Dispositivos táctiles */
@media (hover: none) and (pointer: coarse) {
  .service-card:hover {
    transform: none;
  }
  
  .service-card {
    min-height: 75px;
  }
  
  .price-badge .badge {
    padding: 0.4rem 0.6rem;
  }
}

/* Scrollbar para Firefox */
.select-service-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) rgba(255, 255, 255, 0.1);
}

/* Texto largo optimizado */
.service-description small {
  line-height: 1.3;
  word-spacing: -0.05em;
}

@media (max-width: 575.98px) {
  .service-description small {
    line-height: 1.2;
    font-size: 0.65rem;
  }
}
</style>