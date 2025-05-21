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
    loadCart() {
      try {
        const saved = localStorage.getItem("cart");
        if (saved) this.products = JSON.parse(saved);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    },

    persistCart() {
      localStorage.setItem("cart", JSON.stringify(this.products));
    },

    addProduct(product: CartProduct) {
      const existingProduct = this.products.find((p) => p.id === product.id);
      if (existingProduct) {
        // Sumar 1 solo si no supera el stock
        if (existingProduct.cantidad < existingProduct.stock) {
          existingProduct.cantidad += 1;
          this.persistCart();
        } else {
          alert("No puedes añadir más productos, stock insuficiente");
        }
      } else {
        if (product.stock > 0) {
          this.products.push({ ...product, cantidad: 1 });
          this.persistCart();
        } else {
          alert("Producto sin stock");
        }
      }
    },

    removeProduct(id: number) {
      this.products = this.products.filter((p) => p.id !== id);
      this.persistCart();
    },

    updateQuantity(id: number, cantidad: number) {
      const product = this.products.find((p) => p.id === id);
      if (product) {
        if (cantidad > product.stock) {
          alert("No puedes seleccionar una cantidad mayor al stock disponible");
          product.cantidad = product.stock;
        } else if (cantidad < 1) {
          product.cantidad = 1;
        } else {
          product.cantidad = cantidad;
        }
        this.persistCart();
      }
    },

    emptyCart() {
      this.products = [];
      this.persistCart();
    },
  },

  hydrate() {
    this.loadCart();
  },
});
