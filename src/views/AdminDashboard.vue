<template>
  <div class="container mt-4" v-if="isAuthorized">
    <h2 class="mb-4 text-ligth">Panel de Administrador</h2>

    <div class="row">
      <!-- Tarjetas de resumen -->
      <div class="col-md-4" v-for="card in summaryCards" :key="card.title">
        <div class="card text-white bg-primary mb-3">
          <div class="card-body">
            <h1>Hola</h1>
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text fs-4">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Gráficas -->
      <div class="col-md-6 mb-4">
        <canvas id="lineChart1"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas id="lineChart2"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas id="lineChart3"></canvas>
      </div>
    </div>
  </div>
  <div v-else>
    <h2 class="text-danger">Acceso Denegado</h2>
    <p>No tienes permiso para acceder a esta página.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/userStore";
import Chart from "chart.js/auto";
import axios from "axios";

const userStore = useUserStore();
const isAuthorized = ref(false);
const token = localStorage.getItem("token");

onMounted(async () => {
  userStore.initialize();
  checkAuthorization(); 
  if (isAuthorized.value) {
    await createCharts();
  }
});

function checkAuthorization() {
  console.log(userStore.user.role);
  if (userStore.user && userStore.user.role === "A") {
    isAuthorized.value = true;
  } else {
    isAuthorized.value = false;
  }
}


async function createCharts() {
  const lineRes = await axios.get("http://localhost:8000/api/users-per-mounth/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  new Chart(document.getElementById("lineChart1"), {
    type: "line",
    data: {
      labels: lineRes.data.labels, 
      datasets: [
        {
          label: "Usuarios por mes",
          data: lineRes.data.values, 
          borderColor: "yellow",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Número de Usuarios',
          },
        },
      },
    },
  });
  const responseOrders = await axios.get(
    "http://localhost:8000/api/orders/get-earnings/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const earningsDataOrders = responseOrders.data;
  new Chart(document.getElementById("lineChart2"), {
    type: "line",
    data: {
      labels: responseOrders.data.labels, 
      datasets: [
        {
          label: `Ganancias Mensuales de Pedidos`,
          data: responseOrders.data.values, 
          borderColor: "green",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Ganancias',
          },
        },
      },
    },
  });

  const responseBookings = await axios.get(
    "http://localhost:8000/api/bookings/get-earnings/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const earningsDataBookings = responseBookings.data;
  new Chart(document.getElementById("lineChart3"), {
    type: "line",
    data: {
      labels: responseBookings.data.labels, 
      datasets: [
        {
          label: `Ganancias Mensuales de Reservas`,
          data: responseBookings.data.values, 
          borderColor: "pink",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Ganancias',
          },
        },
      },
    },
  });
}
</script>

<style scoped>
.container {
  background-color: #1c1c1c; /* Fondo oscuro */
  color: #e0e0e0; /* Texto claro */
  padding: 20px;
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Sombra sutil */
}

.card {
  background-color: #2a2a2a; /* Fondo de tarjeta oscuro */
  border: none; /* Sin borde */
  border-radius: 8px; /* Bordes redondeados */
  transition: transform 0.2s; /* Efecto de transición */
}

.card:hover {
  transform: scale(1.05); /* Efecto de aumento al pasar el ratón */
}

.card-title {
  font-weight: bold; /* Título enfático */
}

.card-text {
  font-size: 1.5rem; /* Tamaño de texto más grande */
}

h2 {
  font-weight: bold; /* Títulos del panel */
  border-bottom: 2px solid #f0ad4e; /* Línea de separación */
  padding-bottom: 10px;
}

.text-danger {
  color: #d9534f; /* Color para el mensaje de acceso denegado */
}

/* Gráficas */
canvas {
  background-color: #2a2a2a; /* Fondo para el canvas */
  border-radius: 8px; /* Bordes redondeados */
}

</style>
