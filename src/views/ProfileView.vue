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
                          @click="cancelarReserva(reserva.id)"
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
                        <span :class="getStatusClass(orden.status)" class="status-badge">
                          {{ orden.status }}
                        </span>
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
                          v-for="producto in getGroupedProducts(orden.products)"
                          :key="producto.id"
                          class="product-item d-flex justify-content-between align-items-center py-2"
                          role="listitem"
                        >
                          <div class="product-info flex-grow-1">
                            <span class="product-name d-block">{{ producto.name }}</span>
                          </div>
                          <span class="product-price fw-bold text-end ms-2">
                            {{ (producto.price * producto.quantity).toFixed(2) }}€
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
                          @click="cancelarOrden(orden.id, orden.products)"
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

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const reservas = ref([]);
const ordenes = ref([]);
const token = localStorage.getItem('token');
const router = useRouter();

// Función para obtener la clase CSS según el estado
const getStatusClass = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'status-confirmed';
    case 'Pending':
      return 'status-pending';
    case 'Cancelled':
      return 'status-cancelled';
    default:
      return 'status-default';
  }
};

// Función mejorada para agrupar productos y calcular cantidades
const getGroupedProducts = (productos) => {
  const productosAgrupados = {};
  
  // Contar cuántas veces aparece cada producto
  productos.forEach(producto => {
    const productId = producto.id;
    
    if (productosAgrupados[productId]) {
      // Si ya existe, incrementar cantidad
      productosAgrupados[productId].quantity += 1;
    } else {
      // Si no existe, crear nueva entrada con cantidad 1
      productosAgrupados[productId] = {
        id: producto.id,
        name: producto.name,
        description: producto.description,
        price: parseFloat(producto.price),
        stock: producto.stock,
        image: producto.image,
        quantity: 1
      };
    }
  });
  
  // Convertir el objeto a array y retornar
  return Object.values(productosAgrupados);
};

async function fetchReservas() {
  try {
    const res = await axios.get('http://localhost:8000/api/bookings/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    reservas.value = res.data;
  } catch (error) {
    console.error('Error al cargar reservas:', error);
  }
}

async function fetchOrdenes() {
  try {
    const res = await axios.get('http://localhost:8000/api/orders/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    ordenes.value = res.data;
    
    console.log('Órdenes cargadas:', res.data);
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
  }
}

const pagarOrden = (id) => {
  router.push(`/payment/${id}`);
};

const cancelarReserva = async (id) => {
  try {
    await axios.post(`http://localhost:8000/api/bookings/${id}/cancel/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Reserva cancelada exitosamente.");
    fetchReservas();
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    alert("Error al cancelar la reserva.");
  }
};

const cancelarOrden = async (id, productos) => {
  try {
    // Calcular las cantidades de cada producto
    const conteoProductos = {};
    
    productos.forEach(producto => {
      const productId = producto.id;
      
      if (conteoProductos[productId]) {
        conteoProductos[productId].quantity += 1;
      } else {
        conteoProductos[productId] = {
          id: productId,
          name: producto.name,
          quantity: 1
        };
      }
    });

    // Preparar el payload para el servidor
    const productosAEnviar = Object.values(conteoProductos).map(producto => ({
      id: producto.id,
      quantity: producto.quantity
    }));

    console.log('Productos a cancelar:', productosAEnviar);

    const response = await axios.post(`http://localhost:8000/api/orders/${id}/cancel-order/`, 
      { products: productosAEnviar },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    
    console.log('Respuesta del servidor:', response.data);
    alert("Orden cancelada exitosamente.");
    fetchOrdenes();
  } catch (error) {
    console.error('Error al cancelar la orden:', error);
    if (error.response) {
      console.error('Datos de la respuesta de error:', error.response.data);
      console.error('Status de la respuesta:', error.response.status);
    }
    alert(`Error al cancelar la orden: ${error.response?.data?.error || error.message}`);
  }
};

onMounted(() => {
  fetchReservas();
  fetchOrdenes();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');

/* Base Styles */
.orders-page {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
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