<template>

  <div class="card text-center">
    <div class="card-body">
      <h5 class="card-title">{{ card.name }}</h5>
      <p class="card-text">{{ card.description }}</p>
    </div>
  </div>
</template>


<script lang="ts">

import { defineComponent } from 'vue';


export default defineComponent({
  name: 'EventCard',
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
});
</script>
