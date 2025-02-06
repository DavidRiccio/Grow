<template>

  <div class="card text-center">
    <div class="card-body">
      <h5 class="card-title">{{ producto.name }}</h5>
      <p class="card-text">{{ producto.description }}</p>
      <p>Precio: {{ producto.precio }}€</p>
      <input type="number" v-model="cantidad" min="1" :max="producto.cantidad" />
      <button @click="agregarAlCarrito">Agregar al carrito</button>
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
