
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCartStore } from '../stores/cart';

export default defineComponent({
  name: 'ProductCard',
  props: {
    producto: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const error = ref('');
    const cartStore = useCartStore();

    const agregarAlCarrito = () => {
      if (props.producto.stock < 1) {
        error.value = 'No hay suficiente stock disponible.';
      } else {
        error.value = '';
        cartStore.agregarProducto({ 
          id: props.producto.id, 
          price: props.producto.price,
          cantidad: 1
        });
      }
    };

    return { error, agregarAlCarrito };
  },
});
</script>

<template>
  <div 
    class="card h-100 shadow-sm border-dark bg-dark text-light"
    role="article"
    aria-labelledby="productTitle"
    :aria-describedby="'desc_' + producto.id"
  >
    <div class="card-img-top p-2 bg-dark-secondary">
      <img 
        :src="producto.imagen"
        :alt="producto.nombre"
        class="img-fluid mx-auto d-block"
        style="max-height: 200px;"
        role="img"
      >
    </div>
    
    <div class="card-body d-flex flex-column">
      <h3 
        id="productTitle"
        class="card-title h5 mb-3"
      >
        {{ producto.nombre }}
      </h3>
      
      <p 
        :id="'desc_' + producto.id"
        class="card-text mb-4 text-muted"
        v-text="producto.descripcion"
      ></p>
      
      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="h4 mb-0 text-warning">
            {{ producto.price.toFixed(2) }}€
          </span>
          <span 
            v-if="producto.stock > 0"
            class="badge bg-success"
          >
            Disponible
          </span>
        </div>
        
        <button
          @click="agregarAlCarrito"
          class="btn btn-outline-warning w-100"
          :disabled="producto.stock < 1"
          :aria-label="'Añadir ' + producto.nombre + ' al carrito'"
          role="button"
        >
          Agregar al carrito
        </button>
        
        <div 
          v-if="error"
          class="alert alert-danger mt-3 mb-0"
          role="alert"
          aria-live="assertive"
        >
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
