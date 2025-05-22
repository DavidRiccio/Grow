<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">

        <!-- Reservas -->
        <div class="card mb-5 bg-dark text-light border-warning">
          <div class="card-header bg-warning text-dark fw-bold text-center">
            Reservas
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="reserva in reservas"
              :key="reserva.id"
              class="list-group-item bg-dark text-light border-secondary"
            >
              <div class="d-flex flex-column flex-md-row justify-content-between">
                <span><strong>Barbero:</strong> {{ reserva.barber }}</span>
                <span><strong>Servicio:</strong> {{ reserva.service.name }} ({{ reserva.service.price }}€)</span>
                <span><strong>Horario:</strong> {{ reserva.date }} {{ reserva.time_slot.start_time }} - {{ reserva.time_slot.end_time }}</span>
              </div>
            </li>
            <li v-if="reservas.length === 0" class="list-group-item bg-dark text-muted border-secondary">
              No hay reservas disponibles.
            </li>
          </ul>
        </div>

        <!-- Órdenes en Cards -->
        <div class="mb-4">
          <div class="card-header bg-warning text-dark fw-bold text-center mb-3 rounded">
            Órdenes
          </div>
          <div class="row g-4">
            <div
              v-for="orden in ordenes"
              :key="orden.id"
              class="col-md-6 col-lg-4"
            >
              <div class="card h-100 bg-dark text-light border-warning shadow">
                <div class="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 class="card-title text-warning">Orden #{{ orden.id }}</h5>
                    <p class="card-text mb-2">
                      <strong>Total:</strong> {{ orden.price }}€<br />
                      <strong>Estado:</strong> {{ orden.status }}
                    </p>
                    <h6 class="text-light mt-3 mb-2">Productos:</h6>
                    <ul class="list-group list-group-flush">
                      <li
                        v-for="producto in orden.products"
                        :key="producto.id"
                        class="list-group-item bg-dark text-light border-secondary d-flex justify-content-between"
                      >
                        <span>{{ producto.name }} (x{{ producto.count }})</span>
                        <span>{{ producto.price }}€</span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="orden.status === 'Pending'" class="mt-3">
                    <button 
                      class="btn btn-outline-success me-2"
                      @click="pagarOrden(orden.id)"
                    >
                      Pagar
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click="cancelarOrden(orden.id, orden.products)"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="ordenes.length === 0" class="text-center text-muted">
              No hay órdenes registradas.
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

const reservas = ref([]);
const ordenes = ref([]);
const token = localStorage.getItem('token');
const router = useRouter();

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
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
  }
}

const pagarOrden = (id) => {
  router.push(`/payment/${id}`); // Redirigir a /payment/{order_id}
};

const cancelarOrden = async (id, productos) => {
  try {
    // Crear un array de productos a enviar con id y cantidad
    const productosAEnviar = productos.map(producto => ({
      id: producto.id,
      quantity: producto.cantidad
    }));

    await axios.post(`http://localhost:8000/api/orders/${id}/cancel-order/`, 
      { products: productosAEnviar }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Orden cancelada exitosamente.");
    fetchOrdenes(); // Actualizar la lista de órdenes
  } catch (error) {
    console.error('Error al cancelar la orden:', error);
    alert("Error al cancelar la orden.");
  }
};

onMounted(() => {
  fetchReservas();
  fetchOrdenes();
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>