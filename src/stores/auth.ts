import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('authToken') || null);

  // Cargar estado inicial desde localStorage
  const initialize = () => {
    token.value = localStorage.getItem('authToken');
  };

  const isAuthenticated = computed<boolean>(() => {
    initialize(); // Actualizar en cada acceso
    return !!token.value;
  });

  function setToken(newToken: string): void {
    token.value = newToken;
    localStorage.setItem('authToken', newToken);
  }

  function logout(): void {
    token.value = null;
    localStorage.removeItem('authToken');
    window.location.reload(); // Limpiar estado en toda la app
  }

  return { 
    token, 
    isAuthenticated, 
    setToken, 
    logout,
    initialize
  };
});