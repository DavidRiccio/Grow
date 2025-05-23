import { defineStore } from "pinia";

// Store para usuario
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as { username: string; role: string } | null, 
    token: null as string | null,
    isAuthenticated: false,
  }),
  actions: {
    setUser (payload: { username: string; token: string; role: string }) { 
      this.user = { username: payload.username, role: payload.role }; 
      this.token = payload.token;
      this.isAuthenticated = true;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("username", payload.username);
      localStorage.setItem("role", payload.role); 
    },
    initialize() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role"); 
      if (token && username && role) {
        this.token = token;
        this.user = { username, role }; 
        this.isAuthenticated = true;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    },
  },
});

// Store para carrito
export const useCartStore = defineStore("cart", {
  state: () => ({
    productos: [] as any[],
    total: 0,
  }),
  actions: {
    setProductos(productos: any[]) {
      this.productos = productos;
      this.actualizarTotal();
    },
    eliminarProducto(id: number) {
      this.productos = this.productos.filter(p => p.id !== id);
      this.actualizarTotal();
    },
    actualizarCantidad(id: number, cantidad: number) {
      const producto = this.productos.find(p => p.id === id);
      if (producto && cantidad >= 1 && cantidad <= producto.stock) {
        producto.cantidad = cantidad;
        this.actualizarTotal();
      }
    },
    vaciarCarrito() {
      this.productos = [];
      this.total = 0;
    },
    actualizarTotal() {
      this.total = this.productos.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0
      );
    },
  },
});