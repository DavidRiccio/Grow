<template>
  <div>
    <!-- Componente de formulario de pago -->
    <PaymentForm 
      :order-pk="parseInt(orderPk)" 
      :token="token" 
      @payment-success="handlePaymentSuccess"
      @payment-error="handlePaymentError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PaymentForm from '../components/PaymentForm.vue'

// Props que vienen del router
const props = defineProps<{
  orderPk: string;
}>();

const router = useRouter();

// Obtener token del localStorage
const token = computed(() => localStorage.getItem('token') || '');

// Manejar éxito del pago
const handlePaymentSuccess = () => {
  alert('¡Pago realizado con éxito!');
  router.push('/profile'); 
};

// Manejar error del pago
const handlePaymentError = (error: string) => {
  console.error('Error en el pago:', error);
  alert(`Error en el pago: ${error}`);
};

// Verificar que tenemos los datos necesarios
if (!props.orderPk || !token.value) {
  router.push('/cart');
}
</script>