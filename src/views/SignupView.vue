<template>
  <div class="signup-wrapper d-flex justify-content-center align-items-center">
    <div class="card p-4 rounded-4 shadow signup-card">
      <h2 class="text-warning mb-4 text-center">Registrate</h2>
      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label text-warning fw-semibold">Username:</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu usuario"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label text-warning fw-semibold">Contraseña:</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu contraseña"
            required
          />
        </div>

        <div class="mb-3">
          <label for="first_name" class="form-label text-warning fw-semibold">Nombre:</label>
          <input
            v-model="form.first_name"
            type="text"
            id="first_name"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu nombre"
            required
          />
        </div>

        <div class="mb-3">
          <label for="last_name" class="form-label text-warning fw-semibold">Apellido:</label>
          <input
            v-model="form.last_name"
            type="text"
            id="last_name"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu apellido"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="form-label text-warning fw-semibold">Email:</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="form-control bg-dark text-white border-warning"
            placeholder="Introduce tu email"
            required
          />
        </div>

        <button type="submit" class="btn btn-warning fw-bold w-100 py-2 mb-3">
          Ingresar
        </button>

        <div v-if="errorMessage" class="text-danger text-center fw-semibold">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "http://localhost:8000/signup/",
          this.form
        );

        localStorage.setItem("authToken", response.data.token);
        this.$root.$emit("update-auth-status");
        this.$router.push("/login");
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Error en el login";
      }
    },
  },
};
</script>

<style scoped>
.signup-wrapper {
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

.signup-card {
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
</style>
