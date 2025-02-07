<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-lg-10">
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 class="h3 fw-bold text-dark pb-2">
              Productos
            </h2>
          </div>
        </div>
        <!-- Grid de productos -->
        <div class="row g-3 justify-content-center">
          <ProductCard
            v-for="producto in products"
            :key="producto.id"
            :producto="producto"
            class="col-12 col-sm-6 col-md-4 col-xl-3 ms-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductCard from '../components/ProductCards.vue';

export default defineComponent({
  name: 'ProductsView',
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: "Gel fijador de pelo",
          description: "Eficaz para pelos lacios",
          precio: 9.99,
          cantidad: 10,
        },
        {
          id: 2,
          name: "Cera fijadora color mate",
          description: "Cera para peinarse con tonos mate.",
          precio: 7.95,
          cantidad: 15,
        },
      ]
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
}
</style>
