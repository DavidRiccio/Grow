<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">🛒 Carrito de Compras</h1>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body">
            <div v-for="item in cartItems" :key="item.id" class="d-flex justify-content-between align-items-center mb-3 p-3 border-bottom">
              <div>{{ item.name }}</div>
              <div class="d-flex align-items-center gap-3">
                <button @click="removeItem(item.id)" class="btn btn-sm btn-outline-danger">×</button>
                <span class="text-muted">${{ item.precio.toFixed(2) }}</span>
              </div>
            </div>
            <div class="text-end fw-bold fs-5 mt-4">
              Total: ${{ cartTotal.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCartStore } from '@/stores/cart'

export default defineComponent({
  name: 'CartView',
  setup() {
    const cartStore = useCartStore()

    return {
      cartItems: cartStore.productos,
      cartTotal: cartStore.total,
      removeItem: cartStore.eliminarProducto
    }
  }
})
</script>
