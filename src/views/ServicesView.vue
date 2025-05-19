<template>
  <div  id="services" class=" text-white min-vh-100 py-5">
    <div class="container">
      <div class="hero-section text-center py-5">
      <h1 class="growstudio-title mb-4">Servicios</h1>
    </div>

      <!-- Grid de Servicios -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div 
          class="col"
          v-for="(service, index) in services"
          :key="index"
        >
          <div class="card bg-black text-white h-100 border-0 shadow-lg hover-shadow transition-all">
            <!-- Imagen -->
            <div class="ratio ratio-16x9 position-relative">
              <img 
                :src="service.image" 
                :alt="service.title"
                class="object-fit-cover"
              >
              <div class="position-absolute top-0 start-0 m-3">
                <span class="badge bg-warning text-dark fs-6 px-3 py-2">
                  {{ service.category }}
                </span>
              </div>
            </div>

            <!-- Contenido -->
            <div class="card-body p-4 d-flex flex-column">
              <h3 class="card-title mb-3">{{ service.title }}</h3>
              <p class="card-text text-white-60 flex-grow-1">
                {{ service.description }}
              </p>
              
              <!-- Detalles -->
              <div class="d-flex justify-content-between align-items-center border-top border-warning pt-3">
                <div class="d-flex align-items-center gap-2 text-warning">
                  <i class="bi bi-clock fs-5"></i>
                  <span>{{ formatDuration(service.duration) }}</span>


                </div>
                <span class="text-warning fw-bold fs-5">
                  €{{ service.price }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'


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

const services = ref<any[]>([])

const fetchServices = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/services/')
    services.value = res.data
  } catch (err) {
    console.error('Error al cargar servicios:', err)
  }
}



onMounted(fetchServices)
</script>


<style>
#services{
  background: radial-gradient(circle at top, #1a1a1a, #121212);

}
/* Solo necesario para transiciones (opcional) */
.hover-shadow {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 193, 7, 0.1) !important;
}
</style>