<!-- CourseCards.vue -->
<template>
  <div class="card h-100 shadow-sm hover-effect">
    <div class="card-body d-flex flex-column justify-content-center align-items-center p-4">
      <h3 class="card-title fs-5 fw-bold mb-3 text-center">{{ card.name }}</h3>
      <p class="card-text text-light small text-center mb-4">{{ card.description }}</p>
      <button class="btn btn-success btn-sm rounded-pill px-4">
        Ver más
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['card']
}
</script>

<style scoped>
.hover-effect {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro para mejorar la legibilidad */
  border: none; /* Eliminar el borde */
  background-image: url('../assets/img/Curso.webp'); /* Cambia esta ruta a la de tu imagen */
  background-size: cover; /* Ajusta la imagen para cubrir el área */
  background-position: center; /* Centra la imagen */
  color: white; /* Color del texto */
  border-radius: 0.5rem; /* Bordes redondeados */
}

.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada al pasar el mouse */
}

.card {
  font-size: 1rem; /* Aumentar el tamaño de la fuente */
  position: relative; /* Asegúrate de que el contenido se posicione correctamente */
  overflow: hidden; /* Evita que el contenido sobresalga */
  border-radius: 0.5rem; /* Bordes redondeados */
}

.card-body {
  backdrop-filter: blur(5px); /* Efecto de desenfoque en el fondo */
}
</style>
