<template>
    <div class="summary-view">
      <h2 class="text-xl font-bold mb-4">Resumen de la reserva</h2>
      
      <div class="space-y-4 mb-6">
        <div>
          <label class="summary-label">Barbero:</label>
          <p class="summary-value">{{ bookingDetails.barber.name }}</p>
        </div>
        
        <div>
          <label class="summary-label">Servicio:</label>
          <p class="summary-value">{{ bookingDetails.service.name }} - ${{ bookingDetails.service.price }}</p>
        </div>
        
        <div>
          <label class="summary-label">Fecha:</label>
          <p class="summary-value">{{ formattedDate }}</p>
        </div>
        
        <div>
          <label class="summary-label">Horario:</label>
          <p class="summary-value">{{ bookingDetails.slot.start_time }} - {{ bookingDetails.slot.end_time }}</p>
        </div>
      </div>
  
      <div class="flex gap-4">
        <button @click="$emit('go-back')" class="btn-secondary">
          ← Volver
        </button>
        <button @click="confirmBooking" class="btn-primary" :disabled="loading">
          <span v-if="loading">Confirmando...</span>
          <span v-else>Confirmar reserva</span>
        </button>
      </div>
  
      <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      bookingDetails: {
        type: Object,
        required: true,
        validator: value => {
          return (
            value.barber?.id &&
            value.service?.id &&
            value.date &&
            value.slot?.id
          );
        }
      }
    },
    data() {
      return {
        loading: false,
        error: null
      };
    },
    computed: {
      formattedDate() {
        const date = new Date(this.bookingDetails.date);
        return date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    },
    methods: {
      async confirmBooking() {
        this.loading = true;
        this.error = null;
        
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No autenticado');
  
          const response = await axios.post(
            'http://localhost:8000/api/bookings/add/',
            {
              barber_id: this.bookingDetails.barber.id,
              service_id: this.bookingDetails.service.id,
              date: this.bookingDetails.date,
              time_slot_id: this.bookingDetails.slot.id
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
  
          if (response.data.success) {
            this.$emit('booking-success', response.data.booking);
          } else {
            throw new Error(response.data.message || 'Error al confirmar la reserva');
          }
        } catch (error) {
          console.error('Booking error:', error);
          this.error = error.response?.data?.detail || 
                      error.message || 
                      'Error al realizar la reserva';
          
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
  
  <style scoped>
  .summary-view {
    @apply max-w-md mx-auto p-6 bg-white rounded-lg shadow-md;
  }
  
  .summary-label {
    @apply block text-sm font-medium text-gray-700;
  }
  
  .summary-value {
    @apply mt-1 text-lg text-gray-900;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors;
  }
  </style>