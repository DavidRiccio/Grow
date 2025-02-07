<template>

  <div class="card text-center hover-effect">
    <div class="card-body">
      <h5 class="card-title">{{ producto.name }}</h5>
      <p class="card-text">{{ producto.description }}</p>
      <p>Precio: {{ producto.precio }}€</p>
      <button class='btn btn-outline-success' @click="agregarAlCarrito">Agregar al carrito</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>


<script lang="ts">

import { defineComponent, ref } from 'vue';
import { useCart } from '../composables/useCart.js';


export default defineComponent({
  name: 'ProductCard',
  props: {
    producto: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
      const cantidad = ref(1);
      const error = ref('');
      const { agregarProducto } = useCart();

      const agregarAlCarrito = () => {
        if (cantidad.value > props.producto.cantidad) {
          error.value = 'No hay suficiente stock disponible.';
        } else {
          error.value = '';
          agregarProducto({ ...props.producto, cantidad: cantidad.value });
        }
      };

      return { cantidad, error, agregarAlCarrito };
    },
  });
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
</style>
