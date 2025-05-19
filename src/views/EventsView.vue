<template>
  <div class="container-fluid" id="events">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-lg-10">
        <div class="hero-section text-center py-5">
          <h1 class="growstudio-title mb-4">{{ events.title }}</h1>
          <p class="tagline fs-4 text-white-50">Creciendo dia a dia</p>
        </div>

        <!-- Grid de eventos -->
        <div class="row g-3 justify-content-center">
          <EventCard
            v-for="(card, index) in events.cards"
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
import { ref, computed } from 'vue';
import { defineComponent } from 'vue';
import EventCard from '../components/EventCards.vue';

export const useUser Store = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const role = computed(() => user.value ? user.value.role : null);

  async function fetchUser () {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/user/me/', {
        credentials: 'include', // Enviar cookies para autenticación
      });
      if (!response.ok) {
        throw new Error('No se pudo obtener el usuario');
      }
      const data = await response.json();
      user.value = data;
    } catch (err) {
      error.value = err.message || 'Error desconocido';
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  return { user, role, loading, error, fetchUser  };
});

export default defineComponent({
  name: 'EventsView',
  components: {
    EventCard,
  },
  data() {
    return {
      events: {
        title: "Eventos",
        cards: [
          {
            name: "Reunión Barberos Santa Cruz de Tenerife",
            description: "Un evento exclusivo donde los barberos de Tenerife se reúnen para compartir técnicas y conocimientos.",
            date: "2025-03-20",
            location: "Santa Cruz de Tenerife",
            image: "src/assets/img/eventos.png",
            badge: "Nuevo"
          },
          {
            name: "Torneo de Cortes",
            description: "Un torneo donde los mejores barberos competirán por el premio de 60€. ¡Participa y demuestra tus habilidades!",
            date: "2025-04-10",
            location: "Tenerife",
            image: "src/assets/img/eventos.png",
            badge: "¡Inscripciones abiertas!"
          },
          {
            name: "Convención Nacional de Estilismo",
            description: "Evento de 3 días con expertos internacionales en estilismo, para aprender las últimas tendencias.",
            date: "2025-05-15",
            location: "Madrid",
            image: "src/assets/img/eventos.png",
            badge: "Internacional"
          },
          {
            name: "Workshop de Técnicas Modernas",
            description: "En este workshop aprenderás las últimas tendencias en cortes y estilismo moderno con los mejores profesionales.",
            date: "2025-06-05",
            location: "Barcelona",
            image: "src/assets/img/eventos.png",
            badge: "Exclusivo"
          }
        ]
      }
    };
  },
});
</script>

<style scoped>
#events {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
}

.container-fluid {
  padding: 4rem 0;
  height: 100%; /* Ajuste para header y footer */
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
