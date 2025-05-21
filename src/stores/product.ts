// stores/product.ts
import { defineStore } from 'pinia';
import axios from 'axios';
interface Product {
    id: number;
    name: string;
    description: string;
    price: number; 
    stock: number;
    image: string;
  }

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}


export const useProductStore = defineStore('products', {
  state: (): ProductState => ({
    products: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProducts() {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get('http://localhost:8000/api/products/');
          this.products = response.data.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            precio: parseFloat(product.price), // Asegúrate que "price" existe en el JSON
            stock: product.stock,
            image: product.image // Si usas proxy
          }));
        } catch (err) {
          this.error = 'Error cargando productos';
        } finally {
          this.loading = false;
        }
      },
      
  },
});