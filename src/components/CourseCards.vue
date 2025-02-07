<!-- CourseCards.vue -->
<template>
  <div class="card h-100 shadow-sm hover-effect">
    <div class="card-body p-3 d-flex flex-column">
      <h3 class="card-title fs-6 fw-bold text-dark mb-2">{{ card.name }}</h3>
      <p class="card-text text-secondary small flex-grow-1 mb-2">{{ card.description }}</p>
      <button class="btn btn-outline-primary btn-sm rounded-pill px-3 align-self-start">
        Ver más
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['card']
}
</script>

<style scoped>
.hover-effect {
  transition: all 0.2s ease;
  border: 1px solid rgba(0,0,0,0.075);
}

.hover-effect:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1)!important;
}

.card {
  font-size: 0.9rem;
}
</style>
