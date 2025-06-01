import { defineStore } from "pinia";

// Store para carrito
export const useCartStore = defineStore("cart", {
  state: () => ({
    products: [] as any[], // Cambiado de 'productos' a 'products'
    total: 0,
  }),
  actions: {
    // Cargar carrito desde localStorage
    loadCart() {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const parsedData = JSON.parse(cartData);
        this.products = parsedData.products || [];
        this.updateTotal();
      }
    },

    // Guardar carrito en localStorage
    saveCart() {
      localStorage.setItem("cart", JSON.stringify({
        products: this.products,
        total: this.total
      }));
    },

    // Agregar producto al carrito
    addProduct(product: any) {
      const existingProduct = this.products.find(p => p.id === product.id);
      
      if (existingProduct) {
        // Si el producto ya existe, actualizar la cantidad
        existingProduct.cantidad = product.cantidad;
      } else {
        // Si es un producto nuevo, agregarlo
        this.products.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          cantidad: product.cantidad || 1
        });
      }
      
      this.updateTotal();
      this.saveCart();
    },

    // Actualizar productos (para compatibilidad con código existente)
    setProductos(productos: any[]) {
      this.products = productos.map(p => ({
        ...p,
        cantidad: p.cantidad || 1
      }));
      this.updateTotal();
      this.saveCart();
    },

    // Eliminar producto del carrito
    removeProduct(id: number) {
      this.products = this.products.filter(p => p.id !== id);
      this.updateTotal();
      this.saveCart();
    },

    // Método para compatibilidad (eliminarProducto -> removeProduct)
    eliminarProducto(id: number) {
      this.removeProduct(id);
    },

    // Actualizar cantidad de un producto
    updateQuantity(id: number, cantidad: number) {
      const product = this.products.find(p => p.id === id);
      if (product && cantidad >= 1 && cantidad <= product.stock) {
        product.cantidad = cantidad;
        this.updateTotal();
        this.saveCart();
      }
    },

    // Método para compatibilidad (actualizarCantidad -> updateQuantity)
    actualizarCantidad(id: number, cantidad: number) {
      this.updateQuantity(id, cantidad);
    },

    // Vaciar carrito
    emptyCart() {
      this.products = [];
      this.total = 0;
      localStorage.removeItem("cart");
    },

    // Método para compatibilidad (vaciarCarrito -> emptyCart)
    vaciarCarrito() {
      this.emptyCart();
    },

    // Actualizar total del carrito
    updateTotal() {
      this.total = this.products.reduce(
        (acc, p) => acc + (p.price * p.cantidad),
        0
      );
    },

    // Método para compatibilidad (actualizarTotal -> updateTotal)
    actualizarTotal() {
      this.updateTotal();
    },
  },
});