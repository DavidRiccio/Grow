<template>
  <div class="card text-center hover-effect">
    <img :src="producto.image" alt="Producto" class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">{{ producto.name }}</h5>
      <p class="card-text">{{ producto.description }}</p>
      <p>Precio: {{ producto.precio }}€</p>
      <button class="btn btn-outline-success" @click="agregarAlCarrito">
        Agregar al carrito
      </button>
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
/* Estilos para el tema oscuro */

/* Personalizamos la tarjeta para un fondo oscuro y texto claro */
.card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #333;
  border-radius: 0.25rem;
}

/* Imagen: se adapta a un fondo oscuro */
.card-img-top {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 200px;
  background-color: #2a2a2a; /* fondo oscuro en lugar del claro original */
  padding: 0.5rem;
}

/* Cuerpo de la tarjeta */
.card-body {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

/* Título y texto de la tarjeta se heredan del card-body,
   pero se pueden ajustar individualmente si se desea */
.card-title,
.card-text {
  margin-bottom: 0.5rem;
}

/* Efecto hover para la tarjeta */
.hover-effect {
  transition: all 0.2s ease;
  border: 1px solid #444;
}

.hover-effect:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.5) !important;
}

/* Personalización del botón para que se integre al tema oscuro */
.btn {
  color: #e0e0e0;
  border-color: #4caf50;
  background-color: transparent;
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  background-color: #4caf50;
  color: #1e1e1e;
}

/* Estilo para mensajes de error */
.error {
  color: #ff5252;
  margin-top: 0.5rem;
}
</style>
