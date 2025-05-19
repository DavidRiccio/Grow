<template>
  <section id="courses">
    <!-- Hero -->
    <div class="hero-section text-center py-5">
      <h1 class="growstudio-title mb-4">Eventos</h1>
      <p class="tagline fs-4 text-white-50">Creciendo día a día</p>
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
        <div v-for="(card, index) in filteredCourses" :key="index" class="col-12 col-md-6 col-lg-4">
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
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "CoursesView",
  setup() {
    const searchQuery = ref("");
    const courses = ref<any[]>([]);

    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/events");

        courses.value = response.data.map((event: any) => ({
          name: event.name || event.title,
          description: event.description || "Sin descripción",
          image: event.image || "src/assets/img/placeholder.png",
        }));
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    onMounted(fetchCourses);

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
#courses {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  color: white;
  min-height: 100vh;
  padding: 4rem 0;
}

.hero-section h1 {
  color: #ffb100;
}

.search-bar {
  max-width: 400px;
  margin: 0 auto 2rem;
}

.search-bar .form-control {
  background: #222;
  border: 1px solid #ffb100;
  color: white;
}

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

.course-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.course-info {
  padding: 1.2rem;
  text-align: center;
}

.btn-primary {
  background-color: #ffb100;
  border: none;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #e69a00;
}
</style>
