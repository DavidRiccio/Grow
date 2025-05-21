<template>
  <main class="presentation-page py-4">
    <!-- Hero Section -->
    <section class="hero-section text-center py-5 mb-4" aria-labelledby="main-title">
      <div class="container">
        <h1 id="main-title" class="growstudio-title mb-3">GrowStudio</h1>
        <p class="tagline lead mb-4 text-white-50">Creciendo día a día</p>
              <router-link 
                to="/reserva" 
                class="btn btn-warning btn-lg fw-bold px-4 px-md-5 py-3 link"
                role="button"
                aria-label="Reserva tu cita ahora">
                Reserva aquí <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i>
              </router-link>
      </div>
    </section>

    <!-- Reseñas Section -->
    <section class="reviews-section pb-5 mb-5" aria-labelledby="reviews-title">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 id="reviews-title" class="section-title position-relative d-inline-block mb-4">Lo que dicen nuestros clientes</h2>
          </div>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div class="col" v-for="(review, index) in reviews" :key="index">
            <div class="review-card card h-100 bg-dark border-warning p-2 shadow-lg">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h3 class="card-title h5 text-white mb-0">{{ review.name }}</h3>
                  <div class="rating-stars text-warning" :aria-label="`Valoración: ${review.rating} estrellas`">
                    <i class="bi bi-star-fill" v-for="n in review.rating" :key="n" aria-hidden="true"></i>
                  </div>
                </div>
                <blockquote class="card-text text-white-50 flex-grow-1 mb-0">
                  <p class="mb-0">{{ review.text }}</p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="map-section py-5  bg-opacity-50 rounded-4 my-5" aria-labelledby="location-title">
      <div class="container">
        <div class="row align-items-center gy-5">
          <div class="col-lg-6 order-lg-2">
            <div class="map-wrapper position-relative rounded-4 overflow-hidden border border-warning shadow-lg">
              <div class="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.4938194818415!2d-16.27500552419241!3d28.46467139168318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41cd215ef7e233%3A0x6243e6fcd877a6fb!2sGrow%20Barber%20%26%20Studio!5e0!3m2!1ses!2ses!4v1739308761242!5m2!1ses!2ses"
                  title="Mapa de ubicación de GrowStudio"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  aria-label="Ubicación de GrowStudio en Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
          <div class="col-lg-6 order-lg-1 text-center text-lg-start">
            <h2 id="location-title" class="section-title position-relative mb-4">Visítanos en el corazón de Santa Cruz</h2>
            <p class="fs-5 text-light-emphasis mb-4">
              GrowStudio está ubicado en una zona de fácil acceso con aparcamiento cercano. Ven a relajarte, renovar tu estilo y disfrutar de un ambiente único pensado para ti.
            </p>
            <p class="highlight-text text-warning fw-semibold d-inline-block py-2 px-4">¡Te esperamos con café y buena vibra!</p>
          </div>
        </div>
      </div>
    </section>

  </main>
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

.growstudio-title {
  font-family: 'Kanit', sans-serif;
  font-size: 4.5rem;
  background: linear-gradient(45deg, #ffd700, #ffaa00);
  -webkit-background-clip: text;
  background-clip: text;
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
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 3px;
  background: #ffd700;
}

.text-center .section-title::after {
  left: 50%;
  transform: translateX(-50%);
}

.review-card {
  border-width: 2px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover, .review-card:focus-within {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.15) !important;
}

.link {
  text-decoration: none; 
  color: #1a1a1a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.link:hover, .link:focus {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
}

.link:focus {
  outline: 3px solid rgba(255, 215, 0, 0.5);
  outline-offset: 2px;
}

.reserva-card {
  background: rgba(33, 37, 41, 0.9);
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.map-wrapper {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.map-wrapper iframe {
  filter: grayscale(20%) contrast(110%);
}

.map-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.1);
  z-index: 1;
}

.highlight-text {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 30px;
}

/* Media queries optimizadas */
@media (max-width: 991.98px) {
  .section-title {
    font-size: 2.2rem;
    text-align: center;
  }
  
  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 767.98px) {
  .growstudio-title {
    font-size: 3.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 575.98px) {
  .growstudio-title {
    font-size: 3rem;
  }
  
  .hero-section {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>