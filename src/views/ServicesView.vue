<template>
  <section id="services" class="text-white py-5">
    <div class="container">
      <header class="text-center mb-5">
        <h1 class="growstudio-title display-3 fw-bold text-warning mb-3">Servicios</h1>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <p class="lead text-white-50">Descubre nuestra amplia gama de servicios profesionales diseñados para ayudarte a alcanzar tus objetivos.</p>
          </div>
        </div>
      </header>

      <div v-if="loading" class="d-flex justify-content-center my-5" aria-live="polite">
        <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Cargando servicios...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
        <div>{{ error }}</div>
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div
          class="col"
          v-for="(service, index) in services"
          :key="index"
        >
          <article class="card service-card bg-black text-white h-100 border-0 shadow-lg hover-shadow">
            <div class="card-img-container position-relative overflow-hidden">
              <div class="ratio ratio-16x9">
                <img
                  :src="service.image"
                  :alt="service.title"
                  class="object-fit-cover"
                  loading="lazy"
                >
              </div>
              <div class="position-absolute top-0 start-0 m-3">
                <span class="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                  {{ service.category }}
                </span>
              </div>
              <div class="card-img-overlay d-flex align-items-end p-0 bg-gradient-dark opacity-0 hover-show">
                <div class="w-100 p-3 text-center">
                  <router-link to="/reserva" class="btn btn-warning fw-semibold">
                    <i class="bi bi-calendar-check me-2" aria-hidden="true"></i>
                    Reservar ahora
                  </router-link>
                </div>
              </div>
            </div>
            
            <div class="card-body p-4 d-flex flex-column">
              <h2 class="card-title h4 mb-3 fw-bold">{{ service.name }}</h2>
              <p class="card-text text-white-50 mb-4">
                {{ service.description }}
              </p>
              
              <div class="d-flex justify-content-between align-items-center border-top border-warning pt-3 mt-auto">
                <div class="d-flex align-items-center gap-2 text-warning">
                  <i class="bi bi-clock fs-5" aria-hidden="true"></i>
                  <span>{{ formatDuration(service.duration) }}</span>
                </div>
                <span class="text-warning fw-bold fs-5">
                  €{{ service.price }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-if="!loading && !error && services.length === 0" class="text-center my-5">
        <div class="alert alert-info" role="alert">
          No hay servicios disponibles en este momento.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Variables reactivas
const services = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Formatear duración ISO a formato legible
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(
    /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  )
  if (!match) return isoDuration
  
  const days = match[1] ? parseInt(match[1]) : 0
  const hours = match[2] ? parseInt(match[2]) : 0
  const minutes = match[3] ? parseInt(match[3]) : 0
  const seconds = match[4] ? parseInt(match[4]) : 0
  
  let parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}min`)
  if (seconds > 0 && hours === 0 && minutes === 0) {
    // Solo mostrar segundos si no hay horas/minutos
    parts.push(`${seconds}s`)
  }
  
  return parts.join(' ') || '0min'
}

// Obtener servicios del backend (sin autenticación)
const fetchServices = async () => {
  try {
    // Configuración de axios sin headers de autenticación
    const config = {
      timeout: 10000, // Timeout de 10 segundos
      headers: {
        'Content-Type': 'application/json',
      }
    }
    
    const res = await axios.get('http://localhost:8000/api/services/', config)
    services.value = res.data
  } catch (err: any) {
    console.error('Error al cargar servicios:', err)
    
    // Manejo específico de errores
    if (err.code === 'ECONNABORTED') {
      error.value = 'Tiempo de espera agotado. Verifica tu conexión.'
    } else if (err.response?.status === 401) {
      error.value = 'No tienes permisos para ver los servicios.'
    } else if (err.response?.status === 404) {
      error.value = 'Servicios no encontrados.'
    } else if (err.response?.status >= 500) {
      error.value = 'Error del servidor. Inténtalo más tarde.'
    } else {
      error.value = 'Error al cargar servicios: ' + (err.message || 'Desconocido')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
#services {
  background: radial-gradient(circle at top, #070707, #181818);
  min-height: 100vh;
}

/* Tarjetas de servicio */
.service-card {
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-img-container {
  position: relative;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(255, 193, 7, 0.15) !important;
}

/* Efectos de imagen */
.bg-gradient-dark {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  transition: opacity 0.3s ease;
}

.hover-show {
  transition: opacity 0.3s ease;
}

.service-card:hover .hover-show {
  opacity: 1 !important;
}

/* Colores y estilos de texto */
.text-white-50 {
  color: rgba(255, 255, 255, 0.7);
}

.growstudio-title {
  text-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
  letter-spacing: 1px;
}

/* Botones */
.btn-warning {
  color: #1a1a1a;
  background-color: #ffd700;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-warning:hover {
  background-color: #ffaa00;
  transform: translateY(-2px);
}

.btn-warning:active {
  transform: translateY(0);
}

/* Mejoras de accesibilidad para foco */
.btn-warning:focus,
.btn-warning:focus-visible {
  outline: 3px solid rgba(255, 215, 0, 0.6);
  outline-offset: 2px;
  box-shadow: none;
}

/* Soporte para modo oscuro y alto contraste */
@media (prefers-contrast: high) {
  .text-white-50 {
    color: white;
  }
  
  .btn-warning {
    border: 2px solid #000;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .growstudio-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 1.25rem;
  }
  
  .growstudio-title {
    font-size: 2rem;
  }
}
</style>