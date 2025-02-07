<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-lg-10">
        <!-- Encabezado -->
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 class="h3 fw-bold text-dark  pb-2">
              {{ events.title }}
            </h2>
          </div>
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
import { defineComponent } from 'vue';
import EventCard from '../components/EventCards.vue';

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
            description: "Meeting de barberos de Santa Cruz"
          },
          {
            name: "Torneo de cortes",
            description: "Torneo de cortes de pelo, premio 60€"
          },
          // Ejemplos adicionales para demostrar el grid
          {
            name: "Convención Nacional de Estilismo",
            description: "Evento anual con expertos internacionales"
          },
          {
            name: "Workshop de Técnicas Modernas",
            description: "Aprende las últimas tendencias en vivo"
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

  .h3 {
    font-size: 1.25rem;
  }
}
</style>
