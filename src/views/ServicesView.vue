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
                  <span>{{ service.duration }}</span>
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ServicesView',
  data() {
    return {
  "services": [
    {
      "id": 1,
      "category": "CORTE",
      "title": "Corte Completo",
      "description": "Estilo moderno con técnicas profesionales",
      "price": 14,
      "duration": "45 min",
      "image": 'src/assets/img/curso1.png'
    },
    {
      "id": 2,
      "category": "CORTE + BARBA",
      "title": "Corte Completo + Barba",
      "description": "Acompañado de arreglo de barba profesional",
      "price": 19,
      "duration": "60 min",
      "image": 'src/assets/img/curso2.png'
    },
    {
      "id": 3,
      "category": "BARBA",
      "title": "Arreglo de Barba",
      "description": "Modelado y acabado perfecto",
      "price": 8,
      "duration": "30 min",
      "image": 'src/assets/img/curso3.png'
    },
    {
      "id": 4,
      "category": "CORTE",
      "title": "Corte Clásico",
      "description": "Estilo tradicional atemporal",
      "price": 12,
      "duration": "40 min",
      "image": 'src/assets/img/curso7.png'
    },
    {
      "id": 5,
      "category": "COLOR",
      "title": "Mechas profesionales",
      "description": "Técnicas de mechas californianas",
      "price": 20,
      "duration": "90 min",
      "image": 'src/assets/img/curso4.png'
    },
    {
      "id": 6,
      "category": "COLOR",
      "title": "Tinte y Color",
      "description": "Coloración completa con productos premium",
      "price": 20,
      "duration": "120 min",
      "image": 'src/assets/img/curso5.png'
    },
    {
      "id": 7,
      "category": "TRATAMIENTO",
      "title": "Decoloración",
      "description": "Servicio profesional de decoloración",
      "price": 10,
      "duration": "60 min",
      "image": 'src/assets/img/curso6.png'
    }
  ]
}
  }
});
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