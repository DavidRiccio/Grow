<template>
  <div class="container-fluid presentation-page">
    <!-- Hero Section -->
    <div class="hero-section text-center py-5">
      <h1 class="growstudio-title mb-4">GrowStudio</h1>
      <p class="tagline fs-4 text-white-50">Creciendo día a día</p>
    </div>

    <!-- Reseñas Section -->
    <div class="row row-cols-1 row-cols-md-3 g-4 align-items-stretch">
      <div class="col" v-for="(review, index) in reviews" :key="index">
        <div class="card h-100 bg-dark border-warning">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center mb-3">
              <div>
                <h5 class="card-title text-white">{{ review.name }}</h5>
                <div class="text-warning">
                  <i class="bi bi-star-fill" v-for="n in review.rating" :key="n"></i>
                </div>
              </div>
            </div>
            <p class="card-text text-white-50 flex-grow-1">{{ review.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reserva Section -->
    <div class="row justify-content-center py-4 reservation-section">
      <div class="col-md-8 text-center">
        <div class="reserva-card p-4 rounded-4">
          <h3 class="text-warning mb-3">¿Listo para tu próxima experiencia?</h3>
          <router-link to="/reserva" class="btn btn-warning btn-lg fw-bold px-5 py-3 link">
            Reserva aquí <i class="bi bi-arrow-right ms-2"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mapa Section -->
    <div class="row align-items-center justify-content-center py-5 map-section">
      <div class="col-lg-5 mb-4 mb-lg-0">
        <div class="ratio ratio-4x3 rounded-4 overflow-hidden border border-warning shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.4938194818415!2d-16.27500552419241!3d28.46467139168318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41cd215ef7e233%3A0x6243e6fcd877a6fb!2sGrow%20Barber%20%26%20Studio!5e0!3m2!1ses!2ses!4v1739308761242!5m2!1ses!2ses"
            style="border:0;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div class="col-lg-5 text-center text-lg-start">
        <h2 class="section-title mb-3">Visítanos en el corazón de Santa Cruz</h2>
        <p class="fs-5 text-light-emphasis">
          GrowStudio está ubicado en una zona de fácil acceso con aparcamiento cercano. Ven a relajarte, renovar tu estilo y disfrutar de un ambiente único pensado para ti.
        </p>
        <p class="text-warning fw-semibold mt-3">¡Te esperamos con café y buena vibra!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PresentationPage',
  data() {
    return {
      reviews: [
        {
          name: "Joan Marc Ferrer",
          rating: 5,
          text: "Partiendo de la base que es un gran profesional, el trato que te da, perfecto como lo profesional que es, y comodidades para tu poder acudir a tus citas, ya que hay que compaginar con el trabajo y horarios. Recomiendo que vengan a peluquería GROW"
        },
        {
          name: "Fran Santos",
          rating: 5,
          text: "Un 10 en todo, destaca la profesionalidad, el ambiente tranquilo, y lo mejor es la relación calidad-precio que para mí es la mejor que hay en todo Santa Cruz."
        },
        {
          name: "Yorel Brito",
          rating: 5,
          text: "Buena disponibilidad de horarios, excelente calidad de cortes y trato al cliente inmejorable, te dan hasta café 😉…"
        }
      ]
    };
  },
});
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@700&family=Poppins:wght@400;600&display=swap');

.presentation-page {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  min-height: 100vh;
  color: white;
}

.link{
  text-decoration: none; color: #1a1a1a;
}
.map-container {
  border: 2px solid #ffd700;
  background: rgba(0, 0, 0, 0.3);
}

.map-container iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
  filter: grayscale(20%) contrast(110%);
}

@media (max-width: 768px) {
  .map-container {
    margin: 0 -1rem;
    border-left: none;
    border-right: none;
  }
}
.growstudio-title {
  font-family: 'Kanit', sans-serif;
  font-size: 4.5rem;
  background: linear-gradient(45deg, #ffd700, #ffaa00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.tagline {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.section-title {
  font-family: 'Kanit', sans-serif;
  font-size: 2.5rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #ffd700;
}

.review-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.15);
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.1);
}

.avatar {
  width: 50px;
  height: 50px;
}

.map-container {
  border: 2px solid #ffd700;
  position: relative;
}

.map-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.1);
}

@media (max-width: 768px) {
  .growstudio-title {
    font-size: 3rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>