<template>
  <div class="time-slots-container">
    <div class="container-fluid p-0">
      <!-- Notificación de éxito -->
      <div 
        v-if="showSuccessNotification" 
        class="success-notification position-fixed top-0 start-50 translate-middle-x mt-3"
        style="z-index: 1050;"
        role="alert" 
        aria-live="assertive"
      >
        <div class="alert alert-success d-flex align-items-center shadow-lg border-0 rounded-3 px-4 py-3">
          <i class="bi bi-check-circle-fill text-success me-3 fs-4" aria-hidden="true"></i>
          <div>
            <div class="fw-bold">¡Reserva confirmada!</div>
            <small class="text-muted">ID de reserva: {{ bookingId }}</small>
          </div>
          <button 
            @click="showSuccessNotification = false"
            class="btn-close ms-3"
            aria-label="Cerrar notificación"
          ></button>
        </div>
      </div>

      <h3 class="section-title text-white mb-3">
        <i class="bi bi-clock me-2" aria-hidden="true"></i>
        Horarios Disponibles
      </h3>

      <!-- Selector de fecha -->
      <div class="date-selector mb-4" role="group" aria-label="Selector de fechas disponibles">
        <div class="d-flex gap-2 overflow-auto pb-2">
          <button
            v-for="date in availableDates"
            :key="date"
            @click="updateSelectedDate(date)"
            @keydown.enter="updateSelectedDate(date)"
            @keydown.space.prevent="updateSelectedDate(date)"
            class="btn date-btn flex-shrink-0"
            :class="{
              'btn-warning': selectedDate === date,
              'btn-outline-light': selectedDate !== date
            }"
            :aria-pressed="selectedDate === date"
            :aria-label="`${selectedDate === date ? 'Fecha seleccionada' : 'Seleccionar fecha'} ${formatDateHeader(date)}`"
          >
            {{ formatDateHeader(date) }}
          </button>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="text-center p-4" role="status" aria-live="polite">
        <div class="spinner-border text-warning mb-2" style="width: 2rem; height: 2rem;" aria-label="Cargando horarios">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-white-50 mb-0 small">Cargando horarios...</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center p-3" role="alert" aria-live="assertive">
        <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
        <span>{{ error }}</span>
      </div>

      <!-- Listado de horarios -->
      <div v-else>
        <div v-if="filteredSlots.length > 0" class="row g-3" role="group" aria-label="Horarios disponibles">
          <div
            v-for="(slot, index) in filteredSlots"
            :key="slot.id"
            class="col-6 col-md-4 col-lg-3"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <button
              @click="selectSlot(slot)"
              @keydown.enter="selectSlot(slot)"
              @keydown.space.prevent="selectSlot(slot)"
              class="btn slot-card w-100 p-3"
              :class="{
                'slot-selected': isSlotSelected(slot),
                'slot-available': !isSlotSelected(slot)
              }"
              :aria-pressed="isSlotSelected(slot)"
              :aria-label="`${isSlotSelected(slot) ? 'Deseleccionar' : 'Seleccionar'} horario de ${slot.start_time} a ${slot.end_time}, duración ${calculateDuration(slot)} minutos`"
            >
              <div class="d-flex flex-column align-items-center text-center">
                <div class="slot-time fw-bold mb-1">
                  {{ slot.start_time }} - {{ slot.end_time }}
                </div>
                <small class="slot-duration">
                  <i class="bi bi-clock me-1" aria-hidden="true"></i>
                  {{ calculateDuration(slot) }} min
                </small>
              </div>
            </button>
          </div>
        </div>

        <!-- Botón de confirmar reserva -->
        <div v-if="selectedSlot" class="d-flex justify-content-end mt-4">
          <button
            @click="confirmBooking"
            class="btn btn-success btn-lg px-4"
            aria-label="Confirmar reserva para el horario seleccionado"
          >
            <i class="bi bi-check-circle me-2" aria-hidden="true"></i>
            Confirmar Reserva
          </button>
        </div>

        <!-- Estado vacío -->
        <div v-if="selectedDate && filteredSlots.length === 0" class="text-center p-4" role="status" aria-live="polite">
          <div class="alert alert-info">
            <i class="bi bi-info-circle mb-2 d-block" aria-hidden="true"></i>
            <p class="mb-0">No hay horarios disponibles para la fecha seleccionada.</p>
          </div>
        </div>
      </div>

      <!-- Información de selección para lectores de pantalla -->
      <div v-if="selectedSlot && selectedDate" class="visually-hidden" role="status" aria-live="polite">
        Horario seleccionado: {{ selectedSlot.start_time }} a {{ selectedSlot.end_time }} el {{ formatDateHeader(selectedDate) }}, 
        duración {{ calculateDuration(selectedSlot) }} minutos
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    barber: {
      type: Object,
      required: true,
      validator: (value) => value.id && value.name,
    },
    service: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      availableDates: [],
      timeSlots: {},
      loading: false,
      error: null,
      selectedDate: null,
      selectedSlot: null,
      showSuccessNotification: false,
      bookingId: null,
    };
  },
  computed: {
    filteredSlots() {
      return this.selectedDate ? this.timeSlots[this.selectedDate] || [] : [];
    },
  },
  watch: {
    barber: {
      immediate: true,
      handler: "fetchAvailability",
    },
  },
  methods: {
    async fetchAvailability() {
      this.loading = true;
      this.error = null;
      this.selectedDate = null;
      this.selectedSlot = null;

      try {
        const response = await axios.get(
          "http://localhost:8000/api/bookings/dates/",
          {
            params: {
              barber_id: this.barber.id,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.available_dates) {
          this.timeSlots = response.data.available_dates;
          this.availableDates = Object.keys(this.timeSlots).sort();

          for (const date of this.availableDates) {
            if ((this.timeSlots[date] || []).length > 0) {
              this.selectedDate = date;
              break;
            }
          }

          if (!this.selectedDate) {
            this.selectedDate = null;
          }
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    updateSelectedDate(date) {
      this.selectedDate = date;
      this.selectedSlot = null;
      
      // Anunciar cambio para accesibilidad
      this.$nextTick(() => {
        const announcement = `Fecha ${this.formatDateHeader(date)} seleccionada`;
        this.announceToScreenReader(announcement);
      });
    },

    selectSlot(slot) {
      this.selectedSlot = slot;
      
      // Anunciar cambio para accesibilidad
      this.$nextTick(() => {
        const announcement = `Horario ${slot.start_time} a ${slot.end_time} seleccionado, duración ${this.calculateDuration(slot)} minutos`;
        this.announceToScreenReader(announcement);
      });
    },

    isSlotSelected(slot) {
      return this.selectedSlot?.id === slot.id;
    },

    formatDateHeader(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      }).replace(/\./g, "");
    },

    calculateDuration(slot) {
      const [startHours, startMinutes] = slot.start_time.split(":").map(Number);
      const [endHours, endMinutes] = slot.end_time.split(":").map(Number);
      return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    },

    async confirmBooking() {
      if (!this.selectedSlot || !this.selectedDate) return;

      try {
        const payload = {
          service: this.service.id,
          date: this.selectedDate,
          time_slot: this.selectedSlot.id,
          barber: this.barber.id,
        };

        const response = await axios.post(
          "http://localhost:8000/api/bookings/add/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Mostrar notificación moderna
        this.bookingId = response.data.id;
        this.showSuccessNotification = true;
        this.selectedSlot = null;

        // Auto-ocultar después de 4 segundos
        setTimeout(() => {
          this.showSuccessNotification = false;
        }, 4000);

        // Redirigir al inicio después de 2 segundos
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);

      } catch (error) {
        console.error("Error al confirmar la reserva:", error);
        // También podríamos crear una notificación de error similar
        alert("No se pudo confirmar la reserva. Inténtelo de nuevo.");
      }
    },

    handleError(error) {
      if (error.response?.status === 401) {
        this.error = "Sesión expirada";
        this.$router.push("/login");
      } else {
        this.error = error.response?.data?.error || "Error al cargar horarios";
      }
    },

    announceToScreenReader(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'visually-hidden';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  },
};
</script>

<style scoped>
/* Notificación de éxito */
.success-notification {
  animation: slideInDown 0.5s ease-out;
}

.success-notification .alert-success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 1px solid #28a745;
  min-width: 300px;
  max-width: 400px;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Contenedor principal */
.time-slots-container {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  min-height: 300px;
}

/* Título */
.section-title {
  font-size: 1.4rem;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  margin-bottom: 1rem;
}

/* Selector de fechas */
.date-selector {
  max-width: 100%;
  overflow-x: auto;
}

.date-btn {
  white-space: nowrap;
  min-width: 80px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.date-btn:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

/* Cards de horarios */
.slot-card {
  min-height: 80px;
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.slot-available {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 215, 0, 0.15);
  color: #ffffff;
  backdrop-filter: blur(15px);
}

.slot-available:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.3);
}

.slot-selected {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.08));
  border: 2px solid rgba(255, 215, 0, 0.6);
  color: #ffd700;
  box-shadow: 0 6px 15px rgba(255, 215, 0, 0.25);
}

.slot-card:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

/* Texto de horarios */
.slot-time {
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.slot-duration {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
}

.slot-selected .slot-duration {
  color: rgba(255, 215, 0, 0.8);
}

/* Estados de error y vacío */
.alert-danger {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.12), rgba(220, 53, 69, 0.08));
  border: 1px solid rgba(220, 53, 69, 0.25);
  color: #ff6b7a;
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.alert-info {
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.12), rgba(13, 202, 240, 0.08));
  border: 1px solid rgba(13, 202, 240, 0.25);
  color: #7dd3fc;
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

/* Texto auxiliar */
.text-white-50 {
  color: rgba(255, 255, 255, 0.65) !important;
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 575.98px) {
  .time-slots-container {
    padding: 1rem;
    border-radius: 8px;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .date-btn {
    min-width: 70px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .slot-card {
    min-height: 70px;
    padding: 0.75rem !important;
  }
  
  .slot-time {
    font-size: 0.8rem;
  }
  
  .slot-duration {
    font-size: 0.7rem;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .slot-card {
    min-height: 75px;
  }
  
  .slot-time {
    font-size: 0.85rem;
  }
}

@media (min-width: 768px) {
  .slot-card {
    min-height: 85px;
  }
  
  .slot-time {
    font-size: 0.95rem;
  }
}

/* Orientación paisaje en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  .time-slots-container {
    padding: 0.75rem;
  }
  
  .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .slot-card {
    min-height: 60px;
    padding: 0.5rem !important;
  }
  
  .slot-time {
    font-size: 0.75rem;
  }
  
  .slot-duration {
    font-size: 0.65rem;
  }
}

/* Preferencias de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .slot-card,
  .date-btn {
    transition: none !important;
  }
  
  .slot-card:hover {
    transform: none !important;
  }
  
  .slot-card {
    animation: none !important;
    opacity: 1 !important;
  }
}

@media (prefers-contrast: high) {
  .slot-available {
    border: 2px solid #ffd700 !important;
    background: rgba(0, 0, 0, 0.85) !important;
    color: #ffffff !important;
  }
  
  .slot-selected {
    background: rgba(255, 215, 0, 0.2) !important;
    border-color: #ffd700 !important;
    color: #ffffff !important;
  }
  
  .date-btn {
    border-width: 2px !important;
  }
}

/* Dispositivos táctiles */
@media (hover: none) and (pointer: coarse) {
  .slot-card:hover {
    transform: none;
  }
  
  .slot-card {
    min-height: 80px;
  }
  
  .date-btn {
    padding: 0.6rem 1rem;
  }
}
</style>