<!-- ProductCards.vue -->
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCartStore } from '@/stores/cart';

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

<style scoped>
.card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #333;
  border-radius: 0.25rem;
}

.card-img-top {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 200px;
  background-color: #2a2a2a;
  padding: 0.5rem;
}

.card-body {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.card-title,
.card-text {
  margin-bottom: 0.5rem;
}

.hover-effect {
  transition: all 0.2s ease;
  border: 1px solid #444;
}

.hover-effect:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.5) !important;
}

.btn {
  color: #e0e0e0;
  border-color: #ffb100;
  background-color: transparent;
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  background-color: #ffb100;
  color: #1e1e1e;
}

.error {
  color: #ff5252;
  margin-top: 0.5rem;
}
</style>