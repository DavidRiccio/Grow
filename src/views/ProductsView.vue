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
            name: "Python",
            description: "Tengo una gran experiencia desarrollando con python y generando webs con Django a traves de codigo pyton",
            precio: 2.00,
            cantidad: 10,
          },
          {
            id: 2,
            name: "JavaScript",
            description: "Tengo una experiencia basica de Javascript junto con Jquery y Typescript",
            precio: 3.00,
            cantidad: 15,
          }
        ]
      }
  },
});
</script>
