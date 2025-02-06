import { defineStore } from 'pinia';

interface Product {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
}

interface CartState {
  productos: Product[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    productos: JSON.parse(localStorage.getItem('cart') || '[]'),
  }),
  getters: {
    total: (state) => state.productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0),
  },
  actions: {
    agregarProducto(producto: Product) {
      const existingProduct = this.productos.find(p => p.id === producto.id);
      if (existingProduct) {
        existingProduct.cantidad += producto.cantidad;
      } else {
        this.productos.push(producto);
      }
      this.persistirCarrito();
    },
    eliminarProducto(id: number) {
      this.productos = this.productos.filter(producto => producto.id !== id);
      this.persistirCarrito();
    },
    actualizarCantidad(id: number, cantidad: number) {
      const product = this.productos.find(p => p.id === id);
      if (product) {
        product.cantidad = cantidad;
      }
      this.persistirCarrito();
    },
    vaciarCarrito() {
      this.productos = [];
      this.persistirCarrito();
    },
    persistirCarrito() {
      localStorage.setItem('cart', JSON.stringify(this.productos));
    },
  },
});
