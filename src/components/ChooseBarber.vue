<template>
  <div class="select-barber-container">
    <div class="container-fluid p-0">
      <!-- Título compacto -->
      <div class="row mb-3">
        <div class="col-12">
          <h2 class="text-warning fw-bold text-center section-title">
            Selecciona un Barbero
          </h2>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="row justify-content-center" role="status" aria-live="polite">
        <div class="col-12">
          <div class="text-center p-3">
            <div 
              class="spinner-border text-warning mb-2" 
              style="width: 2rem; height: 2rem;"
              aria-label="Cargando barberos"
            >
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-white-50 mb-0 small">Cargando barberos...</p>
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
              @click="fetchBarbers" 
              class="btn btn-outline-light btn-sm"
              aria-label="Reintentar cargar barberos"
            >
              <i class="bi bi-arrow-clockwise" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Grid de barberos compacto -->
      <div v-else class="row g-2" role="group" aria-label="Lista de barberos disponibles">
        <div 
          v-for="(barber, index) in barbers"
          :key="barber.id"
          class="col-6 col-lg-4"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="card barber-card h-100 border-0">
            <div class="card-body p-2 d-flex flex-column text-center">
              <!-- Avatar compacto -->
              <div class="mb-2">
                <div 
                  class="barber-avatar mx-auto d-flex align-items-center justify-content-center rounded-circle"
                  role="img"
                  :aria-label="`Avatar de ${barber.user}`"
                >
                  <i class="bi bi-person-fill text-warning" aria-hidden="true"></i>
                </div>
              </div>

              <!-- Nombre -->
              <h6 class="card-title text-white fw-bold mb-1 flex-shrink-0">
                {{ barber.user }}
              </h6>

              <!-- Información compacta -->
              <div class="card-text flex-grow-1 mb-2">
                <div v-if="barber.especialidad" class="mb-1">
                  <small class="badge bg-warning text-dark rounded-pill px-2 py-1">
                    {{ barber.especialidad }}
                  </small>
                </div>
                <div v-if="barber.experiencia" class="mb-1">
                  <small class="text-white-50 d-block">
                    <i class="bi bi-award me-1" aria-hidden="true"></i>
                    {{ barber.experiencia }}a
                  </small>
                </div>
                <div v-if="barber.rating" class="mb-1">
                  <small class="text-warning d-block">
                    <i class="bi bi-star-fill me-1" aria-hidden="true"></i>
                    {{ barber.rating }}
                    <span class="text-white-50">({{ barber.reviews || 0 }})</span>
                  </small>
                </div>
              </div>

              <!-- Botón compacto -->
              <button
                @click="selectBarber(barber)"
                @keydown.enter="selectBarber(barber)"
                @keydown.space.prevent="selectBarber(barber)"
                class="btn btn-sm w-100 mt-auto"
                :class="{
                  'btn-warning text-dark fw-bold': selectedBarber?.id === barber.id,
                  'btn-outline-warning': selectedBarber?.id !== barber.id
                }"
                :aria-pressed="selectedBarber?.id === barber.id"
                :aria-label="`${selectedBarber?.id === barber.id ? 'Deseleccionar' : 'Seleccionar'} barbero ${barber.user}`"
                type="button"
              >
                <i 
                  class="me-1" 
                  :class="selectedBarber?.id === barber.id ? 'bi bi-check-circle-fill' : 'bi bi-circle'"
                  aria-hidden="true"
                ></i>
                <span class="d-none d-md-inline">
                  {{ selectedBarber?.id === barber.id ? 'Seleccionado' : 'Seleccionar' }}
                </span>
                <span class="d-md-none">
                  {{ selectedBarber?.id === barber.id ? '✓' : 'Elegir' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="!loading && !error && barbers.length === 0" class="row" role="status" aria-live="polite">
        <div class="col-12">
          <div class="alert alert-info text-center p-3">
            <i class="bi bi-info-circle mb-2" aria-hidden="true"></i>
            <p class="small mb-2">No hay barberos disponibles</p>
            <button 
              @click="fetchBarbers" 
              class="btn btn-outline-info btn-sm"
              aria-label="Actualizar lista de barberos"
            >
              <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Información de selección para lectores de pantalla -->
      <div v-if="selectedBarber" class="visually-hidden" role="status" aria-live="polite">
        Barbero seleccionado: {{ selectedBarber.user }}
        <span v-if="selectedBarber.especialidad">, especialidad: {{ selectedBarber.especialidad }}</span>
        <span v-if="selectedBarber.experiencia">, {{ selectedBarber.experiencia }} años de experiencia</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'SelectBarber',
  props: {
    selectedBarber: {
      type: Object,
      default: null
    },
  },
  emits: ['selectBarber'],
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
      this.loading = true;
      this.error = null;
      
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
        this.error = error.response?.data?.message || "Error al cargar barberos";
        
        if (error.response?.status === 401) {
          this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },
    
    selectBarber(barber) {
      this.$emit('selectBarber', barber);
      
      // Anunciar cambio para accesibilidad
      this.$nextTick(() => {
        const announcement = `Barbero ${barber.user} seleccionado`;
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
    }
  },
};
</script>

<style scoped>
/* Contenedor principal compacto */
.select-barber-container {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  min-height: 200px;
  max-height: 70vh;
  overflow-y: auto;
}

/* Scroll personalizado */
.select-barber-container::-webkit-scrollbar {
  width: 6px;
}

.select-barber-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.select-barber-container::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 3px;
}

.select-barber-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.5);
}

/* Título compacto */
.section-title {
  font-size: 1.5rem;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  margin-bottom: 0;
}

/* Cards de barbero compactas */
.barber-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)) !important;
  border: 1px solid rgba(255, 215, 0, 0.15) !important;
  backdrop-filter: blur(15px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 160px;
  border-radius: 10px;
}

.barber-card::before {
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

.barber-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2) !important;
  border-color: rgba(255, 215, 0, 0.3) !important;
}

.barber-card:hover::before {
  left: 100%;
}

.barber-card .card-body {
  position: relative;
  z-index: 1;
}

/* Avatar compacto */
.barber-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 170, 0, 0.15));
  border: 2px solid rgba(255, 215, 0, 0.3);
  transition: all 0.25s ease;
}

.barber-avatar i {
  font-size: 1.3rem;
}

.barber-card:hover .barber-avatar {
  transform: scale(1.05);
  border-color: rgba(255, 215, 0, 0.5);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 170, 0, 0.2));
}

/* Texto compacto */
.card-title {
  font-size: 0.9rem;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.65) !important;
}

/* Botones compactos */
.barber-card .btn {
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  min-height: 32px;
  padding: 0.25rem 0.5rem;
}

.btn-outline-warning {
  border: 1.5px solid #ffd700;
  color: #ffd700;
  background: transparent;
}

.btn-outline-warning:hover,
.btn-outline-warning:focus {
  background-color: rgba(255, 215, 0, 0.08);
  border-color: #ffaa00;
  color: #ffaa00;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(255, 215, 0, 0.25);
}

.btn-warning {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #1a1a1a;
  box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);
}

.btn-warning:hover,
.btn-warning:focus {
  background-color: #ffaa00;
  border-color: #ffaa00;
  color: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
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

/* Badges compactos */
.badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  padding: 0.2rem 0.4rem;
}

/* Animaciones suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.barber-card {
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

/* Responsive optimizado para espacios reducidos */
@media (max-width: 575.98px) {
  .select-barber-container {
    padding: 0.75rem;
    border-radius: 8px;
    max-height: 60vh;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .barber-card {
    min-height: 140px;
  }
  
  .barber-avatar {
    width: 35px;
    height: 35px;
  }
  
  .barber-avatar i {
    font-size: 1.1rem;
  }
  
  .card-title {
    font-size: 0.8rem;
  }
  
  .btn {
    font-size: 0.7rem;
    min-height: 28px;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .barber-card {
    min-height: 150px;
  }
  
  .barber-avatar {
    width: 40px;
    height: 40px;
  }
  
  .barber-avatar i {
    font-size: 1.2rem;
  }
}

@media (min-width: 768px) {
  .select-barber-container {
    max-height: 75vh;
  }
  
  .barber-card {
    min-height: 170px;
  }
  
  .barber-avatar {
    width: 50px;
    height: 50px;
  }
  
  .barber-avatar i {
    font-size: 1.4rem;
  }
  
  .card-title {
    font-size: 0.95rem;
  }
  
  .btn {
    font-size: 0.8rem;
    min-height: 34px;
  }
}

/* Orientación paisaje en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  .select-barber-container {
    padding: 0.5rem;
    max-height: 80vh;
  }
  
  .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .barber-card {
    min-height: 120px;
  }
  
  .barber-avatar {
    width: 30px;
    height: 30px;
  }
  
  .barber-avatar i {
    font-size: 1rem;
  }
  
  .card-title {
    font-size: 0.75rem;
  }
  
  .btn {
    font-size: 0.65rem;
    min-height: 24px;
  }
}

/* Preferencias de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .barber-card,
  .barber-avatar,
  .btn {
    transition: none !important;
  }
  
  .barber-card:hover {
    transform: none !important;
  }
  
  .barber-card::before {
    display: none;
  }
  
  .barber-card {
    animation: none !important;
    opacity: 1 !important;
  }
}

@media (prefers-contrast: high) {
  .barber-card {
    border: 2px solid #ffd700 !important;
    background: rgba(0, 0, 0, 0.85) !important;
  }
  
  .card-title {
    color: #ffffff !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .btn-outline-warning {
    border-width: 2px;
  }
  
  .text-white-50 {
    color: rgba(255, 255, 255, 0.85) !important;
  }
}

/* Dispositivos táctiles */
@media (hover: none) and (pointer: coarse) {
  .barber-card:hover {
    transform: none;
  }
  
  .btn {
    min-height: 36px;
  }
}

/* Scrollbar para Firefox */
.select-barber-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) rgba(255, 255, 255, 0.1);
}
</style>