<template>
  <div class="container-fluid" id="services">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-lg-10">
        <div id="servicesCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div
              class="carousel-item"
              v-for="(service, index) in servicios.cards"
              :key="index"
              :class="{ active: index === 0 }"
            >
              <div class="d-flex justify-content-center align-items-center" style="height: 300px;"> <!-- Ajusta la altura según sea necesario -->
                <img :src="service.image" class="carousel-image" :alt="service.name">
              </div>
              <div class="carousel-caption d-none d-md-block">
                <h5>{{ service.name }}</h5>
                <p>{{ service.description }}</p>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#servicesCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#servicesCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
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
      servicios: {
        title: "Servicios",
        cards: [
          {
            name: "Corte Completo",
            description: "14€",
            image: "src/assets/img/Buzz cut.webp"
          },
          {
            name: "Corte Completo + Barba",
            description: "19€",
            image: "src/assets/img/mullet.webp"
          },
          {
            name: "Barba",
            description: "8€",
            image: "src/assets/img/barba.webp"
          },
          {
            name: "Corte Clasico",
            description: "12€",
            image: "src/assets/img/corte Clasico.webp"
          },
          {
            name: "Mechas",
            description: "20€",
            image: "src/assets/img/mechas.webp"
          },
          {
            name: "Tinte y Color",
            description: "20€",
            image: "src/assets/img/tinte.webp"
          },
          {
            name: "Decoloracion",
            description: "10€",
            image: "src/assets/img/decoloracion.webp"
          }
        ]
      },
    }
  },
});
</script>

<style scoped>
#services {
  background-color: black;
}

.carousel-image {
  max-width: 80%; /* Ajusta el tamaño máximo de la imagen */
  max-height: 100%; /* Asegura que la imagen no exceda la altura del contenedor */
  object-fit: contain; /* Mantiene la relación de aspecto de la imagen */
}

.container-fluid {
  padding: 4rem 0; /* Ajusta el espaciado entre los elementos */
  height: 100%; /* Ajuste para header y footer */
}

.carousel-item {
  position: relative; /* Para el uso de pseudo-elementos */
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente para mejorar la legibilidad */
  border-radius: 0.5rem; /* Bordes redondeados */
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0;
  }

  .h3 {
    font-size: 1.25rem;
  }
}
</style>
