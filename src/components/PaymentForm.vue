<template>
  <div class="payment-wrapper d-flex justify-content-center align-items-center">
    <div class="card p-4 rounded-4 shadow payment-card">
      <h2 class="text-warning mb-4 text-center">Datos de Pago</h2>
      
      <form @submit.prevent="handlePayment" novalidate>
        <!-- Número de Tarjeta -->
        <div class="mb-3">
          <label for="cardNumber" class="form-label text-warning fw-semibold">Número de Tarjeta</label>
          <input
            v-model="form.cardNumber"
            type="text"
            id="cardNumber"
            class="form-control bg-dark text-white border-warning"
            placeholder="1234-5678-9012-3456"
            maxlength="19"
            @input="formatCardNumber"
            required
          />
          <div v-if="errors.cardNumber" class="text-danger mt-1 small">{{ errors.cardNumber }}</div>
        </div>

        <!-- Fecha de Caducidad y CVC -->
        <div class="row mb-3">
          <div class="col-md-8">
            <label for="expiryDate" class="form-label text-warning fw-semibold">Fecha de Caducidad</label>
            <div class="row">
              <div class="col-6">
                <select
                  v-model="form.expiryMonth"
                  id="expiryMonth"
                  class="form-select bg-dark text-white border-warning"
                  required
                >
                  <option value="" disabled>Mes</option>
                  <option v-for="month in months" :key="month.value" :value="month.value">
                    {{ month.label }}
                  </option>
                </select>
              </div>
              <div class="col-6">
                <select
                  v-model="form.expiryYear"
                  id="expiryYear"
                  class="form-select bg-dark text-white border-warning"
                  required
                >
                  <option value="" disabled>Año</option>
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
            <div v-if="errors.expiry" class="text-danger mt-1 small">{{ errors.expiry }}</div>
          </div>
          
          <div class="col-md-4">
            <label for="cvc" class="form-label text-warning fw-semibold">CVC</label>
            <input
              v-model="form.cvc"
              type="text"
              id="cvc"
              class="form-control bg-dark text-white border-warning"
              placeholder="123"
              maxlength="3"
              @input="formatCVC"
              required
            />
            <div v-if="errors.cvc" class="text-danger mt-1 small">{{ errors.cvc }}</div>
          </div>
        </div>

        <!-- Nombre del Titular -->
        <div class="mb-4">
          <label for="cardHolder" class="form-label text-warning fw-semibold">Nombre del Titular</label>
          <input
            v-model="form.cardHolder"
            type="text"
            id="cardHolder"
            class="form-control bg-dark text-white border-warning"
            placeholder="JUAN PÉREZ"
            required
          />
          <div v-if="errors.cardHolder" class="text-danger mt-1 small">{{ errors.cardHolder }}</div>
        </div>

        <!-- Botón de Pago -->
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-warning fw-bold px-5 py-2" :disabled="isLoading">
            {{ isLoading ? "Procesando..." : "Procesar Pago" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
// Props para recibir el order_pk y token
interface Props {
  orderPk: number;
  token: string;
}

const props = defineProps<Props>();

const isLoading = ref(false);

const form = reactive({
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvc: "",
  cardHolder: "",
});

const errors = reactive({
  cardNumber: "",
  expiry: "",
  cvc: "",
  cardHolder: "",
});

// Generar meses
const months = computed(() => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: `${String(i + 1).padStart(2, '0')} - ${new Date(2024, i).toLocaleString('es', { month: 'long' }).toUpperCase()}`
  }));
});

// Generar años (próximos 20 años)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 20 }, (_, i) => currentYear + i);
});

// Formatear número de tarjeta
const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
  
  // Limitar a 16 dígitos
  if (value.length > 16) {
    value = value.slice(0, 16);
  }
  
  // Agregar guiones cada 4 dígitos
  const formatted = value.replace(/(.{4})/g, '$1-').trim();
  
  // Eliminar guion final si existe
  form.cardNumber = formatted.endsWith('-') ? formatted.slice(0, -1) : formatted;
  
  // Validación
  if (value.length > 0 && value.length < 13) {
    errors.cardNumber = "El número de tarjeta debe tener al menos 13 dígitos";
  } else if (value.length > 16) {
    errors.cardNumber = "El número de tarjeta no puede tener más de 16 dígitos";
  } else {
    errors.cardNumber = "";
  }
};

// Formatear CVC
const formatCVC = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 3) {
    value = value.slice(0, 3);
  }
  
  form.cvc = value;
  
  // Validación
  if (value.length > 0 && value.length < 3) {
    errors.cvc = "El CVC debe tener al menos 3 dígitos";
  } else if (value.length > 3) {
    errors.cvc = "El CVC no puede tener más de 3 dígitos";
  } else {
    errors.cvc = "";
  }
};

// Validar formulario
const validateForm = (): boolean => {
  let isValid = true;
  
  // Validar número de tarjeta
  const cardNumber = form.cardNumber.replace(/-/g, '');
  if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 16) {
    errors.cardNumber = "Número de tarjeta inválido";
    isValid = false;
  }
  
  // Validar fecha de caducidad
  if (!form.expiryMonth || !form.expiryYear) {
    errors.expiry = "Selecciona mes y año de caducidad";
    isValid = false;
  } else {
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(form.expiryYear), parseInt(form.expiryMonth) - 1);
    if (expiryDate <= currentDate) {
      errors.expiry = "La tarjeta ha caducado";
      isValid = false;
    } else {
      errors.expiry = "";
    }
  }
  
  // Validar CVC
  if (!form.cvc || form.cvc.length !== 3) {
    errors.cvc = "CVC inválido";
    isValid = false;
  }
  
  // Validar nombre del titular
  if (!form.cardHolder || form.cardHolder.length < 2) {
    errors.cardHolder = "Nombre del titular requerido";
    isValid = false;
  }
  
  return isValid;
};

// Manejar envío del formulario
const handlePayment = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // Preparar datos para enviar a Django
    const paymentData = {
      'card-number': form.cardNumber,
      'exp-date': `${form.expiryMonth}/${form.expiryYear}`, // Formato MM/YYYY
      'cvc': form.cvc
    };
    
    // Enviar petición a Django
    const response = await fetch(`http://localhost:8000/api/orders/${props.orderPk}/pay-order/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`,
      },
      body: JSON.stringify(paymentData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('¡Pago realizado con éxito!');
      router.push('/profile'); 
      
      // Limpiar formulario
      Object.assign(form, {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvc: "",
        cardHolder: "",
      });
      
    } else {
      console.error("Error del servidor:", result);
      alert(result.error || result.msg || "Error al procesar el pago");
    }
    
  } catch (error) {
    console.error("Error en el procesamiento del pago:", error);
    alert("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.payment-wrapper {
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at top left, rgba(255, 215, 0, 0.15), transparent 70%),
    linear-gradient(135deg, #1a1a1a 0%, #121212 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
}

.payment-card {
  width: 100%;
  max-width: 500px;
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  color: white;
  font-weight: 600;
  border-radius: 1rem;
}

input.form-control,
select.form-select {
  background: #222 !important;
  border-color: #ffd700 !important;
  color: white !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input.form-control:focus,
select.form-select:focus {
  border-color: #ffaa00 !important;
  box-shadow: 0 0 8px #ffaa00 !important;
  background: #2b2b2b !important;
  color: white !important;
}

.form-label {
  color: #ffd700 !important;
  font-weight: 600;
}

.btn-warning {
  background-color: #ffd700 !important;
  border-color: #ffaa00 !important;
  color: #1a1a1a !important;
  font-weight: 700 !important;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6) !important;
  transition: background-color 0.3s ease;
}

.btn-warning:hover,
.btn-warning:focus {
  background-color: #ffaa00 !important;
  border-color: #ffd700 !important;
  color: #1a1a1a !important;
}

.btn-warning:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-danger {
  color: #ff6b6b !important;
  font-size: 0.85rem;
}

/* Estilos para select */
select.form-select option {
  background-color: #222;
  color: white;
}
</style>