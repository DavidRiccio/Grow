<template>
  <section id="courses">
    <!-- Hero -->
    <div class="hero-section text-center py-5">
      <h1 class="growstudio-title mb-4">Cursos</h1>
      <p class="tagline fs-4 text-white-50">Creciendo dia a dia</p>
    </div>

    <div class="container">
      <!-- Filtro de búsqueda -->
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Buscar curso..."
          aria-label="Buscar curso"
        />
      </div>

      <!-- Grid de cursos -->
      <div class="row gy-4">
        <div
          v-for="(card, index) in filteredCourses"
          :key="index"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="course-card">
            <img :src="card.image" class="course-image" :alt="card.name" />
            <div class="course-info">
              <h5 class="fw-bold">{{ card.name }}</h5>
              <p class="text-light">{{ card.description }}</p>
              <button class="btn btn-primary w-100">Ver Curso</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'CoursesView',
  setup() {
    const searchQuery = ref('');
    const courses = ref([
      { name: 'Cortes Modernos', description: 'Técnicas de vanguardia.', image: 'src/assets/img/curso1.png' },
      { name: 'Barbería Clásica', description: 'Aprende la tradición.', image: 'src/assets/img/curso2.png' },
      { name: 'Colorimetría Avanzada', description: 'Domina el color.', image: '/src/assets/img/curso3.png' },
      { name: 'Química Capilar', description: 'Composición de productos.', image: 'src/assets/img/curso4.png' },
      { name: 'Fade Perfecto', description: 'Técnicas avanzadas.', image: 'src/assets/img/curso5.png' },
      { name: 'Corte Simple ', description: 'Lo fácil es importante.', image: 'src/assets/img/curso6.png' },
    ]);

    // Filtrar cursos según búsqueda
    const filteredCourses = computed(() =>
      courses.value.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    return { searchQuery, filteredCourses };
  },
});
</script>

<style scoped>
/* Fondo y estilos generales */
#courses {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  color: white;
  min-height: 100vh;
  padding: 4rem 0;
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  color: #ffb100;
}

/* Barra de búsqueda */
.search-bar {
  max-width: 400px;
  margin: 0 auto 2rem;
}

.search-bar .form-control {
  background: #222;
  border: 1px solid #ffb100;
  color: white;
}

/* Tarjetas */
.course-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 177, 0, 0.3);
}

/* Imagen */
.course-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

/* Información */
.course-info {
  padding: 1.2rem;
  text-align: center;
}

/* Botón */
.btn-primary {
  background-color: #ffb100;
  border: none;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #e69a00;
}
</style>
