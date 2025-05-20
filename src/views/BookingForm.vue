<template>
    <div class="booking-form max-w-md mx-auto p-4">
      <h2 class="text-xl font-bold mb-4">Formulario de Reserva</h2>
      
      <!-- Paso 1: Selección de Barbero -->
      <div v-if="step === 1" class="step-container">
        <StepBarber 
          @selectBarber="setBarber" 
          :selected-barber="selectedBarber"
        />
      </div>
  
      <!-- Paso 2: Selección de Servicio -->
      <div v-else-if="step === 2" class="step-container">
        <StepService 
          @selectService="setService" 
          :selected-service="selectedService"
        />
      </div>
  
      <!-- Paso 3: Selección de Fecha -->
      <div v-else-if="step === 3" class="step-container">
        <StepDate 
          :barber="selectedBarber" 
          :service="selectedService" 
          @book="bookAppointment" 
        />
      </div>
  
      <!-- Controles de navegación -->
      <div class="flex gap-2 mt-4">
        <button 
          v-if="step > 1" 
          @click="previousStep" 
          class="btn-secondary flex-1"
        >
          ← Atrás
        </button>
        
        <button 
          v-if="step < 3" 
          @click="nextStep" 
          class="btn-primary flex-1"
          :disabled="!isNextButtonEnabled"
          :class="{ 'opacity-50 cursor-not-allowed': !isNextButtonEnabled }"
        >
          Siguiente →
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import StepBarber from "@/components/ChooseBarber.vue";
  import StepService from "@/components/ChooseService.vue";
  import StepDate from "@/components/ChooseDate.vue";
  
  export default {
    name: "BookingForm",
    components: { StepBarber, StepService, StepDate },
    data() {
      return {
        step: 1,
        selectedBarber: null,
        selectedService: null,
      };
    },
    computed: {
      isNextButtonEnabled() {
        switch(this.step) {
          case 1: return !!this.selectedBarber;
          case 2: return !!this.selectedService;
          default: return true;
        }
      }
    },
    methods: {
      setBarber(barber) {
        this.selectedBarber = barber;
        this.nextStep();
      },
      setService(service) {
        this.selectedService = service;
        this.nextStep();
      },
      nextStep() {
        if (this.isNextButtonEnabled) this.step++;
      },
      previousStep() {
        this.step--;
        // Limpiar selecciones posteriores al retroceder
        if (this.step === 1) this.selectedService = null;
      },
      bookAppointment(details) {
        console.log("Reserva confirmada:", details);
        // Aquí deberías hacer el POST final al backend
        alert(`Reserva confirmada para ${details.date} con ${details.barber.name}`);
      },
    },
  };
  </script>
  
  <style>
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors;
  }
  
  .step-container {
    @apply border p-4 rounded-lg bg-white shadow-sm;
  }
  </style>