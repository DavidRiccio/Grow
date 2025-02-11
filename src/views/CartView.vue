<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">🛒 Carrito de Compras</h1>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body">
            <div 
              v-for="item in cartItems" 
              :key="item.id" 
              class="d-flex justify-content-between align-items-center mb-3 p-3 border-bottom"
            >
              <div class="d-flex align-items-center gap-3">
                <img :src="item.image" alt="" class="img-thumbnail" style="width: 50px; height: 50px;">
                <div>
                  <strong>{{ item.name }}</strong>
                  <div class="text-muted">Precio: €{{ item.precio.toFixed(2) }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3">
                <button 
                  @click="updateQuantity(item.id, item.cantidad - 1)" 
                  class="btn btn-sm btn-outline-secondary"
                  :disabled="item.cantidad <= 1"
                >
                  -
                </button>
                <span>{{ item.cantidad }}</span>
                <button 
                  @click="updateQuantity(item.id, item.cantidad + 1)" 
                  class="btn btn-sm btn-outline-secondary"
                >
                  +
                </button>
                <button 
                  @click="removeItem(item.id)" 
                  class="btn btn-sm btn-outline-danger"
                >
                  &times;
                </button>
              </div>
            </div>

            <div class="text-end fw-bold fs-5 mt-4">
              Total: €{{ cartTotal.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useCartStore } from '@/stores/cart';

export default defineComponent({
  name: 'CartView',
  setup() {
    const cartStore = useCartStore();

    const cartItems = computed(() => cartStore.productos);
    const cartTotal = computed(() => cartStore.total);

    const removeItem = (id: number) => {
      cartStore.eliminarProducto(id);
    };

    const updateQuantity = (id: number, cantidad: number) => {
      cartStore.actualizarCantidad(id, cantidad);
    };

    return {
      cartItems,
      cartTotal,
      removeItem,
      updateQuantity,
    };
  },
});
</script>

<style scoped>
.img-thumbnail {
  object-fit: cover;
}
</style>
