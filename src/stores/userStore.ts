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

  const role = computed(() => user.value?.role ?? null);

  async function fetchUser(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/user/me/', {
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
    fetchUser,
  };
});
