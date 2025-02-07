<template>

  <div class="habilidades container mt-5">
    <div class="row">
      <ProductCard v-for="producto in products"
        :key="producto.id"
        :producto="producto"
        class="col-md-4 mb-4"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductCard from '../components/ProductCards.vue';

export default defineComponent({
  name: 'products',
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
          }
        ]
      }
  },
});
</script>
