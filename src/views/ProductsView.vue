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
      
      <!-- Listado de productos -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
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
                  <strong>{{ producto.price }}€</strong>
                </p>
              </div>
              
              <button
                class="btn btn-warning fw-bold w-100 mt-auto"
                @click="agregarAlCarrito(producto)"
                :disabled="producto.stock === 0"
              >
                <i class="bi bi-cart-plus me-2"></i>
                {{ isAuthenticated ? 'Añadir al carrito' : 'Iniciar sesión para comprar' }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
    
    <!-- Toast de confirmación -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast align-items-center border-0 show"
        :class="toast.type === 'error' ? 'text-bg-danger' : 'text-bg-success'"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :style="{ transition: 'opacity 0.5s ease-in-out' }"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ toast.message }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="removeToast(toast.id)"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const productos = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref("");
const showInStock = ref(false);
const sortBy = ref("name");
const toasts = ref([]);
let toastCounter = 0;

const cartStore = useCartStore();
const userStore = useUserStore();

// Computed para verificar si el usuario está autenticado
const isAuthenticated = computed(() => {
  return userStore.isAuthenticated;
});

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

const agregarAlCarrito = (producto: any) => {
  // Verificar si el usuario está autenticado
  if (!isAuthenticated.value) {
    // Guardar la URL actual para redirigir después del login
    const currentRoute = router.currentRoute.value.fullPath;
    
    // Mostrar mensaje informativo
    showToast("Debes iniciar sesión para añadir productos al carrito", "error");
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      router.push({
        name: 'login', // Asegúrate de que esta sea la ruta correcta de tu login
        query: { redirect: currentRoute } // Para redirigir de vuelta después del login
      });
    }, 1500);
    
    return;
  }

  // Si está autenticado, proceder normalmente
  const productoEnCarrito = cartStore.productos.find((p) => p.id === producto.id);
  if (productoEnCarrito) {
    const nuevaCantidad = productoEnCarrito.cantidad + 1;
    if (nuevaCantidad <= producto.stock) {
      cartStore.actualizarCantidad(producto.id, nuevaCantidad);
      showToast(`Añadiste ${producto.name} al carrito.`);
    } else {
      showToast("No hay suficiente stock disponible.", "error");
    }
  } else {
    // Añadir nuevo producto al carrito
    const nuevosProductos = [...cartStore.productos, { 
      ...producto, 
      cantidad: 1,
      precio: producto.price // Mapear price a precio para que coincida con tu store
    }];
    cartStore.setProductos(nuevosProductos);
    showToast(`Añadiste ${producto.name} al carrito.`);
  }
};

const clearSearch = () => {
  searchTerm.value = "";
};

const showToast = (message: string, type = "success") => {
  const id = ++toastCounter;
  toasts.value.push({ id, message, type });
  setTimeout(() => removeToast(id), 3000);
};

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

onMounted(() => {
  // Inicializar el store de usuario para recuperar datos del localStorage
  userStore.initialize();
  
  fetch("http://localhost:8000/api/products/")
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener los productos.");
      return response.json();
    })
    .then(data => (productos.value = data))
    .catch(err => (error.value = err.message))
    .finally(() => (loading.value = false));
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