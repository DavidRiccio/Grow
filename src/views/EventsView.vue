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
        title: "events",
        cards: [
          {
            name: "Python",
            description: "Tengo una gran experiencia desarrollando con python y generando webs con Django a traves de codigo pyton"
          },
          {
            name: "JavaScript",
            description: "Tengo una experiencia basica de Javascript junto con Jquery y Typescript"
          }
        ]
      }
    };
  },
});
</script>
