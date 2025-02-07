<template>

  <div class="habilidades container mt-5">

    <h2 class="text-center">{{ events.title }}</h2>

    <div class="row">

      <EventCard v-for="(card, index) in events.cards"
        :key="index"
        :card="card"
        class="col-md-4 mb-4"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EventCard from '../components/EventCards.vue';

export default defineComponent({
  name: 'events',
  components: {
    EventCard,
  },
  data() {
    return {
      events: {
        title: "Eventos",
        cards: [
          {
            name: "Reunion Barberos Santa Cruz de Tenerife",
            description: "Meeting de barberos de Santa Cruz"
          },
          {
            name: "Torneo de cortes",
            description: "Torneo de cortes de pelo, premio 60€"
          }
        ]
      }
    };
  },
});
</script>
