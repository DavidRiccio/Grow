import { defineStore } from 'pinia';

interface Product {
  id: number;
  name: string;
  cantidad: number;
  precio: number;
  image: string;
  stock: number;
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
        // Incrementar la cantidad del producto existente de manera reactiva
        existingProduct.cantidad += producto.cantidad;
      } else {
        // Agregar un nuevo producto al carrito
        this.productos.push({ ...producto, cantidad: producto.cantidad });
      }
      this.persistirCarrito();
    },
    eliminarProducto(id: number) {
      // Filtrar para eliminar solo el producto con el ID especificado
      this.productos = this.productos.filter(producto => producto.id !== id);
      this.persistirCarrito();
    },
    actualizarCantidad(id: number, cantidad: number) {
      const product = this.productos.find(p => p.id === id);
      if (product) {
        if (cantidad > 0) {
          // Actualizar la cantidad si es válida
          product.cantidad = cantidad;
        } else {
          // Eliminar el producto si la cantidad es 0
          this.eliminarProducto(id);
        }
      }
      this.persistirCarrito();
    },
    vaciarCarrito() {
      // Vaciar el carrito
      this.productos = [];
      this.persistirCarrito();
    },
    persistirCarrito() {
      // Guardar el estado del carrito en localStorage
      localStorage.setItem('cart', JSON.stringify(this.productos));
    },
  },
});
