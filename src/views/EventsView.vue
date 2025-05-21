<template>
  <section id="courses" class="py-5">
    <div class="container">
      <!-- Hero Section -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="growstudio-title display-4 fw-bold text-warning mb-3">Eventos</h1>
          <p class="tagline fs-5 text-white-50">Creciendo día a día</p>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="row">
        <div class="col-12 d-flex justify-content-center my-4" aria-live="polite">
          <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Cargando eventos...</span>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="row mb-4">
        <div class="col-12 col-md-8 col-lg-6 mx-auto">
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
            <div>{{ error }}</div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !error">
        <!-- Barra de búsqueda -->
        <div class="row justify-content-center mb-4">
          <div class="col-12 col-sm-8 col-md-6 col-lg-4">
            <div class="input-group">
              <span class="input-group-text bg-dark border-warning text-warning">
                <i class="bi bi-search" aria-hidden="true"></i>
              </span>
              <input
                v-model="searchQuery"
                type="search"
                class="form-control bg-dark text-white border-warning"
                placeholder="Buscar evento..."
                aria-label="Buscar evento"
              />
              <button 
                v-if="searchQuery" 
                class="btn btn-outline-warning"
                @click="searchQuery = ''"
                aria-label="Limpiar búsqueda"
              >
                <i class="bi bi-x-circle" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Grid de cursos con Bootstrap -->
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          <div v-for="(card, index) in filteredCourses" :key="index" class="col">
            <article class="card course-card h-100 bg-dark border-0 shadow">
              <div class="position-relative">
                <img 
                  :src="card.image" 
                  class="card-img-top course-image" 
                  :alt="card.name"
                  loading="lazy"
                />
                <div class="position-absolute top-0 end-0 m-3">
                  <span class="badge bg-warning text-dark rounded-pill px-3 py-2">
                    <i class="bi bi-calendar-event me-1" aria-hidden="true"></i>
                    {{ card.date || 'Próximamente' }}
                  </span>
                </div>
              </div>
              
              <div class="card-body d-flex flex-column">
                <h2 class="card-title h5 fw-bold text-warning">{{ card.name }}</h2>
                <p class="card-text text-white-50">{{ card.description }}</p>
                
                <!-- Detalles del evento usando row-cols de Bootstrap -->
                <div class="row row-cols-2 text-warning mt-auto mb-3">
                  <div class="col d-flex align-items-center">
                    <i class="bi bi-people-fill me-2" aria-hidden="true"></i>
                    <small>{{ card.capacity || 'Ilimitado' }}</small>
                  </div>
                  <div class="col d-flex align-items-center justify-content-end">
                    <i class="bi bi-clock-fill me-2" aria-hidden="true"></i>
                    <small>{{ card.duration || '2h' }}</small>
                  </div>
                </div>
                  
                <!-- Botón de acción -->
                <router-link 
                  :to="`/eventos/${card.id || index}`" 
                  class="btn btn-warning w-100"
                  :aria-label="`Ver detalles del evento ${card.name}`"
                >
                  Ver Curso
                </router-link>
              </div>
            </article>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados usando Bootstrap -->
        <div v-if="filteredCourses.length === 0" class="row mt-5">
          <div class="col-12 col-md-8 col-lg-6 mx-auto">
            <div class="card bg-dark border-warning text-center p-4">
              <div class="card-body">
                <i class="bi bi-search text-warning display-4 mb-3" aria-hidden="true"></i>
                <h2 class="h4 mb-3 text-warning">No se encontraron eventos</h2>
                <p class="text-white-50 mb-4">No hay eventos que coincidan con "{{ searchQuery }}"</p>
                <button @click="searchQuery = ''" class="btn btn-outline-warning">
                  Ver todos los eventos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

// Variables reactivas
const searchQuery = ref("");
const courses = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Obtener eventos del API
const fetchCourses = async () => {
  try {
    loading.value = true;
    const response = await axios.get("http://localhost:8000/api/events/");
    courses.value = response.data.map((event: any) => ({
      id: event.id,
      name: event.name || event.title,
      description: event.description || "Sin descripción",
      image: event.image || "src/assets/img/placeholder.png",
      date: event.date,
      capacity: event.capacity,
      duration: event.duration
    }));
  } catch (err: any) {
    error.value = "Error al cargar eventos: " + (err.message || "Desconocido");
    console.error("Error al cargar eventos:", err);
  } finally {
    loading.value = false;
  }
};

// Filtrar cursos según la búsqueda
const filteredCourses = computed(() =>
  courses.value.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Cargar eventos al montar el componente
onMounted(fetchCourses);
</script>

<style scoped>
#courses {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  color: white;
  min-height: 100vh;
}

/* Título de la sección */
.growstudio-title {
  color: #ffb100;
  text-shadow: 0 0 10px rgba(255, 177, 0, 0.3);
}

/* Tarjetas de curso */
.course-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 177, 0, 0.3) !important;
}

/* Imagen del curso */
.course-image {
  height: 180px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

/* Botón principal */
.btn-warning {
  background-color: #ffb100;
  border: none;
  color: #121212;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-warning:hover {
  background-color: #e69a00;
}

.btn-outline-warning {
  color: #ffb100;
  border-color: #ffb100;
}

.btn-outline-warning:hover {
  background-color: #ffb100;
  color: #121212;
}

/* Formulario de búsqueda */
.form-control:focus,
.input-group-text {
  box-shadow: none;
}

/* Accesibilidad - estados de foco */
.btn:focus,
.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 177, 0, 0.25);
}

/* Media queries - Aunque Bootstrap maneja la mayoría del responsive */
@media (max-width: 576px) {
  .course-image {
    height: 160px;
  }
}
</style>