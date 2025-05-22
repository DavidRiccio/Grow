<template>
  <div class="container mt-4" v-if="isAuthorized">
    <h1 class="mb-4 text-light">Panel de Administrador</h1>

    <!-- Dashboard original -->
    <div class="row mb-4">
      <div class="col-md-4" v-for="card in summaryCards" :key="card.title">
        <div class="card text-white bg-primary mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text fs-4">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-6 mb-4">
        <canvas id="lineChart1" aria-label="Gráfico de usuarios por mes"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas id="lineChart2" aria-label="Gráfico de ganancias mensuales de pedidos"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas id="lineChart3" aria-label="Gráfico de ganancias mensuales de reservas"></canvas>
      </div>
    </div>

    <!-- Acordeón para las secciones -->
    <div class="accordion" id="adminAccordion">
      
      <!-- Servicios -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button 
            class="accordion-button collapsed" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#servicesCollapse"
            aria-expanded="false" 
            aria-controls="servicesCollapse"
          >
            Gestión de Servicios
          </button>
        </h2>
        <div id="servicesCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
          <div class="accordion-body">
            <!-- Formulario de Servicios -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="h5 mb-0">{{ editingService ? 'Editar' : 'Añadir' }} Servicio</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitService" novalidate>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="service-name" class="form-label">Nombre <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        id="service-name"
                        v-model="serviceForm.name"
                        required
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="service-price" class="form-label">Precio <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">€</span>
                        <input
                          type="number"
                          class="form-control"
                          id="service-price"
                          v-model="serviceForm.price"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label for="service-duration-hours" class="form-label">Horas</label>
                      <input
                        type="number"
                        class="form-control"
                        id="service-duration-hours"
                        v-model="serviceDuration.hours"
                        min="0"
                        max="23"
                      />
                    </div>
                    <div class="col-md-4 mb-3">
                      <label for="service-duration-minutes" class="form-label">Minutos</label>
                      <input
                        type="number"
                        class="form-control"
                        id="service-duration-minutes"
                        v-model="serviceDuration.minutes"
                        min="0"
                        max="59"
                      />
                    </div>
                    <div class="col-md-4 mb-3">
                      <label for="service-duration-preview" class="form-label">Duración Total</label>
                      <input
                        type="text"
                        class="form-control"
                        id="service-duration-preview"
                        :value="formatDurationPreview(serviceDuration)"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="service-image" class="form-label">Imagen del Servicio</label>
                    <input
                      type="file"
                      class="form-control"
                      id="service-image"
                      ref="serviceImageInput"
                      @change="handleServiceImageUpload"
                      accept="image/*"
                    />
                    <div v-if="serviceImagePreview" class="mt-2">
                      <img :src="serviceImagePreview" alt="Preview" class="img-thumbnail" style="max-width: 200px;">
                      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="clearServiceImage">
                        Quitar imagen
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="service-description" class="form-label">Descripción <span class="text-danger">*</span></label>
                    <textarea
                      class="form-control"
                      id="service-description"
                      v-model="serviceForm.description"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ editingService ? 'Actualizar' : 'Crear' }} Servicio
                    </button>
                    <button v-if="editingService" type="button" class="btn btn-secondary" @click="cancelEditService">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Lista de Servicios -->
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in services" :key="service.id">
                    <td>
                      <img v-if="service.image" :src="getImageUrl(service.image)" alt="Service" class="img-thumbnail" style="max-width: 50px;">
                      <span v-else class="text-muted">Sin imagen</span>
                    </td>
                    <td>{{ service.name }}</td>
                    <td>€{{ service.price }}</td>
                    <td>{{ formatDuration(service.duration) }}</td>
                    <td>{{ service.description }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="editService(service)">
                        Editar
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteService(service.id)">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Eventos -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button 
            class="accordion-button collapsed" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#eventsCollapse"
            aria-expanded="false" 
            aria-controls="eventsCollapse"
          >
            Gestión de Eventos
          </button>
        </h2>
        <div id="eventsCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
          <div class="accordion-body">
            <!-- Formulario de Eventos -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="h5 mb-0">{{ editingEvent ? 'Editar' : 'Añadir' }} Evento</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitEvent" novalidate>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="event-name" class="form-label">Nombre <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        id="event-name"
                        v-model="eventForm.name"
                        required
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="event-location" class="form-label">Ubicación <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        id="event-location"
                        v-model="eventForm.location"
                        required
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="event-date" class="form-label">Fecha <span class="text-danger">*</span></label>
                      <input
                        type="date"
                        class="form-control"
                        id="event-date"
                        v-model="eventForm.date"
                        required
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="event-time" class="form-label">Hora <span class="text-danger">*</span></label>
                      <input
                        type="time"
                        class="form-control"
                        id="event-time"
                        v-model="eventForm.time"
                        required
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="event-image" class="form-label">Imagen del Evento</label>
                    <input
                      type="file"
                      class="form-control"
                      id="event-image"
                      ref="eventImageInput"
                      @change="handleEventImageUpload"
                      accept="image/*"
                    />
                    <div v-if="eventImagePreview" class="mt-2">
                      <img :src="eventImagePreview" alt="Preview" class="img-thumbnail" style="max-width: 200px;">
                      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="clearEventImage">
                        Quitar imagen
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="event-description" class="form-label">Descripción <span class="text-danger">*</span></label>
                    <textarea
                      class="form-control"
                      id="event-description"
                      v-model="eventForm.description"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ editingEvent ? 'Actualizar' : 'Crear' }} Evento
                    </button>
                    <button v-if="editingEvent" type="button" class="btn btn-secondary" @click="cancelEditEvent">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Lista de Eventos -->
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Ubicación</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in events" :key="event.id">
                    <td>
                      <img v-if="event.image" :src="getImageUrl(event.image)" alt="Event" class="img-thumbnail" style="max-width: 50px;">
                      <span v-else class="text-muted">Sin imagen</span>
                    </td>
                    <td>{{ event.name }}</td>
                    <td>{{ event.date }}</td>
                    <td>{{ event.time }}</td>
                    <td>{{ event.location }}</td>
                    <td>{{ event.description }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="editEvent(event)">
                        Editar
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button 
            class="accordion-button collapsed" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#productsCollapse"
            aria-expanded="false" 
            aria-controls="productsCollapse"
          >
            Gestión de Productos
          </button>
        </h2>
        <div id="productsCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
          <div class="accordion-body">
            <!-- Formulario de Productos -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="h5 mb-0">{{ editingProduct ? 'Editar' : 'Añadir' }} Producto</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitProduct" novalidate>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="product-name" class="form-label">Nombre <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        id="product-name"
                        v-model="productForm.name"
                        required
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="product-price" class="form-label">Precio <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">€</span>
                        <input
                          type="number"
                          class="form-control"
                          id="product-price"
                          v-model="productForm.price"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="product-stock" class="form-label">Stock <span class="text-danger">*</span></label>
                      <input
                        type="number"
                        class="form-control"
                        id="product-stock"
                        v-model="productForm.stock"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="product-image" class="form-label">Imagen del Producto</label>
                    <input
                      type="file"
                      class="form-control"
                      id="product-image"
                      ref="productImageInput"
                      @change="handleProductImageUpload"
                      accept="image/*"
                    />
                    <div v-if="productImagePreview" class="mt-2">
                      <img :src="productImagePreview" alt="Preview" class="img-thumbnail" style="max-width: 200px;">
                      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="clearProductImage">
                        Quitar imagen
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="product-description" class="form-label">Descripción <span class="text-danger">*</span></label>
                    <textarea
                      class="form-control"
                      id="product-description"
                      v-model="productForm.description"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ editingProduct ? 'Actualizar' : 'Crear' }} Producto
                    </button>
                    <button v-if="editingProduct" type="button" class="btn btn-secondary" @click="cancelEditProduct">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Lista de Productos -->
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>
                      <img v-if="product.image" :src="getImageUrl(product.image)" alt="Product" class="img-thumbnail" style="max-width: 50px;">
                      <span v-else class="text-muted">Sin imagen</span>
                    </td>
                    <td>{{ product.name }}</td>
                    <td>€{{ product.price }}</td>
                    <td>{{ product.stock }}</td>
                    <td>{{ product.description }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="editProduct(product)">
                        Editar
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(product.id)">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container mt-4">
    <div class="alert alert-danger" role="alert">
      <h2 class="alert-heading">Acceso Denegado</h2>
      <p class="mb-0">No tienes permiso para acceder a esta página.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useUserStore } from "../stores/userStore";
import Chart from "chart.js/auto";
import axios from "axios";

const userStore = useUserStore();
const isAuthorized = ref(false);
const token = localStorage.getItem("token");
const isSubmitting = ref(false);

// Referencias para los inputs de archivos
const serviceImageInput = ref(null);
const eventImageInput = ref(null);
const productImageInput = ref(null);

// Variables para preview de imágenes
const serviceImagePreview = ref('');
const eventImagePreview = ref('');
const productImagePreview = ref('');

// Variables para los archivos seleccionados
const selectedServiceImage = ref(null);
const selectedEventImage = ref(null);
const selectedProductImage = ref(null);

// Datos del dashboard
const summaryCards = ref([]);

// Servicios
const services = ref([]);
const serviceForm = reactive({
  name: '',
  description: '',
  price: '',
  duration: ''
});
const serviceDuration = reactive({
  hours: 0,
  minutes: 0
});
const editingService = ref(null);

// Eventos
const events = ref([]);
const eventForm = reactive({
  name: '',
  description: '',
  date: '',
  time: '',
  location: ''
});
const editingEvent = ref(null);

// Productos
const products = ref([]);
const productForm = reactive({
  name: '',
  description: '',
  price: '',
  stock: ''
});
const editingProduct = ref(null);

// Watcher para actualizar la duración del servicio
watch([() => serviceDuration.hours, () => serviceDuration.minutes], () => {
  serviceForm.duration = `P0DT${serviceDuration.hours.toString().padStart(2, '0')}H${serviceDuration.minutes.toString().padStart(2, '0')}M00S`;
}, { immediate: true });

onMounted(async () => {
  userStore.initialize();
  checkAuthorization();
  if (isAuthorized.value) {
    await Promise.all([
      createCharts(),
      loadServices(),
      loadEvents(),
      loadProducts()
    ]);
  }
});

function checkAuthorization() {
  if (userStore.user && userStore.user.role === "A") {
    isAuthorized.value = true;
  } else {
    isAuthorized.value = false;
  }
}

// Función helper para convertir archivo a base64
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Función para obtener URL completa de imagen
function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('data:')) return imagePath; // Si es base64
  if (imagePath.startsWith('http')) return imagePath; // Si es URL completa
  return `http://localhost:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

// Funciones para manejar imágenes
function handleServiceImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedServiceImage.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      serviceImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleEventImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedEventImage.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      eventImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleProductImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedProductImage.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      productImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Funciones para limpiar imágenes
function clearServiceImage() {
  selectedServiceImage.value = null;
  serviceImagePreview.value = '';
  if (serviceImageInput.value) {
    serviceImageInput.value.value = '';
  }
}

function clearEventImage() {
  selectedEventImage.value = null;
  eventImagePreview.value = '';
  if (eventImageInput.value) {
    eventImageInput.value.value = '';
  }
}

function clearProductImage() {
  selectedProductImage.value = null;
  productImagePreview.value = '';
  if (productImageInput.value) {
    productImageInput.value.value = '';
  }
}

// Funciones para formatear duración
function formatDurationPreview(duration) {
  const hours = duration.hours || 0;
  const minutes = duration.minutes || 0;
  
  if (hours === 0 && minutes === 0) return "Sin duración";
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function formatDuration(durationString) {
  if (!durationString) return "Sin duración";
  
  // Parsear formato P0DT00H40M00S
  const match = durationString.match(/P0DT(\d+)H(\d+)M\d+S/);
  if (!match) return durationString;
  
  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  
  if (hours === 0 && minutes === 0) return "Sin duración";
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function parseDuration(durationString) {
  if (!durationString) return { hours: 0, minutes: 0 };
  
  const match = durationString.match(/P0DT(\d+)H(\d+)M\d+S/);
  if (!match) return { hours: 0, minutes: 0 };
  
  return {
    hours: parseInt(match[1]),
    minutes: parseInt(match[2])
  };
}

async function createCharts() {
  try {
    const lineRes = await axios.get("http://localhost:8000/api/users-per-mounth/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    new Chart(document.getElementById("lineChart1"), {
      type: "line",
      data: {
        labels: lineRes.data.labels,
        datasets: [{
          label: "Usuarios por mes",
          data: lineRes.data.values,
          borderColor: "yellow",
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Número de Usuarios' } }
        }
      }
    });

    const responseOrders = await axios.get("http://localhost:8000/api/orders/get-earnings/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    new Chart(document.getElementById("lineChart2"), {
      type: "line",
      data: {
        labels: responseOrders.data.labels,
        datasets: [{
          label: "Ganancias Mensuales de Pedidos",
          data: responseOrders.data.values,
          borderColor: "green",
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Ganancias' } }
        }
      }
    });

    const responseBookings = await axios.get("http://localhost:8000/api/bookings/get-earnings/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    new Chart(document.getElementById("lineChart3"), {
      type: "line",
      data: {
        labels: responseBookings.data.labels,
        datasets: [{
          label: "Ganancias Mensuales de Reservas",
          data: responseBookings.data.values,
          borderColor: "pink",
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Ganancias' } }
        }
      }
    });
  } catch (error) {
    console.error("Error loading charts:", error);
  }
}

// Funciones de Servicios
async function loadServices() {
  try {
    const response = await axios.get("http://localhost:8000/api/services", {
      headers: { Authorization: `Bearer ${token}` }
    });
    services.value = response.data;
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

async function submitService() {
  isSubmitting.value = true;
  try {
    // Convertir imagen a base64 si existe
    let imageBase64 = null;
    if (selectedServiceImage.value) {
      imageBase64 = await convertFileToBase64(selectedServiceImage.value);
    } else if (editingService.value && editingService.value.image && serviceImagePreview.value) {
      // Si estamos editando y mantenemos la imagen existente
      imageBase64 = serviceImagePreview.value.startsWith('data:') ? serviceImagePreview.value : null;
    }

    const requestData = {
      name: serviceForm.name,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price),
      duration: serviceForm.duration,
      image: imageBase64 // Enviar como base64 o null
    };

    const endpoint = editingService.value 
      ? `http://localhost:8000/api/services/${editingService.value.id}/edit/`
      : "http://localhost:8000/api/services/add/";

    await axios.post(endpoint, requestData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await loadServices();
    resetServiceForm();
  } catch (error) {
    console.error("Error submitting service:", error);
    alert('Error al guardar el servicio: ' + (error.response?.data?.error || error.response?.data?.detail || error.message));
  }
  isSubmitting.value = false;
}

function editService(service) {
  editingService.value = service;
  serviceForm.name = service.name;
  serviceForm.description = service.description;
  serviceForm.price = service.price;
  serviceForm.duration = service.duration;
  
  const duration = parseDuration(service.duration);
  serviceDuration.hours = duration.hours;
  serviceDuration.minutes = duration.minutes;
  
  // Mostrar imagen existente si la hay
  if (service.image) {
    serviceImagePreview.value = getImageUrl(service.image);
  }
  
  // Limpiar archivo seleccionado al editar
  selectedServiceImage.value = null;
}

function cancelEditService() {
  editingService.value = null;
  resetServiceForm();
}

function resetServiceForm() {
  serviceForm.name = '';
  serviceForm.description = '';
  serviceForm.price = '';
  serviceForm.duration = '';
  serviceDuration.hours = 0;
  serviceDuration.minutes = 0;
  clearServiceImage();
}

async function deleteService(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
    try {
      await axios.post(`http://localhost:8000/api/services/${id}/delete/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  }
}

// Funciones de Eventos
async function loadEvents() {
  try {
    const response = await axios.get("http://localhost:8000/api/events", {
      headers: { Authorization: `Bearer ${token}` }
    });
    events.value = response.data;
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

async function submitEvent() {
  isSubmitting.value = true;
  try {
    // Convertir imagen a base64 si existe
    let imageBase64 = null;
    if (selectedEventImage.value) {
      imageBase64 = await convertFileToBase64(selectedEventImage.value);
    } else if (editingEvent.value && editingEvent.value.image && eventImagePreview.value) {
      // Si estamos editando y mantenemos la imagen existente
      imageBase64 = eventImagePreview.value.startsWith('data:') ? eventImagePreview.value : null;
    }

    const requestData = {
      name: eventForm.name,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      image: imageBase64 // Enviar como base64 o null
    };

    const endpoint = editingEvent.value 
      ? `http://localhost:8000/api/events/${editingEvent.value.id}/edit/`
      : "http://localhost:8000/api/events/add/";

    await axios.post(endpoint, requestData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await loadEvents();
    resetEventForm();
  } catch (error) {
    console.error("Error submitting event:", error);
    alert('Error al guardar el evento: ' + (error.response?.data?.error || error.response?.data?.detail || error.message));
  }
  isSubmitting.value = false;
}

function editEvent(event) {
  editingEvent.value = event;
  eventForm.name = event.name;
  eventForm.description = event.description;
  eventForm.date = event.date;
  eventForm.time = event.time;
  eventForm.location = event.location;
  
  // Mostrar imagen existente si la hay
  if (event.image) {
    eventImagePreview.value = getImageUrl(event.image);
  }
  
  // Limpiar archivo seleccionado al editar
  selectedEventImage.value = null;
}

function cancelEditEvent() {
  editingEvent.value = null;
  resetEventForm();
}

function resetEventForm() {
  eventForm.name = '';
  eventForm.description = '';
  eventForm.date = '';
  eventForm.time = '';
  eventForm.location = '';
  clearEventImage();
}

async function deleteEvent(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
    try {
      await axios.post(`http://localhost:8000/api/events/${id}/delete/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }
}

// Funciones de Productos
async function loadProducts() {
  try {
    const response = await axios.get("http://localhost:8000/api/products", {
      headers: { Authorization: `Bearer ${token}` }
    });
    products.value = response.data;
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

async function submitProduct() {
  isSubmitting.value = true;
  try {
    // Convertir imagen a base64 si existe
    let imageBase64 = null;
    if (selectedProductImage.value) {
      imageBase64 = await convertFileToBase64(selectedProductImage.value);
    } else if (editingProduct.value && editingProduct.value.image && productImagePreview.value) {
      // Si estamos editando y mantenemos la imagen existente
      imageBase64 = productImagePreview.value.startsWith('data:') ? productImagePreview.value : null;
    }

    const requestData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      image: imageBase64 // Enviar como base64 o null
    };

    const endpoint = editingProduct.value 
      ? `http://localhost:8000/api/products/${editingProduct.value.id}/edit/`
      : "http://localhost:8000/api/products/add/";

    await axios.post(endpoint, requestData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await loadProducts();
    resetProductForm();
  } catch (error) {
    console.error("Error submitting product:", error);
    alert('Error al guardar el producto: ' + (error.response?.data?.error || error.response?.data?.detail || error.message));
  }
  isSubmitting.value = false;
}

function editProduct(product) {
  editingProduct.value = product;
  productForm.name = product.name;
  productForm.description = product.description;
  productForm.price = product.price;
  productForm.stock = product.stock;
  
  // Mostrar imagen existente si la hay
  if (product.image) {
    productImagePreview.value = getImageUrl(product.image);
  }
  
  // Limpiar archivo seleccionado al editar
  selectedProductImage.value = null;
}

function cancelEditProduct() {
  editingProduct.value = null;
  resetProductForm();
}

function resetProductForm() {
  productForm.name = '';
  productForm.description = '';
  productForm.price = '';
  productForm.stock = '';
  clearProductImage();
}

async function deleteProduct(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      await axios.post(`http://localhost:8000/api/products/${id}/delete/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #1c1c1c;
  color: #ffd700; /* Texto amarillo */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.card {
  background-color: #2a2a2a;
  border: none;
  border-radius: 8px;
  transition: transform 0.2s;
  color: #ffd700; /* Texto amarillo */
}

.card:hover {
  transform: scale(1.02);
}

.card-header {
  background-color: #333;
  border-bottom: 1px solid #555;
  color: #ffd700;
}

/* Estilos unificados para el acordeón */
.accordion-item {
  background-color: #2a2a2a;
  border: 1px solid #ffd700;
  margin-bottom: 1rem;
  border-radius: 8px !important;
  overflow: hidden;
}

.accordion-button {
  background-color: #333 !important;
  color: #ffd700 !important;
  border: none !important;
  font-weight: 600;
  padding: 1rem 1.25rem;
}

.accordion-button:not(.collapsed) {
  background-color: #444 !important;
  color: #ffd700 !important;
  box-shadow: none !important;
}

.accordion-button:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.25) !important;
  border-color: #ffd700 !important;
}

.accordion-button::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffd700'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e") !important;
}

.accordion-body {
  background-color: #2a2a2a;
  color: #ffd700;
  padding: 1.25rem;
}

.table {
  color: #ffd700; /* Texto amarillo */
  background-color: transparent;
}

.table th {
  border-top: none;
  border-bottom: 2px solid #ffd700;
  background-color: #333;
  color: #ffd700;
  font-weight: 600;
}

.table td {
  border-top: 1px solid #555;
  vertical-align: middle;
}

h1, h2 {
  font-weight: bold;
  border-bottom: 2px solid #ffd700; /* Borde amarillo */
  padding-bottom: 10px;
  color: #ffd700; /* Texto amarillo */
}

canvas {
  background-color: #2a2a2a;
  border-radius: 8px;
}

.form-control {
  background-color: #333 !important;
  border: 1px solid #555 !important;
  color: #ffd700 !important;
}

.form-control:focus {
  background-color: #444 !important;
  border-color: #ffd700 !important;
  color: #ffd700 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.25) !important;
}

.form-label {
  color: #ffd700 !important;
  font-weight: 500;
}

.input-group-text {
  background-color: #333 !important;
  border: 1px solid #555 !important;
  color: #ffd700 !important;
}

.btn-primary {
  background-color: #ffd700 !important; /* Fondo amarillo */
  border-color: #ffd700 !important; /* Borde amarillo */
  color: #1c1c1c !important; /* Texto oscuro para contraste */
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #ffcc00 !important;
  border-color: #ffcc00 !important;
  color: #1c1c1c !important;
}

.btn-primary:disabled {
  background-color: #666 !important;
  border-color: #666 !important;
  color: #ccc !important;
}

.btn-secondary {
  background-color: #555 !important;
  border-color: #555 !important;
  color: #ffd700 !important;
}

.btn-secondary:hover {
  background-color: #666 !important;
  border-color: #666 !important;
  color: #ffd700 !important;
}

.btn-outline-primary {
  color: #ffd700 !important;
  border-color: #ffd700 !important;
}

.btn-outline-primary:hover {
  background-color: #ffd700 !important;
  border-color: #ffd700 !important;
  color: #1c1c1c !important;
}

.btn-outline-danger {
  color: #dc3545 !important;
  border-color: #dc3545 !important;
}

.btn-outline-danger:hover {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}

.img-thumbnail {
  background-color: #333;
  border: 1px solid #555;
}

.text-muted {
  color: #888 !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
}
</style>