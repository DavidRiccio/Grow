// src/composables/useCart.ts
import { useCartStore } from '../stores/cart';

export const useCart = () => {
  const cartStore = useCartStore();

  const agregarProducto = (producto) => {
    cartStore.agregarProducto(producto);
  };

  const eliminarProducto = (id) => {
    cartStore.eliminarProducto(id);
  };

  const calcularIGIC = () => {
    return cartStore.total * 0.07;
  };

  return {
    agregarProducto,
    eliminarProducto,
    calcularIGIC,
    total: cartStore.total,
  };
};
