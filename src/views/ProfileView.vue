<template>
  <div class="orders-page">
    <div class="container-fluid py-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">

          <!-- Page Title -->
          <div class="text-center mb-5">
            <h1 class="page-title">Mi Cuenta</h1>
            <p class="lead text-light opacity-75">Gestiona tus reservas y órdenes</p>
          </div>

          <!-- Reservas Section -->
          <section class="mb-5" aria-labelledby="reservas-title">
            <div class="card reservation-card shadow-lg">
              <div class="card-header section-header text-center">
                <h2 id="reservas-title" class="section-title mb-0">
                  <i class="bi bi-calendar-check me-2" aria-hidden="true"></i>
                  Reservas
                </h2>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div
                    v-for="reserva in reservas"
                    :key="reserva.id"
                    class="list-group-item reservation-item"
                    role="article"
                    :aria-label="`Reserva con ${reserva.barber} el ${reserva.date}`"
                  >
                    <div class="row g-3 align-items-center">
                      <div class="col-12 col-lg-8">
                        <div class="reservation-details">
                          <div class="row g-2 g-md-3">
                            <div class="col-12 col-sm-6">
                              <div class="detail-item">
                                <i class="bi bi-person-fill text-warning me-2" aria-hidden="true"></i>
                                <span class="detail-label">Barbero:</span>
                                <span class="detail-value">{{ reserva.barber }}</span>
                              </div>
                            </div>
                            <div class="col-12 col-sm-6">
                              <div class="detail-item">
                                <i class="bi bi-scissors text-warning me-2" aria-hidden="true"></i>
                                <span class="detail-label">Servicio:</span>
                                <span class="detail-value">{{ reserva.service.name }}</span>
                                <span class="price-tag ms-1">({{ reserva.service.price }}€)</span>
                              </div>
                            </div>
                            <div class="col-12 col-sm-6">
                              <div class="detail-item">
                                <i class="bi bi-clock text-warning me-2" aria-hidden="true"></i>
                                <span class="detail-label">Horario:</span>
                                <span class="detail-value">{{ reserva.date }} {{ reserva.time_slot.start_time }} - {{ reserva.time_slot.end_time }}</span>
                              </div>
                            </div>
                            <div class="col-12 col-sm-6">
                              <div class="detail-item">
                                <i class="bi bi-info-circle text-warning me-2" aria-hidden="true"></i>
                                <span class="detail-label">Estado:</span>
                                <span :class="getStatusClass(reserva.status)" class="status-badge">
                                  {{ reserva.status }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-lg-4 text-center text-lg-end">
                        <button 
                          v-if="reserva.status === 'Confirmed'"
                          class="btn cancel-btn w-100 w-lg-auto"
                          @click="mostrarConfirmacionCancelarReserva(reserva)"
                          :aria-label="`Cancelar reserva del ${reserva.date}`"
                        >
                          <i class="bi bi-x-circle me-2" aria-hidden="true"></i>
                          <span class="d-none d-sm-inline">Cancelar </span>Reserva
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="reservas.length === 0" class="list-group-item empty-state text-center py-5">
                    <i class="bi bi-calendar-x display-4 text-muted mb-3 d-block" aria-hidden="true"></i>
                    <h3 class="h5 text-muted mb-2">No hay reservas disponibles</h3>
                    <p class="text-muted mb-0">Cuando realices una reserva, aparecerá aquí.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Órdenes Section -->
          <section aria-labelledby="ordenes-title">
            <div class="text-center mb-4">
              <h2 id="ordenes-title" class="section-title">
                <i class="bi bi-bag-check me-2" aria-hidden="true"></i>
                Órdenes
              </h2>
            </div>
            
            <div class="row g-4" role="list">
              <div
                v-for="orden in ordenes"
                :key="orden.id"
                class="col-12 col-md-6 col-xl-4"
                role="listitem"
              >
                <article class="card h-100 order-card shadow-lg" :aria-label="`Orden número ${orden.id}`">
                  <div class="card-body d-flex flex-column">
                    <header class="order-header mb-3 pb-3">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="order-title h5 mb-0">Orden #{{ orden.id }}</h3>
                        <div class="d-flex align-items-center gap-2">
                          <span :class="getStatusClass(orden.status)" class="status-badge">
                            {{ orden.status }}
                          </span>
                          <button
                            v-if="orden.status === 'Cancelled'"
                            class="btn btn-sm delete-btn"
                            @click="mostrarConfirmacionEliminarOrden(orden)"
                            :aria-label="`Eliminar orden ${orden.id}`"
                            title="Eliminar orden"
                          >
                            <i class="bi bi-x-lg" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                      <div class="total-price h4 text-warning mb-0">
                        <i class="bi bi-currency-euro me-1" aria-hidden="true"></i>
                        {{ orden.price }}€
                      </div>
                    </header>
                    
                    <div class="products-section flex-grow-1">
                      <h4 class="products-title h6">
                        <i class="bi bi-box me-2" aria-hidden="true"></i>
                        Productos:
                      </h4>
                      <ul class="products-list list-unstyled" role="list">
                        <li
                          v-for="item in orden.items"
                          :key="item.id"
                          class="product-item d-flex justify-content-between align-items-center py-2"
                          role="listitem"
                        >
                          <div class="product-info flex-grow-1">
                            <span class="product-name d-block">{{ item.product.name }}</span>
                            <span class="product-quantity text-white small">Cantidad: {{ item.quantity }}</span>
                          </div>
                          <span class="product-price fw-bold text-end ms-2">
                            {{ item.subtotal }}€
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <footer v-if="orden.status === 'Pending'" class="order-actions mt-3 pt-3">
                      <div class="d-grid gap-2 d-sm-flex">
                        <button 
                          class="btn pay-btn flex-sm-fill"
                          @click="pagarOrden(orden.id)"
                          :aria-label="`Pagar orden ${orden.id}`"
                        >
                          <i class="bi bi-credit-card me-2" aria-hidden="true"></i>
                          Pagar
                        </button>
                        <button 
                          class="btn cancel-btn flex-sm-fill"
                          @click="mostrarConfirmacionCancelarOrden(orden)"
                          :aria-label="`Cancelar orden ${orden.id}`"
                        >
                          <i class="bi bi-x-circle me-2" aria-hidden="true"></i>
                          Cancelar
                        </button>
                      </div>
                    </footer>
                  </div>
                </article>
              </div>
              
              <div v-if="ordenes.length === 0" class="col-12">
                <div class="empty-state text-center py-5">
                  <i class="bi bi-cart-x display-4 text-muted mb-3 d-block" aria-hidden="true"></i>
                  <h3 class="h5 text-muted mb-2">No hay órdenes registradas</h3>
                  <p class="text-muted mb-0">Cuando realices una compra, aparecerá aquí.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Modal de Confirmación -->
          <div v-if="mostrarModalConfirmacion" class="modal-overlay" @click="cerrarModal">
            <div class="modal-dialog" @click.stop>
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    <i :class="modalData.icon" class="me-2"></i>
                    {{ modalData.title }}
                  </h5>
                  <button type="button" class="btn-close" @click="cerrarModal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                  <p>{{ modalData.message }}</p>
                  <div v-if="modalData.details" class="details-box">
                    <strong>{{ modalData.details }}</strong>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="cerrarModal">
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    :class="modalData.buttonClass"
                    @click="ejecutarAccion"
                  >
                    <i :class="modalData.buttonIcon" class="me-2"></i>
                    {{ modalData.buttonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div
              v-for="toast in toasts"
              :key="toast.id"
              class="toast align-items-center border-0 show"
              :class="`text-bg-${toast.type}`"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              :style="{ transition: 'opacity 0.5s ease-in-out' }"
            >
              <div class="d-flex">
                <div class="toast-body">
                  {{ toast.message }}
                </div>
                <button
                  type="button"
                  class="btn-close btn-close-white me-2 m-auto"
                  @click="removeToast(toast.id)"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const reservas = ref([]);
const ordenes = ref([]);
const toasts = ref([]);
const token = localStorage.getItem('token');
let toastId = 0;

// Modal de confirmación
const mostrarModalConfirmacion = ref(false);
const modalData = ref({});
const accionPendiente = ref(null);

// Toast functions
const mostrarToast = (message, type = 'success') => {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => removeToast(id), 5000);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

// Modal functions
const cerrarModal = () => {
  mostrarModalConfirmacion.value = false;
  modalData.value = {};
  accionPendiente.value = null;
};

const mostrarConfirmacionCancelarReserva = (reserva) => {
  modalData.value = {
    title: 'Cancelar Reserva',
    message: '¿Estás seguro de que deseas cancelar esta reserva?',
    details: `Barbero: ${reserva.barber} - ${reserva.date} ${reserva.time_slot.start_time}`,
    buttonText: 'Cancelar Reserva',
    buttonClass: 'btn btn-danger',
    buttonIcon: 'bi bi-x-circle',
    icon: 'bi bi-exclamation-triangle text-warning'
  };
  accionPendiente.value = () => cancelarReserva(reserva.id);
  mostrarModalConfirmacion.value = true;
};

const mostrarConfirmacionCancelarOrden = (orden) => {
  modalData.value = {
    title: 'Cancelar Orden',
    message: '¿Estás seguro de que deseas cancelar esta orden?',
    details: `Orden #${orden.id} - Total: ${orden.price}€`,
    buttonText: 'Cancelar Orden',
    buttonClass: 'btn btn-danger',
    buttonIcon: 'bi bi-x-circle',
    icon: 'bi bi-exclamation-triangle text-warning'
  };
  accionPendiente.value = () => cancelarOrden(orden.id, orden.items);
  mostrarModalConfirmacion.value = true;
};

const mostrarConfirmacionEliminarOrden = (orden) => {
  modalData.value = {
    title: 'Eliminar Orden',
    message: '¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.',
    details: `Orden #${orden.id} - Total: ${orden.price}€`,
    buttonText: 'Eliminar',
    buttonClass: 'btn btn-danger',
    buttonIcon: 'bi bi-trash',
    icon: 'bi bi-exclamation-triangle text-danger'
  };
  accionPendiente.value = () => eliminarOrden(orden.id);
  mostrarModalConfirmacion.value = true;
};

const ejecutarAccion = async () => {
  if (accionPendiente.value) {
    await accionPendiente.value();
    cerrarModal();
  }
};

// Status formatting
const getStatusClass = (status) => {
  switch(status) {
    case 'Confirmed': return 'status-confirmed';
    case 'Pending': return 'status-pending';
    case 'Cancelled': return 'status-cancelled';
    case 'Completed': return 'status-confirmed';
    default: return 'status-default';
  }
};

// API calls
const fetchReservas = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/bookings/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    reservas.value = res.data;
  } catch (error) {
    mostrarToast('Error al cargar reservas', 'danger');
  }
};

const fetchOrdenes = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/orders/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    ordenes.value = res.data;
  } catch (error) {
    mostrarToast('Error al cargar órdenes', 'danger');
  }
};

// Actions
const pagarOrden = (id) => {
  router.push(`/payment/${id}`);
};

const cancelarReserva = async (id) => {
  try {
    await axios.post(`http://localhost:8000/api/bookings/${id}/cancel/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    mostrarToast('Reserva cancelada exitosamente', 'success');
    await fetchReservas();
  } catch (error) {
    mostrarToast('Error al cancelar reserva', 'danger');
  }
};

const cancelarOrden = async (id, items) => {
  try {
    // Crear el array de productos con el formato solicitado: id y quantity
    const products = items.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    const payload = {
      products: products
    };

    console.log("Payload enviado:", payload); // Verificar en consola

    await axios.post(
      `http://localhost:8000/api/orders/${id}/cancel-order/`,
      payload,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    mostrarToast('Orden cancelada exitosamente', 'success');
    await fetchOrdenes();
  } catch (error) {
    console.error('Error al cancelar orden:', error.response?.data);
    const errorMsg = error.response?.data?.error || 'Error al cancelar orden';
    mostrarToast(errorMsg, 'danger');
  }
};

async function eliminarOrden(id) {
  try {
    await axios.post(`http://localhost:8000/api/orders/${id}/delete/`, 
      { id }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    mostrarToast('Orden eliminada exitosamente', 'success');
    await fetchOrdenes();
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Error al eliminar orden';
    mostrarToast(errorMsg, 'danger');
  }
}

// Lifecycle
onMounted(() => {
  fetchReservas();
  fetchOrdenes();
});
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');

/* Base Styles */
.orders-page {
  background: radial-gradient(circle at top, #070707, #181818);
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
}
/* Toast Styles */
.toast-container {
  z-index: 1050;
}

.toast {
  opacity: 0.95;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.75rem;
}

.text-bg-success {
  background-color: rgba(40, 167, 69, 0.95) !important;
  border: 1px solid rgba(40, 167, 69, 0.85) !important;
}

.text-bg-danger {
  background-color: rgba(220, 53, 69, 0.95) !important;
  border: 1px solid rgba(220, 53, 69, 0.85) !important;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* Transición para remover toasts */
.toast-leave-active {
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateX(100%);
}

.toast {
  opacity: 0.95;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
}

.text-bg-success {
  background-color: rgba(40, 167, 69, 0.95) !important;
  border-color: rgba(40, 167, 69, 0.85) !important;
}

.text-bg-danger {
  background-color: rgba(220, 53, 69, 0.95) !important;
  border-color: rgba(220, 53, 69, 0.85) !important;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* Page Title */
.page-title {
  font-family: 'Kanit', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(45deg, #ffd700, #ffaa00);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

/* Section Titles */
.section-title {
  font-family: 'Kanit', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  font-weight: 700;
  background: linear-gradient(45deg, #ffd700, #ffaa00);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: min(80px, 60%);
  height: 3px;
  background: linear-gradient(45deg, #ffd700, #ffaa00);
  border-radius: 2px;
}

/* Section Headers */
.section-header {
  color: #1a1a1a;
  font-weight: 700;
  border: none;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem 0.5rem 0 0;
}

.section-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.section-header:hover::before {
  left: 100%;
}

/* Cards */
.reservation-card, .order-card {
  background: rgba(33, 37, 41, 0.95);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.reservation-card:hover, .order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.5);
}

.order-card {
  position: relative;
  overflow: hidden;
}

.order-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(45deg, #ffd700, #ffaa00);
}

/* Reservation Items */
.reservation-item {
  background: rgba(26, 26, 26, 0.8) !important;
  border: 1px solid rgba(255, 215, 0, 0.2) !important;
  color: white;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.reservation-item:hover {
  background: rgba(26, 26, 26, 0.95) !important;
  border-color: rgba(255, 215, 0, 0.4) !important;
}

.reservation-item:not(:last-child) {
  border-bottom: 1px solid rgba(255, 215, 0, 0.15) !important;
}

/* Detail Items */
.detail-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.detail-label {
  font-weight: 600;
  color: #e9ecef;
  margin-right: 0.5rem;
  white-space: nowrap;
}

.detail-value {
  color: white;
  word-break: break-word;
}

.price-tag {
  color: #ffd700;
  font-weight: 600;
  white-space: nowrap;
}

/* Status Badges */
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

.status-confirmed {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.4);
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.4);
}

.status-cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.4);
}

.status-default {
  background: rgba(108, 117, 125, 0.2);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.4);
}

/* Order Specific Styles */
.order-header {
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.order-title {
  font-family: 'Kanit', sans-serif;
  font-weight: 600;
  color: #ffd700;
}

.total-price {
  font-weight: 700;
  color: #ffd700;
}

/* Products Section */
.products-title {
  font-family: 'Kanit', sans-serif;
  font-weight: 600;
  color: #ffd700;
  border-left: 3px solid #ffd700;
  padding-left: 0.75rem;
  margin-bottom: 1rem;
}

.product-item {
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  transition: background-color 0.2s ease;
}

.product-item:hover {
  background-color: rgba(255, 215, 0, 0.05);
  border-radius: 0.25rem;
}

.product-item:last-child {
  border-bottom: none;
}

.product-name {
  font-weight: 500;
  color: white;
  font-size: 0.9rem;
  line-height: 1.3;
}

.product-quantity {
  font-size: 0.8rem;
  font-weight: 600;
}

.product-price {
  color: #ffd700;
  font-size: 0.95rem;
  min-width: fit-content;
}

/* Buttons */
.pay-btn, .cancel-btn {
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}
.delete-btn {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

/* Estilos para el modal de confirmación */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(5px);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1rem;
}

.modal-content {
  background: #212529;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: between;
  align-items: center;
}

.modal-title {
  font-family: 'Kanit', sans-serif;
  font-weight: 600;
  color: #ffd700;
  margin: 0;
  flex-grow: 1;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 1rem;
}

.btn-close:hover {
  color: #ffd700;
}

.modal-body {
  padding: 1.5rem;
}

.details-box {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  color: #ffd700;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  background: rgba(108, 117, 125, 0.3);
  border: 1px solid #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  border: 1px solid #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #c82333;
  color: white;
}

/* Responsive para el modal */
@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 0.5rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}
.pay-btn {
  background: linear-gradient(45deg, #28a745, #20c997);
  border-color: #28a745;
  color: white;
}

.pay-btn:hover, .pay-btn:focus {
  background: linear-gradient(45deg, #20c997, #28a745);
  border-color: #20c997;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.cancel-btn {
  background: transparent;
  border-color: #dc3545;
  color: #dc3545;
}

.cancel-btn:hover, .cancel-btn:focus {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

/* Empty States */
.empty-state {
  background: rgba(26, 26, 26, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  border: 2px dashed rgba(255, 215, 0, 0.3);
}

/* Focus States for Accessibility */
.btn:focus,
button:focus {
  outline: 3px solid rgba(255, 215, 0, 0.5);
  outline-offset: 2px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .orders-page {
    font-size: 0.9rem;
  }
  
  .reservation-item,
  .card-body {
    padding: 1rem;
  }
  
  .detail-item {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  
  .product-item {
    padding: 0.75rem 0;
  }
  
  .order-actions .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .section-title::after {
    width: 50px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .detail-item i {
    margin-right: 0.5rem;
  }
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .product-price {
    align-self: flex-end;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .reservation-card, .order-card {
    border-width: 3px;
  }
  
  .status-badge {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>