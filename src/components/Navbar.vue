<template>
  <nav class="navbar  navbar-light bg-white fixed-top shadow-sm">
    <div class="container">

      <div class="d-flex justify-content-center mx-auto">
        <div class="d-flex gap-4">
          <div class="circle-hover">
            <router-link to="/" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span><img src="../assets/img/Logo principal con tagline.png" alt="Logillo" width="50px"></span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Inicio</span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/products" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Productos</span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/contact" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Contacto</span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/cart" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Carrito</span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/courses" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Cursos</span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/haircuts" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Cortes</span>
              </div>
            </router-link>
          </div>
          <div class="circle-hover">
            <router-link to="/events" class="text-decoration-none text-dark">
              <div class="circle-container">
                <span class="circle-text">Eventos</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCartStore } from '@/stores/cart'

export default defineComponent({
  name: 'Navbar',
  computed: {
    cartCount(): number {
      const cartStore = useCartStore()
      return cartStore.total
    }
  }
})
</script>

<style scoped>
</style>
