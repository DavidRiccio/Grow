<template>
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username:</label>
          <input type="text" v-model="form.username" required>
        </div>
        
        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" v-model="form.password" required>
        </div>
  
        <button type="submit" class="btn-login">Ingresar</button>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        errorMessage: ''
      }
    },
    methods: {
        async handleLogin() {
  try {
    const response = await axios.post('http://localhost:8000/login/', this.form);
    
    // Guardar token y actualizar estado
    localStorage.setItem('authToken', response.data.token);
    
    // Actualizar navbar sin recargar
    this.$root.$emit('update-auth-status'); // Nuevo evento
    
    // Redirigir a home
    this.$router.push('/');
    
  } catch (error) {
    this.errorMessage = error.response?.data?.message || 'Error en el login';
  }
        }}}
</script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn-login {
    background-color: #ffb100;
    color: black;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  </style>