import { defineStore } from "pinia";

export interface CartProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  cantidad: number;
}

interface State {
  products: CartProduct[];
}

export const useCartStore = defineStore("cart", {
  state: (): State => ({
    products: [],
  }),

  getters: {
    total: (state) => state.products.reduce((acc, p) => acc + p.price * p.cantidad, 0),
  },

  actions: {
    // Cargar el carrito al inicializar el store
    loadCart() {
      try {
        const saved = localStorage.getItem("cart");
        if (saved) this.products = JSON.parse(saved);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    },

    // Guardar cambios en el localStorage
    persistCart() {
      localStorage.setItem("cart", JSON.stringify(this.products));
    },

    addProduct(product: CartProduct) {
      const existing = this.products.find((p) => p.id === product.id);
      existing ? (existing.cantidad += product.cantidad) : this.products.push(product);
      this.persistCart();
    },

    removeProduct(id: number) {
      this.products = this.products.filter((p) => p.id !== id);
      this.persistCart();
    },

    updateQuantity(id: number, cantidad: number) {
      const product = this.products.find((p) => p.id === id);
      if (product) {
        product.cantidad = Math.max(1, cantidad);
        this.persistCart();
      }
    },

    emptyCart() {
      this.products = [];
      this.persistCart();
    },
  },

  // Hook para cargar el carrito al inicializar el store
  hydrate() {
    this.loadCart();
  },
});
