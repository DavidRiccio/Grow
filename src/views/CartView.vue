<template>
  <div class="cart-page d-flex flex-column justify-content-center align-items-center">
    <h1 class="section-title text-center mb-5">Carrito de Compras</h1>
    <div v-if="cartProducts.length === 0" class="text-center mt-5">
      <p class="text-light fs-4">Tu carrito está vacío. ¡Añade productos!</p>
      <a href="/products" class="btn btn-warning mt-3">Ir a Productos</a>
    </div>
    <div v-else class="w-100 px-3 px-md-5">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="producto in cartProducts" :key="producto.id">
          <div class="card cart-product-card h-100 shadow border-0">
            <img
              :src="producto.image"
              :alt="producto.name"
              class="card-img-top img-fluid"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-warning fw-bold">{{ producto.name }}</h5>
              <p class="card-text text-light fs-6">
                <strong>Precio:</strong> €{{ producto.price }}
              </p>
              <p class="card-text text-light fs-6">
                <strong>Cantidad:</strong> {{ producto.cantidad }}
              </p>
              <button
                class="btn btn-danger fw-bold mt-auto"
                @click="eliminarDelCarrito(producto.id)"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center my-5">
        <h3 class="text-warning mb-4">Total: €{{ total }}</h3>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <button class="btn btn-danger fw-bold" @click="vaciarCarrito">
            Vaciar Carrito
          </button>
          <button class="btn btn-success fw-bold" @click="procesarPago">
            Pagar Ahora
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import axios from "axios";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

const cartProducts = computed(() => cartStore.products);
const total = computed(() => cartStore.total);

const eliminarDelCarrito = (id: number) => {
  cartStore.removeProduct(id);
};

const vaciarCarrito = () => {
  cartStore.emptyCart();
};

const token = localStorage.getItem('token') // o donde guardes el token

const procesarPago = async () => {
  if (cartProducts.value.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  try {
    const productsToSend = cartProducts.value.map(p => ({
      id: p.id,
      quantity: p.cantidad,
    }));

    const response = await axios.post(
      "http://localhost:8000/api/orders/add/",
      { products: productsToSend },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      alert("Pedido realizado con éxito");
      vaciarCarrito();
    } else {
      alert("Error al procesar el pedido");
    }
  } catch (error) {
    console.error(error);
    alert("Error en la petición, revisa la consola.");
  }
};



</script>


<style scoped>
.cart-page {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  color: white;
  min-height: 100vh;
  width: 100vw;
  padding: 2rem 0;
  overflow-y: auto;
}

.cart-product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, background 0.3s ease;
}

.cart-product-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  max-height: 250px;
  object-fit: cover;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-size: 2.5rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  width: 100%;
}

.btn-danger:hover {
  background-color: #ff4d4d;
}

.btn-success:hover {
  background-color: #28a745;
}
</style>
