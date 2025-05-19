<template>
  <div class="container-fluid">
    <div class="row justify-content-center pt-4">
      <div class="col-12 col-lg-10">
        <div class="row mb-4">
          <div class="hero-section text-center py-5">
            <h1 class="growstudio-title mb-4">Productos</h1>
          </div>
        </div>

        <div v-if="loading" class="text-white text-center mb-3">Cargando productos...</div>
        <div v-else-if="error" class="text-danger text-center mb-3">{{ error }}</div>

        <div class="row g-3 justify-content-center">
          <ProductCard
            v-for="producto in products"
            :key="producto.id"
            :producto="producto"
            class="col-12 col-sm-6 col-md-4 col-xl-3 ms-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '../components/ProductCards.vue'

const products = ref([])
const loading = ref(true)
const error = ref(null)

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/products/')
    products.value = response.data
  } catch (err) {
    error.value = 'No se pudieron cargar los productos.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.container-fluid {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  padding: 2rem 0;
  height: 100%;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0;
  }
}
</style>
