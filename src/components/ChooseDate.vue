<template>
    <div>
      <h3 class="text-lg font-semibold mb-4">Horarios para {{ barber.name }}</h3>
  
      <!-- Selector de fecha -->
      <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="date in availableDates"
          :key="date"
          @click="selectedDate = date"
          class="px-3 py-1.5 min-w-[100px] text-sm rounded-md border transition-colors"
          :class="{
            'bg-blue-500 text-white border-blue-600': selectedDate === date,
            'hover:bg-gray-100': selectedDate !== date
          }"
        >
          {{ formatDateHeader(date) }}
        </button>
      </div>
  
      <!-- Listado de horarios -->
      <div v-if="loading" class="text-gray-500 text-center py-4 text-sm">
        <i class="fas fa-spinner fa-spin mr-2"></i>Cargando horarios...
      </div>
  
      <div v-else-if="error" class="text-red-500 text-center py-4 text-sm">
        {{ error }}
      </div>
  
      <div v-else>
        <div v-if="filteredSlots.length > 0">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <button
              v-for="slot in filteredSlots"
              :key="slot.id"
              @click="selectSlot(slot)"
              class="p-2 border rounded-md text-left transition-all relative"
              :class="{ 
                'border-blue-500 bg-blue-50': isSlotSelected(slot),
                'hover:border-blue-300': !isSlotSelected(slot)
              }"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-sm font-medium">{{ slot.start_time }} - {{ slot.end_time }}</div>
                  <div class="text-xs text-gray-600 mt-1">
                    {{ calculateDuration(slot) }} min
                  </div>
                </div>
                <div 
                  class="w-4 h-4 rounded-full border ml-2"
                  :class="{ 
                    'bg-blue-500 border-blue-600': isSlotSelected(slot),
                    'bg-white border-gray-300': !isSlotSelected(slot)
                  }"
                ></div>
              </div>
            </button>
          </div>
          <div class="mt-4 text-right">
            <button 
              v-if="selectedSlot"
              @click="confirmBooking"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-4 text-sm">
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
  
  ::-webkit-scrollbar {
    height: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 2px;
  }
  
  button {
    min-height: 70px;
  }
  </style>
  