<template>
  <div>
    <h3 class="text-lg text-white mb-4">Horarios</h3>

    <!-- Selector de fecha -->
    <div class="mb-4 d-flex gap-2 overflow-auto pb-2">
      <button
        v-for="date in availableDates"
        :key="date"
        @click="updateSelectedDate(date)"
        class="btn px-3 py-1.5 text-sm rounded border flex-shrink-0"
        :class="{
          'bg-warning text-white border-warning': selectedDate === date,
          'hover-bg-light': selectedDate !== date
        }"
      >
        {{ formatDateHeader(date) }}
      </button>
    </div>

    <!-- Listado de horarios -->
    <div v-if="loading" class="text-muted text-center py-4 small">
      <i class="fas fa-spinner fa-spin me-2"></i>Cargando horarios...
    </div>

    <div v-else-if="error" class="text-danger text-center py-4 small">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="filteredSlots.length > 0" class="row g-3">
        <div
          v-for="slot in filteredSlots"
          :key="slot.id"
          class="col-6 col-md-4 col-lg-3"
        >
          <button
            @click="selectSlot(slot)"
            class="btn w-100 text-start d-flex justify-content-between align-items-center shadow-sm"
            :class="{
              'selected-slot': isSlotSelected(slot),
              'unselected-slot': !isSlotSelected(slot)
            }"
            style="min-height: 70px;"
          >
            <div>
              <div class="fw-semibold">{{ slot.start_time }} - {{ slot.end_time }}</div>
              <small class="text-muted">{{ calculateDuration(slot) }} min</small>
            </div>
          </button>
        </div>
      </div>
      <div class="mt-4 text-end" v-if="selectedSlot">
        <button
          @click="confirmBooking"
          class="btn btn-success"
        >
          Confirmar Reserva
        </button>
      </div>
      <div v-else class="text-muted text-center py-4 small">
        No hay horarios disponibles para la fecha seleccionada.
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
      this.selectedSlot = null; // Deseleccionar el slot cuando cambie la fecha
    },

    selectSlot(slot) {
      this.selectedSlot = slot;
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

        alert(`Reserva confirmada con éxito. ID: ${response.data.id}`);
        this.selectedSlot = null;

        // Redirigir al inicio
        this.$router.push("/");
      } catch (error) {
        console.error("Error al confirmar la reserva:", error);
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
  },
};
</script>

<style scoped>
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

button {
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  user-select: none;
}

button:hover {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  transform: translateY(-3px);
}

.selected-slot {
  background-color: #ffd700 !important; /* Bootstrap primary */
  color: white !important;
  border: 2px solid #ffd700 !important;
  box-shadow: 0 0 10px #ffd700;
}

.unselected-slot {
  background-color: white;
  color: #212529;
  border: 1.5px solid #ced4da;
}
</style>
