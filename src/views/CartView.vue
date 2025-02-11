<template>
  <section class="container-fluid py-5" id="cart-page">
    <!-- Título -->
    <h2 class="text-center text-warning fw-bold mb-4">Tu Carrito</h2>

    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card bg-dark text-light shadow-lg border-0 rounded-4">
          <div class="card-body">
            <!-- Items del carrito -->
            <div v-if="cartItems.length > 0">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="d-flex justify-content-between align-items-center mb-3 p-3 border-bottom"
              >
                <div class="d-flex align-items-center gap-3">
                  <img :src="item.image" alt="" class="img-thumbnail rounded" style="width: 60px; height: 60px;" />
                  <div>
                    <strong>{{ item.name }}</strong>
                    <div class="text">€{{ item.precio.toFixed(2) }}</div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-3">
                  <button
                    @click="updateQuantity(item.id, item.cantidad - 1)"
                    class="btn btn-sm btn-outline-light"
                    :disabled="item.cantidad <= 1"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="fw-bold">{{ item.cantidad }}</span>
                  <button
                    @click="updateQuantity(item.id, item.cantidad + 1)"
                    class="btn btn-sm btn-outline-light"
                    :disabled="item.cantidad >= item.stock"
                  >
                    <i class="bi bi-plus"></i>
                  </button>

                  <button @click="removeItem(item.id)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Total y botón de pago -->
              <div class="d-flex justify-content-between align-items-center mt-4">
                <span class="fs-5 fw-bold">Total: €{{ cartTotal.toFixed(2) }}</span>
                <button @click="handlePayment" class="btn btn-warning fw-bold px-4 py-2">Finalizar Compra</button>
              </div>
            </div>

            <!-- Carrito vacío -->
            <div v-else class="text-center">
              <p class="fs-5">Tu carrito está vacío 🛒</p>
              <button class="btn btn-outline-light" @click="goToShop">Explorar Productos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CartView",
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();

    const cartItems = computed(() => cartStore.productos);
    const cartTotal = computed(() => cartStore.total);

    const removeItem = (id: number) => {
      cartStore.eliminarProducto(id);
    };

    const updateQuantity = (id: number, cantidad: number) => {
      cartStore.actualizarCantidad(id, cantidad);
    };

    const handlePayment = () => {
      alert("Compra realizada con éxito 🎉");
      cartStore.vaciarCarrito();
    };

    const goToShop = () => {
      router.push("/products");
    };

    return { cartItems, cartTotal, removeItem, updateQuantity, handlePayment, goToShop };
  },
});
</script>

<style scoped>
/* Fondo completo y oscuro */
#cart-page {
  background-color: #121212;
  min-height: 100vh;
}

.card {
  border-radius: 15px; /* Bordes redondeados */
}

.card-body {
  padding: 2rem;
}

/* Botón de acciones */
.btn-outline-light {
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: #ff9900;
  border-color: #ff9900;
  color: #000;
}

.btn-outline-danger {
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.btn-warning {
  background-color: #ff9900;
  border: none;
}

.btn-warning:hover {
  background-color: #e68a00;
}
</style>
