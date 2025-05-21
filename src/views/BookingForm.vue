<template>
  <div class="booking-form-page vh-100">
    <div class="container h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-12 col-md-10 col-lg-8 col-xl-6">
          <div class="booking-form bg-dark rounded-4 shadow-lg p-4 p-md-5 border border-warning">
            <h2 class="text-center text-warning fw-bold mb-4 title-font">Reserva tu cita</h2>
            
            <!-- Paso 1: Selección de Barbero -->
            <div v-if="step === 1" class="step-container mb-4 bg-black rounded-3 p-3 border border-warning">
              <StepBarber 
                @selectBarber="setBarber" 
                :selected-barber="selectedBarber"
              />
            </div>
        
            <!-- Paso 2: Selección de Servicio -->
            <div v-else-if="step === 2" class="step-container mb-4 bg-black rounded-3 p-3 border border-warning">
              <StepService 
                @selectService="setService" 
                :selected-service="selectedService"
              />
            </div>
        
            <!-- Paso 3: Selección de Fecha -->
            <div v-else-if="step === 3" class="step-container mb-4 bg-black rounded-3 p-3 border border-warning">
              <StepDate 
                :barber="selectedBarber" 
                :service="selectedService" 
                @book="bookAppointment" 
              />
            </div>
        
            <!-- Controles de navegación -->
            <div class="d-flex justify-content-between gap-2">
              <button 
                v-if="step > 1" 
                @click="previousStep" 
                class="btn btn-outline-warning flex-grow-1 py-2"
              >
                <i class="bi bi-arrow-left me-2"></i>Atrás
              </button>
              
              <button 
                v-if="step < 3" 
                @click="nextStep" 
                class="btn btn-warning flex-grow-1 py-2 text-dark fw-bold"
                :disabled="!isNextButtonEnabled"
              >
                Siguiente <i class="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
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
      switch (this.step) {
        case 1: return !!this.selectedBarber;
        case 2: return !!this.selectedService;
        default: return true;
      }
    },
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
      if (this.step === 1) this.selectedService = null;
    },
    bookAppointment(details) {
      alert(`Reserva confirmada para ${details.date} con ${details.barber.name}`);
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@700&family=Poppins:wght@400;600&display=swap');

.booking-form-page {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
}

.title-font {
  font-family: 'Kanit', sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.booking-form {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.1) !important;
  transition: all 0.3s ease;
}

.step-container {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 215, 0, 0.3) !important;
}

.btn-outline-warning {
  border-width: 2px;
  transition: all 0.3s ease;
}

.btn-outline-warning:hover {
  background: rgba(255, 215, 0, 0.1);
}

.btn-warning {
  background: #ffd700;
  border: 2px solid #ffd700;
  transition: all 0.3s ease;
}

.btn-warning:hover {
  background: #ffaa00;
  border-color: #ffaa00;
}

.btn:disabled {
  opacity: 0.7;
  background: #444 !important;
  border-color: #666 !important;
  color: #888 !important;
}

@media (max-width: 768px) {
  .booking-form {
    margin: 1rem;
    padding: 1.5rem !important;
  }
  
  .title-font {
    font-size: 1.75rem;
  }
}
</style>