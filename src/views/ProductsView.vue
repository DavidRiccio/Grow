<template>
  <div class="container-fluid">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-lg-10">
        <div class="row mb-4">
          <div class="hero-section text-center py-5">
        <h1 class="growstudio-title mb-4">Productos</h1>
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
          name: "Ossion Styling powder",
          description: "",
          precio: 9.99,
          cantidad: 10,
          image: "src/assets/img/ossion-hair-styling-powder-Photoroom.png",
          stock:10
        },
        {
          id: 2,
          name: "Ossion Cera Wax Megahold",
          description: "",
          precio: 11.99,
          cantidad: 15,
          image: "src/assets/img/ossion-hair-styling-wax-mega-hold-Photoroom.png",
          stock:10
        },
        {
          id: 3,
          name: "Ossion Cera Wax UltraHold",
          description: "",
          precio: 11.99,
          cantidad: 15,
          image: "src/assets/img/ultrahold-Photoroom.png",
          stock:10
        },
        {
          id: 4,
          name: "Ossion Sea Salt Hair Spray",
          description: "",
          precio: 14.99,
          cantidad: 15,
          image: "src/assets/img/large_MORFOSE-OSSION-SEA-SLAT-Photoroom.png",
          stock:10
        },
        {
          id: 5,
          name: "Ossion Cera Wax Mattehold",
          description: "",
          precio: 11.99,
          cantidad: 15,
          image: "src/assets/img/ossion-hair-styling-wax-matte-hold-verde-Photoroom.png",
          stock:10
        },
      ]
    };
  },
});
</script>

<style scoped>
.container-fluid {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  padding: 2rem 0;
  height: 100%; /* Ajuste para header y footer */
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0;
  }
}
</style>