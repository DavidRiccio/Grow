<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center mt-4">
      <div class="col-12 col-lg-10">
        <!-- Encabezado -->
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 class="h3 fw-bold text-dark pb-2">
              {{ courses.title }}
            </h2>
          </div>
        </div>

        <!-- Grid de cursos -->
        <div class="row g-3 justify-content-center">
          <CourseCard
            v-for="(card, index) in courses.cards"
            :key="index"
            :card="card"
            class="col-12 col-sm-6 col-lg-4 col-xl-3 ms-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CourseCard from '../components/CourseCards.vue';

export default defineComponent({
  name: 'CoursesView',
  components: { CourseCard },
  data() {
    return {
      courses: {
        title: "Cursos y Talleres",
        cards: [
          {
            name: "Cortes Modernos",
            description: "Técnicas actualizadas cada mes",
            image: "../assets/img/ejemplo.webp"
          },
          {
            name: "Barbería Clásica",
            description: "Tradición y precisión"
          },
          // ... (resto de los cursos)
          {
            name: "Química Capilar",
            description: "Composición de productos"
          },
          // ... (resto de los cursos)
          {
            name: "Química Capilar",
            description: "Composición de productos"
          },
          // ... (resto de los cursos)
          {
            name: "Química Capilar",
            description: "Composición de productos"
          }
        ]
      }
    };
  },
});
</script>

<style scoped>

.container-fluid {
  padding: 2rem 0;
  min-height: calc(100vh - 120px); /* Ajuste para header y footer */
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0;
  }
}
</style>
