<template>
    <section id="event-detail" class="py-5">
      <div class="container">
        <!-- Estado de carga -->
        <div v-if="loading" class="row min-vh-50 align-items-center" aria-live="assertive">
          <div class="col-12 text-center my-5">
            <div class="spinner-border text-warning spinner-border-lg" role="status">
              <span class="visually-hidden">Cargando evento...</span>
            </div>
            <p class="text-white-50 mt-3">Cargando información del evento...</p>
          </div>
        </div>
  
        <!-- Mensaje de error -->
        <div v-else-if="error" class="row mb-4">
          <div class="col-12 col-md-10 col-lg-8 mx-auto">
            <div class="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
              <i class="bi bi-exclamation-triangle-fill flex-shrink-0 me-3 fs-4" aria-hidden="true"></i>
              <div>{{ error }}</div>
            </div>
            <div class="text-center mt-4">
              <button class="btn btn-warning" @click="navigateBack">
                <i class="bi bi-arrow-left me-2"></i>Volver a eventos
              </button>
            </div>
          </div>
        </div>
  
        <!-- Contenido del evento -->
        <div v-else class="event-content">
          <!-- Cabecera del evento -->
          <div class="row mb-4">
            <div class="col-12">
              <nav aria-label="breadcrumb" class="mb-3">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="#" class="text-warning" @click.prevent="navigateBack">Eventos</a></li>
                  <li class="breadcrumb-item active text-white-50" aria-current="page">{{ event.name }}</li>
                </ol>
              </nav>
              <h1 class="display-4 text-warning fw-bold mb-3">{{ event.name }}</h1>
              <p class="text-white-50 lead">{{ event.description }}</p>
            </div>
          </div>
  
          <!-- Detalles del evento -->
          <div class="row g-4 mb-5">
            <div class="col-lg-7 col-md-6 order-md-1 order-2">
              <div class="card bg-dark border-0 shadow h-100">
                <div class="card-body p-4">
                  <h2 class="h4 text-warning mb-4">Detalles del evento</h2>
                  <ul class="list-group list-group-flush rounded overflow-hidden">
                    <li class="list-group-item bg-dark text-warning d-flex align-items-center py-3">
                      <i class="bi bi-calendar-event me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">Fecha</strong>
                        <span class="text-white-50">{{ event.date || "Próximamente" }}</span>
                      </div>
                    </li>
                    <li class="list-group-item bg-dark text-warning d-flex align-items-center py-3">
                      <i class="bi bi-clock-fill me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">Duración</strong>
                        <span class="text-white-50">{{ event.duration || "No especificado" }}</span>
                      </div>
                    </li>
                    <li class="list-group-item bg-dark text-warning d-flex align-items-center py-3">
                      <i class="bi bi-people-fill me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">Capacidad</strong>
                        <span class="text-white-50">{{ event.capacity || "Ilimitado" }}</span>
                      </div>
                    </li>
                    <li class="list-group-item bg-dark text-warning d-flex align-items-center py-3">
                      <i class="bi bi-geo-alt-fill me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">Ubicación</strong>
                        <span class="text-white-50">{{ event.location }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="card-footer bg-dark border-0 p-4">
                  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button class="btn btn-warning btn-lg" @click="navigateBack">
                      <i class="bi bi-arrow-left me-2"></i>Volver a eventos
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-5 col-md-6 order-md-2 order-1 mb-4 mb-md-0">
              <figure class="figure mb-0 h-100 d-flex flex-column">
                <img 
                  :src="event.image" 
                  :alt="'Imagen del evento: ' + event.name" 
                  class="figure-img img-fluid rounded shadow-lg mb-3 w-100 object-fit-cover"
                  style="max-height: 350px"
                />
                <figcaption class="figure-caption text-white-50 text-center">
                  {{ event.name }} - {{ event.location }}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import axios from "axios";
  
  const route = useRoute();
  const router = useRouter();
  const eventId = route.params.id;
  const event = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  
  const fetchEvent = async () => {
    try {
      loading.value = true;
      const response = await axios.get(`http://localhost:8000/api/events/${eventId}/`);
      event.value = response.data;
    } catch (err: any) {
      error.value = "Error al cargar el evento: " + (err.message || "Desconocido");
      console.error("Error al cargar el evento:", err);
    } finally {
      loading.value = false;
    }
  };
  
  const navigateBack = () => {
    router.push("/events");
  };
  
  onMounted(fetchEvent);
  </script>
  
  <style scoped>
  #event-detail {
    background: radial-gradient(circle at top, #070707, #181818);
    color: white;
    min-height: 100vh;
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
  
  .object-fit-cover {
    object-fit: cover;
  }
  
  .min-vh-50 {
    min-height: 50vh;
  }
  
  .spinner-border-lg {
    width: 3rem;
    height: 3rem;
  }
  </style>