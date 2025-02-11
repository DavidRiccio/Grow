<template>
  <div class="container-fluid bg-dark py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow-lg border-secondary">
          <div class="card-body p-4 p-md-5">
            <!-- Encabezado -->
            <div class="text-center text-warning mb-4">
              <h1 class="h3 fw-bold text-light">Formulario de Contacto</h1>
              <p class="text-muted">Estamos aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo.</p>
            </div>

            <!-- Formulario -->
            <form class="row g-3">
              <!-- Nombre completo -->
              <div class="col-12">
                <label for="nombre" class="form-label text-light">Nombre completo</label>
                <input 
                  type="text" 
                  class="form-control bg-dark text-light border-gray" 
                  id="nombre" 
                  placeholder="Ingresa tu nombre completo" 
                  required
                />
              </div>

              <!-- Correo electrónico -->
              <div class="col-12">
                <label for="email" class="form-label text-light">Correo electrónico</label>
                <input 
                  type="email" 
                  class="form-control bg-dark text-light border-gray" 
                  id="email" 
                  placeholder="Ingresa tu correo electrónico" 
                  required
                />
              </div>

              <!-- Teléfono y Asunto -->
              <div class="col-12 col-md-6">
                <label for="telefono" class="form-label text-light">Teléfono</label>
                <input 
                  type="tel" 
                  class="form-control bg-dark text-light border-gray" 
                  id="telefono" 
                  placeholder="Ingresa tu número de teléfono"
                />
              </div>

              <div class="col-12 col-md-6">
                <label for="asunto" class="form-label text-light">Asunto</label>
                <select 
                  class="form-select bg-dark text-light border-gray" 
                  id="asunto" 
                  required
                >
                  <option value="">Seleccione...</option>
                  <option>Consulta general</option>
                  <option>Soporte técnico</option>
                  <option>Información de cursos</option>
                </select>
              </div>

              <!-- Mensaje -->
              <div class="col-12">
                <label for="mensaje" class="form-label text-light">Mensaje</label>
                <textarea 
                  class="form-control bg-dark text-light border-gray" 
                  id="mensaje" 
                  rows="5" 
                  placeholder="Escribe tu mensaje aquí" 
                  required
                ></textarea>
              </div>

              <!-- Botón -->
              <div class="col-12 text-center mt-4">
                <button 
                  type="submit" 
                  class="btn btn-warning px-5 rounded-pill fw-semibold shadow-sm"
                >
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container-fluid {
  background: radial-gradient(circle at top, #1a1a1a, #121212);
  min-height: calc(100vh - 100px);
}
.card {
  background-color: #1e1e1e;
  border-radius: 15px;
  border: 1px solid #2d2d2d;
}
.form-label {
  font-weight: 500;
  color: #e0e0e0 !important;
}
.form-control,
.form-select {
  background-color: #2d2d2d !important;
  border: 1px solid #404040 !important;
  color: #ffffff !important;
  transition: all 0.3s ease;
}
.form-control:focus,
.form-select:focus {
  border-color: #3498db !important;
  box-shadow: 0 0 0 0.25rem rgba(52, 152, 219, 0.25) !important;
}
.btn-primary {
  background-color: #3498db;
  border: none;
  padding: 0.75rem 2rem;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}
.text-muted {
  color: #b0b0b0 !important;
}
.border-gray {
  border-color: #404040 !important;
}
@media (max-width: 768px) {
  .btn-primary {
    width: 100%;
  }
}
</style>
