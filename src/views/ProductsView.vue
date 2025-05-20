<template>
  <div class="container-fluid products-page">
    <h1 class="section-title text-center my-5">Nuestros Productos</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="producto in productos" :key="producto.id">
        <div class="card product-card h-100 shadow border-0">
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
              <strong>Stock:</strong> {{ producto.stock }}
            </p>
            <button
              class="btn btn-warning fw-bold mt-auto"
              @click="agregarAlCarrito(producto)"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";

// Variables reactivas
const productos = ref([]);
const loading = ref(true);
const error = ref(null);

// Store del carrito
const cartStore = useCartStore();

// Obtener productos del backend
const fetchProductos = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/products/");
    if (!response.ok) {
      throw new Error("Error al obtener los productos.");
    }
    productos.value = await response.json();
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Agregar producto al carrito
const agregarAlCarrito = (producto: any) => {
  const productoEnCarrito = cartStore.products.find((p) => p.id === producto.id);

  if (productoEnCarrito) {
    const nuevaCantidad = productoEnCarrito.cantidad + 1;
    if (nuevaCantidad <= producto.stock) {
      cartStore.addProduct({ ...producto, cantidad: nuevaCantidad });
    } else {
      alert("No hay suficiente stock disponible.");
    }
  } else {
    cartStore.addProduct({ ...producto, cantidad: 1 });
  }
};

// Llamar al fetch al montar el componente
onMounted(() => {
  fetchProductos();
});
</script>


<style scoped>
/* Página de productos */
.products-page {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  color: white;
  min-height: 100vh;
  padding: 2rem;
}

/* Tarjetas de productos */
.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, background 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Imagen */
.card-img-top {
  max-height: 250px;
  object-fit: cover;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

/* Título y texto */
.card-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.2rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

.card-text {
  font-family: "Poppins", sans-serif;
  color: rgba(255, 255, 255, 0.8);
}

/* Botón */
.btn-warning {
  color: #1a1a1a;
  background-color: #ffd700;
  border: none;
  padding: 0.5rem 1.5rem;
  transition: background-color 0.3s ease;
}

.btn-warning:hover {
  background-color: #ffaa00;
}
</style>
