import { defineStore } from "pinia";

// Store para usuario
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as { username: string } | null,
    token: null as string | null,
    isAuthenticated: false,
  }),
  actions: {
    setUser(payload: { username: string; token: string }) {
      this.user = { username: payload.username };
      this.token = payload.token;
      this.isAuthenticated = true;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("username", payload.username);
    },
    initialize() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token && username) {
        this.token = token;
        this.user = { username };
        this.isAuthenticated = true;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
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
