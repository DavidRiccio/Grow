<template>
  <div class="booking-form-page d-flex align-items-center min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 col-xl-6">
          <!-- Indicador de progreso -->
          <div class="progress rounded-pill mb-4 bg-dark" style="height: 8px;" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="33">
            <div class="progress-bar bg-warning" :style="`width: ${(step / 3) * 100}%`"></div>
          </div>
          
          <!-- Formulario principal -->
          <div class="booking-form bg-dark rounded-4 shadow-lg p-4 p-lg-5">
            <div class="position-relative mb-4">
              <h2 class="text-center text-warning fw-bold title-font mb-3">
                {{ formTitles[step - 1] }}
              </h2>
              <p class="text-center text-white-50 mb-0">{{ formSubtitles[step - 1] }}</p>
              <div class="step-indicator d-flex justify-content-center gap-2 position-absolute top-0 end-0">
                <span v-for="i in 3" :key="i" 
                      :class="['step-dot', {'active': i <= step, 'completed': i < step}]" 
                      aria-hidden="true"></span>
              </div>
            </div>
            
            <!-- Contenedor de pasos con animación -->
            <div class="step-container mb-4 bg-black bg-opacity-50 rounded-4 p-4 border border-opacity-25 border-warning">
              <!-- Paso 1: Selección de Barbero -->
              <transition name="fade" mode="out-in">
                <StepBarber 
                  v-if="step === 1"
                  @selectBarber="setBarber" 
                  :selected-barber="selectedBarber"
                />
              </transition>
          
              <!-- Paso 2: Selección de Servicio -->
              <transition name="fade" mode="out-in">
                <StepService 
                  v-if="step === 2"
                  @selectService="setService" 
                  :selected-service="selectedService"
                />
              </transition>
          
              <!-- Paso 3: Selección de Fecha -->
              <transition name="fade" mode="out-in">
                <StepDate 
                  v-if="step === 3"
                  :barber="selectedBarber" 
                  :service="selectedService" 
                  @book="bookAppointment" 
                />
              </transition>
            </div>
        
            <!-- Resumen de la selección actual -->
            <div v-if="selectedBarber || selectedService" class="selection-summary bg-black bg-opacity-50 rounded-3 p-3 mb-4 border-start border-4 border-warning">
              <h6 class="text-white-50 mb-2 fs-6">Tu selección actual:</h6>
              <div class="d-flex flex-wrap gap-3">
                <div v-if="selectedBarber" class="badge bg-dark text-warning p-2 d-flex align-items-center">
                  <i class="bi bi-person-fill me-2"></i>
                  <span>{{ selectedBarber.user }}</span>
                </div>
                <div v-if="selectedService" class="badge bg-dark text-warning p-2 d-flex align-items-center">
                  <i class="bi bi-scissors me-2"></i>
                  <span>{{ selectedService.name }} ({{ selectedService.price }} €)</span>
                </div>
              </div>
            </div>
        
            <!-- Controles de navegación -->
            <div class="d-flex justify-content-between gap-3">
              <button 
                v-if="step > 1" 
                @click="previousStep" 
                class="btn btn-outline-warning flex-grow-1 py-2 rounded-pill"
                aria-label="Ir al paso anterior"
              >
                <i class="bi bi-arrow-left me-1"></i> Atrás
              </button>
              
              <button 
                v-if="step < 3" 
                @click="nextStep" 
                class="btn btn-warning flex-grow-1 py-2 text-dark fw-bold rounded-pill"
                :disabled="!isNextButtonEnabled"
                aria-label="Ir al siguiente paso"
              >
                Siguiente <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
          
          <!-- Cancelar reserva -->
          <div class="text-center mt-3">
            <router-link to="/" class="text-white-50 text-decoration-none">
              <i class="bi bi-x-circle me-1"></i> Cancelar reserva
            </router-link>
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
      formTitles: ["Elige tu barbero", "Selecciona el servicio", "Elige fecha y hora"],
      formSubtitles: [
        "Selecciona el profesional con quien quieres reservar",
        "Escoge el tipo de servicio que necesitas",
        "Selecciona un horario disponible para tu cita"
      ]
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
  overflow-x: hidden;
}

.title-font {
  font-family: 'Kanit', sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 0 15px rgba(255, 177, 0, 0.3);
}

.booking-form {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.step-container {
  min-height: 280px;
  transition: all 0.3s ease;
}

.btn-outline-warning {
  border-width: 2px;
  transition: all 0.3s ease;
}

.btn-outline-warning:hover {
  background: rgba(255, 177, 0, 0.2);
  transform: translateY(-2px);
}

.btn-warning {
  background: #ffb100;
  border: 2px solid #ffb100;
  transition: all 0.3s ease;
}

.btn-warning:hover {
  background: #e69a00;
  border-color: #e69a00;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.7;
  background: #444 !important;
  border-color: #666 !important;
  color: #888 !important;
  transform: none !important;
}

/* Indicadores de paso */
.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #333;
  display: inline-block;
  transition: all 0.3s ease;
}

.step-dot.active {
  background-color: #ffb100;
}

.step-dot.completed {
  background-color: #e69a00;
}

/* Animaciones de transición */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .booking-form {
    padding: 1.5rem !important;
  }
  
  .title-font {
    font-size: 1.5rem;
  }
  
  .step-indicator {
    position: static !important;
    margin-top: 1rem;
  }
}
</style>