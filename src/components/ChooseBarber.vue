<template>
    <div>
      <h3 class="text-lg font-bold mb-2">Selecciona un barbero</h3>
      <div v-if="loading" class="text-gray-500">Cargando barberos...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <ul v-else>
        <li v-for="barber in barbers" :key="barber.id">
          <button 
            @click="$emit('selectBarber', barber)" 
            class="btn-primary"
            :class="{ 'bg-blue-600': selectedBarber?.id === barber.id }"
          >
            {{ barber.user }}
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      selectedBarber: Object
    },
    data() {
      return {
        barbers: [],
        loading: true,
        error: null
      };
    },
    created() {
      this.fetchBarbers();
    },
    methods: {
      async fetchBarbers() {
        try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            throw new Error('No hay token de autenticación');
          }
  
          const response = await axios.get('http://localhost:8000/api/barbers', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Formato de respuesta inválido');
          }
          
          this.barbers = response.data;
        } catch (error) {
          console.error('Error fetching barbers:', error);
          this.error = error.response?.data?.message || 'Error al cargar barberos';
          
          // Manejo específico para errores de autenticación
          if (error.response?.status === 401) {
            this.$router.push('/login');
          }
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>