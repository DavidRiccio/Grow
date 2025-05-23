<template>
  <div class="container-fluid products-page py-5">
    <div class="container">
      <h1 class="section-title text-center mb-4 display-4 fw-bold text-warning">Nuestros Productos</h1>
      
      <!-- Buscador -->
      <div class="search-container mb-4">
        <div class="input-group">
          <span class="input-group-text bg-dark border-warning">
            <i class="bi bi-search text-warning" aria-hidden="true"></i>
          </span>
          <input 
            type="text" 
            class="form-control bg-dark text-light border-warning" 
            placeholder="Buscar productos..." 
            v-model="searchTerm"
            aria-label="Buscar productos"
          >
          <button 
            class="btn btn-warning" 
            type="button" 
            @click="clearSearch"
            v-if="searchTerm"
            aria-label="Limpiar búsqueda"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        
        <!-- Filtros adicionales -->
        <div class="filters mt-3 d-flex flex-wrap gap-2">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="showInStock" id="stockFilter">
            <label class="form-check-label text-light" for="stockFilter">Solo productos en stock</label>
          </div>
          
          <div class="ms-auto">
            <select class="form-select bg-dark text-light border-warning" v-model="sortBy" aria-label="Ordenar por">
              <option value="name">Ordenar por nombre</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="stock">Disponibilidad</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Estado de carga -->
      <div v-if="loading" class="d-flex justify-content-center my-5">
        <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Cargando productos...</span>
        </div>
      </div>
      
      <!-- Mensaje de error -->
      <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
        <div>{{ error }}</div>
      </div>
      
      <!-- Listado de productos filtrados -->
      <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        <div class="col" v-for="producto in filteredProducts" :key="producto.id">
          <article class="card product-card h-100 shadow border-0">
            <div class="card-img-container position-relative">
              <img
                :src="producto.image"
                :alt="producto.name"
                class="card-img-top img-fluid"
              />
              <div class="stock-badge position-absolute top-0 end-0 m-2 badge rounded-pill"
                   :class="producto.stock > 5 ? 'bg-success' : 'bg-warning text-dark'">
                Stock: {{ producto.stock }}
              </div>
            </div>
            
            <div class="card-body d-flex flex-column">
              <h2 class="card-title text-warning fw-bold h5">{{ producto.name }}</h2>
              
              <div class="d-flex justify-content-between align-items-center mb-3">
                <p class="card-text text-light mb-0 fs-5">
                  <span class="visually-hidden">Precio:</span>
                  <strong>{{ producto.price }}€</strong>
                </p>
              </div>
              
              <button
                class="btn btn-warning fw-bold w-100 mt-auto"
                @click="agregarAlCarrito(producto)"
                :disabled="producto.stock === 0"
                :aria-label="`Añadir ${producto.name} al carrito`"
              >
                <i class="bi bi-cart-plus me-2" aria-hidden="true"></i>
                Añadir al carrito
              </button>
            </div>
          </article>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay productos -->
      <div v-if="!loading && !error && filteredProducts.length === 0" class="text-center my-5">
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
          <span v-if="searchTerm">No se encontraron productos que coincidan con "{{ searchTerm }}".</span>
          <span v-else>No hay productos disponibles en este momento.</span>
        </div>
        <button v-if="searchTerm" class="btn btn-warning mt-3" @click="clearSearch">
          <i class="bi bi-arrow-counterclockwise me-2" aria-hidden="true"></i>
          Ver todos los productos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "../stores/cart";


const productos = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref("");
const showInStock = ref(false);
const sortBy = ref("name");


const cartStore = useCartStore();


const filteredProducts = computed(() => {
  let result = [...productos.value];
  
  
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase().trim();
    result = result.filter(producto => 
      producto.name.toLowerCase().includes(term)
    );
  }
  
  
  if (showInStock.value) {
    result = result.filter(producto => producto.stock > 0);
  }
  
  
  switch (sortBy.value) {
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "stock":
      result.sort((a, b) => b.stock - a.stock);
      break;
  }
  
  return result;
});


const clearSearch = () => {
  searchTerm.value = "";
};


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


onMounted(() => {
  fetchProductos();
});
</script>

<style scoped>
/* Página de productos */
.products-page {
  background: radial-gradient(circle at top, #070707, #181818);
  color: white;
  min-height: 100vh;
}

/* Buscador */
.search-container {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.form-control:focus, 
.form-select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.25);
}

.form-check-input:checked {
  background-color: #ffd700;
  border-color: #ffd700;
}

.form-check-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.25);
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
.card-img-container {
  overflow: hidden;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.product-card:hover .card-img-top {
  transform: scale(1.05);
}

/* Stock badge */
.stock-badge {
  font-size: 0.8rem;
  z-index: 1;
}

/* Título y texto */
.card-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.2rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  padding: 0.6rem 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-warning:hover:not(:disabled) {
  background-color: #ffaa00;
  transform: translateY(-2px);
}

.btn-warning:active:not(:disabled) {
  transform: translateY(0);
}

.btn-warning:disabled {
  background-color: #6c757d;
  opacity: 0.65;
}

/* Mejoras de accesibilidad para foco */
.btn-warning:focus,
.btn-warning:focus-visible {
  outline: 3px solid rgba(255, 215, 0, 0.6);
  outline-offset: 2px;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 768px) {
  .card-title {
    font-size: 1.1rem;
  }
  
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters .ms-auto {
    margin-left: 0 !important;
    width: 100%;
  }
}
</style>