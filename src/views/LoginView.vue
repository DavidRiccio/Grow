<template>
  <div class="login-wrapper d-flex justify-content-center align-items-center">
    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      <div 
        v-if="toastMessage" 
        class="toast show" 
        :class="{ 'toast-error': toastType === 'error', 'toast-success': toastType === 'success' }"
        role="alert"
      >
        <div class="toast-header">
          <strong class="me-auto">
            <i :class="toastType === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'"></i>
            {{ toastType === 'error' ? 'Error' : 'Éxito' }}
          </strong>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeToast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
    </div>

    <div class="card p-4 rounded-4 shadow login-card">
      <h2 class="text-warning mb-4 text-center">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label text-warning fw-semibold">Usuario</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu usuario"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="form-label text-warning fw-semibold">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu contraseña"
            required
          />
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <button type="submit" class="btn btn-warning fw-bold px-4" :disabled="isLoading">
            {{ isLoading ? "Procesando..." : "Entrar" }}
          </button>
          <router-link to="/signup" class="btn btn-outline-warning"> Registrarse </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import axios from "axios";

const userStore = useUserStore();
const router = useRouter();
const isLoading = ref(false);

// Estado para el toast
const toastMessage = ref("");
const toastType = ref<"success" | "error">("error");
const toastTimeout = ref<NodeJS.Timeout | null>(null);

const form = reactive({
  username: "",
  password: "",
});

// Función para mostrar toast
const showToast = (message: string, type: "success" | "error" = "error") => {
  toastMessage.value = message;
  toastType.value = type;
  
  // Auto-cerrar después de 4 segundos
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value);
  }
  toastTimeout.value = setTimeout(() => {
    closeToast();
  }, 4000);
};

// Función para cerrar toast
const closeToast = () => {
  toastMessage.value = "";
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value);
    toastTimeout.value = null;
  }
};

const handleLogin = async () => {
  if (!form.username || !form.password) {
    showToast("Por favor, introduce usuario y contraseña", "error");
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post("http://localhost:8000/login/", form);
    const token = response.data.token;
    const role = response.data.role;

    if (!token) {
      showToast("Token no recibido, login fallido", "error");
      return;
    }

    if (!role) {
      showToast("Rol no recibido, login fallido", "error");
      return;
    }

    userStore.setUser({ username: form.username, token, role });
    
    // Esperar un poco antes de redirigir para que se vea el toast de éxito
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);

  } catch (error: any) {
    console.error("Error en el login:", error.response?.data || error.message);
    
    // Mensaje más específico según el error
    let errorMessage = "Usuario o contraseña incorrectos";
    if (error.response?.status === 401) {
      errorMessage = "Credenciales inválidas. Verifica tu usuario y contraseña";
    } else if (error.response?.status === 500) {
      errorMessage = "Error del servidor. Inténtalo más tarde";
    } else if (!error.response) {
      errorMessage = "No se pudo conectar con el servidor";
    }
    
    showToast(errorMessage, "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
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

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  color: white;
  font-weight: 600;
  border-radius: 1rem;
}

input.form-control {
  background: #222 !important;
  border-color: #ffd700 !important;
  color: white !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input.form-control:focus {
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

.btn-outline-warning {
  color: #ffd700 !important;
  border-color: #ffd700 !important;
  font-weight: 600 !important;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-outline-warning:hover,
.btn-outline-warning:focus {
  background-color: #ffd700 !important;
  color: #1a1a1a !important;
}

/* Estilos para Toast */
.toast-container {
  z-index: 9999;
}

.toast {
  min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: none;
  animation: slideInRight 0.3s ease-out;
}

.toast-error {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.toast-success {
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
}

.toast-header {
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
}

.toast-body {
  font-weight: 500;
}

.btn-close {
  filter: invert(1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .toast {
    min-width: 280px;
    margin: 0 1rem;
  }
  
  .toast-container {
    left: 0;
    right: 0;
    top: 1rem !important;
  }
}</style>