import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  user: string;
  role: string;
  token: string;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const token = ref<string | null>(localStorage.getItem('authToken') || null);

  const role = computed(() => user.value?.role ?? null);
  const initialize = () => {
    token.value = localStorage.getItem('authToken');
  };
  const isAuthenticated = computed<boolean>(() => {
    initialize(); // Actualizar en cada acceso
    return !!token.value;
  });

  function logout(): void {
    token.value = null;
    localStorage.removeItem('authToken');
    window.location.reload(); // Limpiar estado en toda la app
  }
  async function fetchUser(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:8000/api/user/', {
        credentials: 'include', 
      });
      if (!response.ok) {
        throw new Error('No se pudo obtener el usuario');
      }
      const data: User = await response.json();
      user.value = data;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    logout,
    fetchUser,
  };
});
