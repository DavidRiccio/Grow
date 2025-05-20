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
    total(state) {
      return state.products.reduce((acc, p) => acc + p.price * p.cantidad, 0);
    },
  },

  actions: {
    loadCart() {
      const saved = localStorage.getItem("cart");
      if (saved) {
        this.products = JSON.parse(saved);
      }
    },

    persistCart() {
      localStorage.setItem("cart", JSON.stringify(this.products));
    },

    addProduct(product: CartProduct) {
      const existing = this.products.find((p) => p.id === product.id);
      if (existing) {
        existing.cantidad = product.cantidad;
      } else {
        this.products.push(product);
      }
      this.persistCart();
    },

    removeProduct(id: number) {
      this.products = this.products.filter((p) => p.id !== id);
      this.persistCart();
    },

    emptyCart() {
      this.products = [];
      this.persistCart();
    },
  },
});
