<template>
  <div class="login-wrapper d-flex justify-content-center align-items-center">
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
          <button type="submit" class="btn btn-warning fw-bold px-4">
            Entrar
          </button>
          <router-link to="/signup" class="btn btn-outline-warning">
            Registrarse
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:8000/login/", form);
    const token = response.data.token;
    if (!token) {
      alert("Token no recibido, login fallido");
      return;
    }
    userStore.setUser({ username: form.username, token });
    router.push("/");
  } catch (error: any) {
    console.error("Error en el login:", error.response?.data || error.message);
    alert("Usuario o contraseña incorrectos.");
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
  font-family: 'Poppins', sans-serif;
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
</style>
