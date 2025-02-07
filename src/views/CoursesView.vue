<!-- CoursesView.vue -->
<template>
  <div class="container-fluid bg-light" style="min-height: calc(100vh - 160px);">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-md-10 text-center mb-4">
        <h2 class="h3 fw-bold text-dark border-bottom border-2 border-primary pb-2 mt-3">
          {{ courses.title }}
        </h2>
      </div>

      <div class="row g-3 justify-content-center px-2 mb-4">
        <CourseCard
          v-for="(card, index) in courses.cards"
          :key="index"
          :card="card"
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
        />
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
            description: "Técnicas actualizadas cada mes"
          },
          {
            name: "Barbería Clásica",
            description: "Tradición y precisión"
          },
          {
            name: "Colorimetría",
            description: "Fundamentos científicos"
          },
          {
            name: "Gestión de Salón",
            description: "Administración eficiente"
          },
          {
            name: "Tratamientos",
            description: "Cuidado capilar profesional"
          },
          {
            name: "Estilos Urbanos",
            description: "Tendencias masculinas"
          },
          {
            name: "Maquillaje Masculino",
            description: "Estilizado moderno"
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
