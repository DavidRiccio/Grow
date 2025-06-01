<template>
  <main class="bg-dark text-white py-5 min-vh-100" aria-labelledby="cart-title">
    <div class="container">
      <h1
        id="cart-title"
        class="text-warning fw-bold mb-5 text-center display-5"
        style="font-family: Kanit, sans-serif;"
      >
        Carrito de Compras
      </h1>

      <!-- Carrito vacío -->
      <div
        v-if="cartProducts.length === 0"
        class="text-center my-5 py-4 mx-auto"
        style="max-width: 500px;"
      >
        <div class="mb-3">
          <i class="bi bi-cart text-warning display-1" aria-hidden="true"></i>
        </div>
        <p class="fs-4 text-light mb-4">Tu carrito está vacío. ¡Añade productos!</p>
        <router-link
          to="/products"
          class="btn btn-warning px-4 py-2 fw-semibold"
          role="button"
          aria-label="Ir a la sección de productos"
        >
          <i class="bi bi-bag-plus me-2" aria-hidden="true"></i>Ir a Productos
        </router-link>
      </div>

      <!-- Carrito con productos -->
      <div v-else>
        <!-- Lista de productos -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
          <div class="col" v-for="producto in cartProducts" :key="producto.id">
            <article class="card h-100 bg-dark bg-opacity-75 border border-secondary border-opacity-25 shadow rounded-4">
              <div class="position-relative">
                <img
                  :src="producto.image"
                  :alt="producto.name"
                  class="card-img-top rounded-top-4"
                  style="height: 220px; object-fit: cover;"
                  loading="lazy"
                />
                <span class="position-absolute top-0 end-0 m-2 badge bg-warning text-dark fw-bold">
                  €{{ producto.price || producto.precio }}
                </span>
              </div>
              <div class="card-body d-flex flex-column">
                <h2 class="card-title h5 text-warning fw-bold mb-3">{{ producto.name }}</h2>
                <div class="d-flex align-items-center bg-dark bg-opacity-50 p-2 rounded-3 mb-3">
                  <button
                    class="btn btn-outline-warning btn-sm"
                    @click="actualizarCantidad(producto.id, producto.cantidad - 1)"
                    :disabled="producto.cantidad <= 1"
                    aria-label="Disminuir cantidad"
                  >
                    <i class="bi bi-dash" aria-hidden="true"></i>
                  </button>
                  <input
                    type="number"
                    class="form-control form-control-sm mx-2 text-center bg-transparent text-white border-0"
                    style="max-width: 60px; -moz-appearance: textfield;"
                    v-model.number="producto.cantidad"
                    min="1"
                    :max="producto.stock"
                    :aria-label="`Cantidad: ${producto.cantidad} de ${producto.name}`"
                    @change="actualizarCantidad(producto.id, producto.cantidad)"
                  />
                  <button
                    class="btn btn-outline-warning btn-sm"
                    @click="actualizarCantidad(producto.id, producto.cantidad + 1)"
                    :disabled="producto.cantidad >= producto.stock"
                    aria-label="Aumentar cantidad"
                  >
                    <i class="bi bi-plus" aria-hidden="true"></i>
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <span class="text-light">
                    Subtotal:
                    <strong class="text-warning">€{{ ((producto.price || producto.precio) * producto.cantidad).toFixed(2) }}</strong>
                  </span>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="eliminarDelCarrito(producto.id)"
                    aria-label="Eliminar producto del carrito"
                  >
                    <i class="bi bi-trash me-1" aria-hidden="true"></i>
                    <span class="d-none d-sm-inline">Eliminar</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Resumen -->
        <div class="bg-dark bg-opacity-75 rounded-4 p-4 shadow-lg mt-4 border-start border-warning border-4 border-opacity-50">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3 mb-md-0">
              <h3 class="h4 text-warning mb-2">Resumen del carrito</h3>
              <div class="d-flex justify-content-between">
                <span class="text-white-50">Productos:</span>
                <span class="text-white">{{ cartProducts.length }}</span>
              </div>
              <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
                <span class="text-white">Total:</span>
                <span class="text-warning">€{{ total.toFixed(2) }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button class="btn btn-outline-danger" @click="vaciarCarrito" aria-label="Vaciar todo el carrito">
                  <i class="bi bi-trash me-2" aria-hidden="true"></i>Vaciar
                </button>
                <button class="btn btn-outline-warning" @click="pagarTarde" :disabled="isProcessing" aria-label="Pagar más tarde">
                  <i class="bi bi-arrow-right"></i> Pagar más Tarde
                </button>
                <button class="btn btn-outline-success" @click="procesarPago" :disabled="isProcessing" aria-label="Proceder con el pago">
                  <i class="bi bi-credit-card me-2" aria-hidden="true"></i>
                  {{ isProcessing ? "Procesando..." : "Pagar Ahora" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCartStore, useUserStore } from "../stores/userStore";

const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();
const isProcessing = ref(false);

const cartProducts = computed(() => cartStore.productos);
const total = computed(() => cartStore.total);

const eliminarDelCarrito = (id: number) => {
  cartStore.eliminarProducto(id);
};

const vaciarCarrito = () => {
  cartStore.vaciarCarrito();
};

const actualizarCantidad = (id: number, nuevaCantidad: number) => {
  const product = cartProducts.value.find((p) => p.id === id);
  if (!product) return;

  if (nuevaCantidad > product.stock) {
    alert(`Solo puedes agregar hasta ${product.stock} unidades de este producto.`);
    nuevaCantidad = product.stock;
  }
  if (nuevaCantidad < 1) {
    alert("La cantidad mínima es 1.");
    return;
  }

  cartStore.actualizarCantidad(id, nuevaCantidad);
};

const pagarTarde = async () => {
  if (cartProducts.value.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  if (!userStore.token) {
    alert("Debes iniciar sesión para proceder con el pago.");
    router.push("/login");
    return;
  }

  try {
    isProcessing.value = true;
    const productsToSend = cartProducts.value.map((p) => ({ id: p.id, quantity: p.cantidad }));
    const response = await axios.post(
      "http://localhost:8000/api/orders/add/",
      { products: productsToSend },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );

    if (response.status === 201 || response.status === 200) {
      vaciarCarrito();
      router.push("/profile");
    } else {
      alert("Error al procesar el pedido");
    }
  } catch (error: any) {
    console.error("Error al crear la orden:", error);
    if (error.response?.status === 401) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      router.push("/login");
    } else if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert("Error en la petición, revisa la consola.");
    }
  } finally {
    isProcessing.value = false;
  }
};

const procesarPago = async () => {
  if (cartProducts.value.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  if (!userStore.token) {
    alert("Debes iniciar sesión para proceder con el pago.");
    router.push("/login");
    return;
  }

  try {
    isProcessing.value = true;
    const productsToSend = cartProducts.value.map((p) => ({ id: p.id, quantity: p.cantidad }));
    const response = await axios.post(
      "http://localhost:8000/api/orders/add/",
      { products: productsToSend },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );

    if (response.status === 201 || response.status === 200) {
      const orderPk = response.data.order_id || response.data.id;
      if (!orderPk) {
        console.error("No se recibió el ID de la orden:", response.data);
        alert("Error: No se pudo obtener el ID de la orden.");
        return;
      }
      vaciarCarrito();
      router.push({ name: 'Payment', params: { orderPk } });
    } else {
      alert("Error al procesar el pedido");
    }
  } catch (error: any) {
    console.error("Error al crear la orden:", error);
    if (error.response?.status === 401) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      router.push("/login");
    } else if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert("Error en la petición, revisa la consola.");
    }
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  // Inicializar el store de usuario para recuperar datos del localStorage
  userStore.initialize();
});
</script>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

main {
  background: radial-gradient(circle at top, #070707, #181818);
}

@media (max-width: 767.98px) {
  .border-start.border-warning {
    border-left: none !important;
    border-top: 4px solid rgba(255, 215, 0, 0.5) !important;
  }
}
</style>