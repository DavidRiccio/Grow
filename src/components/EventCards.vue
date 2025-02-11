<template>
  <div class="card border-0 hover-transform position-relative overflow-hidden">
    <div class="card-gradient-overlay"></div>
    <img 
      :src="card.image" 
      alt="Evento" 
      class="card-img-top object-fit-cover"
      style="height: 180px;"
    >
    <div class="card-body position-relative z-index-1 p-3 p-lg-4">
      <div class="d-flex flex-column align-items-start">
        <span class="badge bg-warning mb-2 fs-7 fw-normal rounded-pill px-3">
          {{ card.category }}
        </span>
        <h5 class="card-title fs-5 fw-bold mb-2 text-start text-white">
          {{ card.name }}
        </h5>
        <p class="card-text text-white-60 fs-6 mb-3 text-start">
          {{ card.description }}
        </p>
        <p class="card-text text-white-60 fs-6 mb-3 text-start">
          {{ card.location }}
        </p>
        <div class="d-flex w-100 justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-calendar3 fs-6 text-primary"></i>
            <span class="text-white-80 small">{{ card.date }}</span>
          </div>
          <button class="btn btn-link p-0 text-decoration-none">
            <i class="bi bi-arrow-right-circle fs-5 text-primary"></i>
          </button>
        </div>
      </div>
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

<style scoped>
.hover-transform {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #1a1a1a;
  border-radius: 16px !important;
}

.hover-transform:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25);
}

.card-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.9) 100%);
  z-index: 1;
}

.object-fit-cover {
  object-fit: cover;
  object-position: center;
}

.z-index-1 {
  z-index: 2;
}

.text-white-60 {
  color: rgba(255, 255, 255, 0.6);
}

.text-white-80 {
  color: rgba(255, 255, 255, 0.8);
}

.btn-link:hover i {
  transform: translateX(3px);
  transition: transform 0.2s ease;
}
</style>