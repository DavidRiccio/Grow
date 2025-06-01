import { defineStore } from "pinia";

// Interfaces para tipado
interface User {
  username: string;
  role: string;
  email?: string;
  id?: number;
}

interface UserPayload {
  username: string;
  token: string;
  role: string;
  email?: string;
  id?: number;
}

// Store para usuario
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null, 
    token: null as string | null,
    isAuthenticated: false,
    isLoading: false,
  }),
  
  getters: {
    isAdmin: (state) => state.user?.role === 'A',
    userInitials: (state) => {
      if (!state.user?.username) return 'U';
      return state.user.username.charAt(0).toUpperCase();
    }
  },

  actions: {
    setUser(payload: UserPayload) { 
      this.user = { 
        username: payload.username, 
        role: payload.role,
        email: payload.email,
        id: payload.id
      }; 
      this.token = payload.token;
      this.isAuthenticated = true;
      
      // Guardar en localStorage de forma segura
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("token", payload.token);
          localStorage.setItem("username", payload.username);
          localStorage.setItem("role", payload.role);
          if (payload.email) localStorage.setItem("email", payload.email);
          if (payload.id) localStorage.setItem("userId", payload.id.toString());
        } catch (error) {
          console.warn('Error al guardar en localStorage:', error);
        }
      }
    },

    initialize() {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') return;
      
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const email = localStorage.getItem("email");
        const userId = localStorage.getItem("userId");
        
        if (token && username && role) {
          this.token = token;
          this.user = { 
            username, 
            role,
            email: email || undefined,
            id: userId ? parseInt(userId) : undefined
          }; 
          this.isAuthenticated = true;
        }
      } catch (error) {
        console.warn('Error al inicializar desde localStorage:', error);
        this.logout(); // Limpiar si hay datos corruptos
      }
    },

    async fetchUser() {
      if (!this.token) {
        console.warn('No hay token para obtener datos del usuario');
        return;
      }

      this.isLoading = true;
      
      try {
        const response = await fetch('http://localhost:8000/api/user/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const userData = await response.json();
        
        // Actualizar los datos del usuario
        this.user = {
          username: userData.username || this.user?.username || '',
          role: userData.role || this.user?.role || '',
          email: userData.email,
          id: userData.id
        };

        // Actualizar localStorage con los nuevos datos
        if (typeof window !== 'undefined') {
          try {
            if (userData.email) localStorage.setItem("email", userData.email);
            if (userData.id) localStorage.setItem("userId", userData.id.toString());
          } catch (error) {
            console.warn('Error al actualizar localStorage:', error);
          }
        }
        
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        
        // Si el error es de autenticación (401), limpiar la sesión
        if (error instanceof Error && error.message.includes('401')) {
          this.logout();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      // Limpiar estado
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.isLoading = false;
      
      // Limpiar localStorage de forma segura
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          localStorage.removeItem("userId");
        } catch (error) {
          console.warn('Error al limpiar localStorage:', error);
        }
      }
    },

    // Método para verificar si el token sigue siendo válido
    async validateToken(): Promise<boolean> {
      if (!this.token) return false;
      
      try {
        const response = await fetch('http://localhost:8000/api/auth/validate/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        return response.ok;
      } catch (error) {
        console.warn('Error al validar token:', error);
        return false;
      }
    }
  },
});

// Store para carrito
export const useCartStore = defineStore("cart", {
  state: () => ({
    productos: [] as any[],
    total: 0,
  }),
  
  getters: {
    itemCount: (state) => state.productos.reduce((total, producto) => total + producto.cantidad, 0),
    isEmpty: (state) => state.productos.length === 0,
  },

  actions: {
    // Cargar productos desde localStorage
    loadFromStorage() {
      if (typeof window === 'undefined') return;
      
      try {
        const cartItems = localStorage.getItem("cartItems");
        if (cartItems) {
          this.productos = JSON.parse(cartItems);
          this.actualizarTotal();
        }
      } catch (error) {
        console.warn('Error al cargar carrito desde localStorage:', error);
        this.productos = [];
        this.total = 0;
      }
    },

    // Guardar en localStorage
    saveToStorage() {
      if (typeof window === 'undefined') return;
      
      try {
        localStorage.setItem("cartItems", JSON.stringify(this.productos));
      } catch (error) {
        console.warn('Error al guardar carrito en localStorage:', error);
      }
    },

    setProductos(productos: any[]) {
      this.productos = productos;
      this.actualizarTotal();
      this.saveToStorage();
    },

    addProduct(producto: any) {
      const existingIndex = this.productos.findIndex(p => p.id === producto.id);
      
      if (existingIndex !== -1) {
        // Si ya existe, actualizar cantidad
        this.productos[existingIndex] = { ...producto };
      } else {
        // Si no existe, agregarlo
        this.productos.push({ ...producto });
      }
      
      this.actualizarTotal();
      this.saveToStorage();
    },

    eliminarProducto(id: number) {
      this.productos = this.productos.filter(p => p.id !== id);
      this.actualizarTotal();
      this.saveToStorage();
    },

    actualizarCantidad(id: number, cantidad: number) {
      const producto = this.productos.find(p => p.id === id);
      if (producto && cantidad >= 1 && cantidad <= producto.stock) {
        producto.cantidad = cantidad;
        this.actualizarTotal();
        this.saveToStorage();
      }
    },

    vaciarCarrito() {
      this.productos = [];
      this.total = 0;
      
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem("cartItems");
        } catch (error) {
          console.warn('Error al limpiar carrito de localStorage:', error);
        }
      }
    },

    actualizarTotal() {
      this.total = this.productos.reduce(
        (acc, p) => acc + (p.precio || p.price || 0) * p.cantidad,
        0
      );
    },
  },
});