<template>
    <div>
      <h3 class="text-lg font-semibold mb-2">Selecciona un servicio:</h3>
      <ul>
        <li
          v-for="service in services"
          :key="service.id"
          @click="selectService(service)"
          class="cursor-pointer p-2 hover:bg-blue-50 rounded"
          :class="{ 'bg-blue-100 border-blue-500': selectedService?.id === service.id }"
        >
          {{ service.name }} - ${{ service.price }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: {
      selectedService: Object
    },
    data() {
      return { services: [] };
    },
    created() {
      axios.get("http://localhost:8000/api/services/")
        .then(response => {
          this.services = response.data;
        })
        .catch(error => {
          console.error("Error cargando servicios:", error);
          alert("No se pudieron cargar los servicios");
        });
    },
    methods: {
      selectService(service) {
        this.$emit("selectService", service);
      },
    },
  };
  </script>