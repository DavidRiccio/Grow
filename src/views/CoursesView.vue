<template>
  <div id="courses" class="container-fluid">
    <div class="row justify-content-center mt-4">
      <div class="col-12 col-lg-10">
        <!-- Encabezado -->
        <div class="row">
          <div class="col-12 text-center">
            <h2 class="h3 fw-bold text-light pb-2">
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
            image: "../assests/img/Curso.webp"
          },
          {
            name: "Barbería Clásica",
            description: "Tradición y precisión"
          },
          {
            name: "Química Capilar",
            description: "Composición de productos"
          },
          {
            name: "Química Capilar",
            description: "Composición de productos"
          },
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
#courses{
  background-color: black;
}

.container-fluid {
  padding: 4rem 0;
  height: 100%; /* Ajuste para header y footer */
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0;
  }
}
</style>
