<template>
  <div class="container mt-4">
    <h2 class="mb-4">Panel de Administrador</h2>

    <div class="row">
      <!-- Tarjetas de resumen -->
      <div class="col-md-4" v-for="card in summaryCards" :key="card.title">
        <div class="card text-white bg-primary mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text fs-4">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Gráficas -->
      <div class="col-md-6 mb-4">
        <canvas id="lineChart"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas id="barChart"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas id="pieChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";

const summaryCards = ref([
  { title: "Usuarios", value: 0 },
  { title: "Ventas", value: 0 },
  { title: "Productos", value: 0 },
]);

onMounted(async () => {
  await fetchSummary();
  await createCharts();
});

async function fetchSummary() {
  const res = await axios.get("/api/dashboard/summary/");
  summaryCards.value = [
    { title: "Usuarios", value: res.data.usuarios },
    { title: "Ventas", value: res.data.ventas },
    { title: "Productos", value: res.data.productos },
  ];
}

async function createCharts() {
  const lineRes = await axios.get("/api/dashboard/users-per-month/");
  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: lineRes.data.labels,
      datasets: [
        {
          label: "Usuarios por mes",
          data: lineRes.data.values,
          borderColor: "blue",
          fill: false,
        },
      ],
    },
  });

  const barRes = await axios.get("/api/dashboard/sales-by-category/");
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: barRes.data.labels,
      datasets: [
        {
          label: "Ventas por categoría",
          data: barRes.data.values,
          backgroundColor: "green",
        },
      ],
    },
  });

  const pieRes = await axios.get("/api/dashboard/user-roles/");
  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: pieRes.data.labels,
      datasets: [
        {
          data: pieRes.data.values,
          backgroundColor: ["red", "orange", "purple"],
        },
      ],
    },
  });
}
</script>

<style scoped>
.card {
  cursor: default;
}
</style>
