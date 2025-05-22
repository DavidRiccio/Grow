import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/AboutView.vue';
import Home from '../views/HomeView.vue';
import Contact from '../views/ContactView.vue';
import Services from '../views/ServicesView.vue';
import Products from '../views/ProductsView.vue';
import Events from '../views/EventsView.vue';
import Cart from '../views/CartView.vue';
import Login from '../views/LoginView.vue';
import Signup from '../views/SignupView.vue';
import Reserva from '../views/BookingForm.vue'; 
import Admin from '../views/AdminDashboard.vue';
import Profile from '@/views/ProfileView.vue';
import { useUserStore } from '@/stores/userStore'; 

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/products', component: Products },
  { path: '/services', component: Services },
  { path: '/events', component: Events },
  {
    path: '/eventos/:id',
    name: 'EventDetail',
    component: () => import('@/views/EventDetail.vue')
  },
  { path: '/cart', component: Cart },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresRole: 'A' } }, // Agregar meta para rol
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/profile', component: Profile },
  {
    path: '/reserva',
    name: 'Reserva',
    component: Reserva,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    
    return { top: 0, left: 0 };
  }, 
});

// Guardias de navegación
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // Obtener el store de usuario
  const requiresAuth = to.meta.requiresAuth;
  const requiresRole = to.meta.requiresRole;

  // Verificar si la ruta requiere autenticación
  if (requiresAuth && !userStore.isAuthenticated) {
    next({ path: '/login' }); // Redirigir a login si no está autenticado
  } else if (requiresRole && userStore.user?.role !== requiresRole) {
    next({ path: '/' }); // Redirigir a inicio si no tiene el rol adecuado
  } else {
    next(); // Permitir el acceso
  }
});

export default router;
