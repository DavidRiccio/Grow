<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center py-5">
      <div class="col-12 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4 p-md-5">
            <!-- Encabezado -->
            <div class="row mb-4">
              <div class="col-12 text-center">
                <h1 class="h3 fw-bold text-dark pb-2">
                  Formulario de Contacto
                </h1>
              </div>
            </div>

            <!-- Formulario -->
            <form class="row g-4">
              <!-- Nombre y Email -->
              <div class="col-12 col-md-6">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input type="text" class="form-control" id="nombre" required>
              </div>

              <div class="col-12 col-md-6">
                <label for="email" class="form-label">Correo electrónico</label>
                <input type="email" class="form-control" id="email" required>
              </div>

              <!-- Teléfono y Asunto -->
              <div class="col-12 col-md-6">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="tel" class="form-control" id="telefono">
              </div>

              <div class="col-12 col-md-6">
                <label for="asunto" class="form-label">Asunto</label>
                <select class="form-select" id="asunto" required>
                  <option value="">Seleccione...</option>
                  <option>Consulta general</option>
                  <option>Soporte técnico</option>
                  <option>Información de cursos</option>
                </select>
              </div>

              <!-- Mensaje -->
              <div class="col-12">
                <label for="mensaje" class="form-label">Mensaje</label>
                <textarea class="form-control" id="mensaje" rows="4" required></textarea>
              </div>

              <!-- Botón -->
              <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary px-5 rounded-pill">
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

<script setup lang="ts">
</script>

<style scoped>
.container-fluid {
  min-height: calc(100vh - 120px); /* Ajuste para header y footer */
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.card {
  border: none;
  border-radius: 15px;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
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
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }

  .card-body {
    padding: 1.5rem !important;
  }
}
</style>
