import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// Vistas importadas directamente
import Home from '../views/HomeView.vue';
import About from '../views/AboutView.vue';
import Contact from '../views/ContactView.vue';
import Services from '../views/ServicesView.vue';
import Products from '../views/ProductsView.vue';
import Events from '../views/EventsView.vue';
import Cart from '../views/CartView.vue';
import Login from '../views/LoginView.vue';
import Signup from '../views/SignupView.vue';
import Reserva from '../views/BookingForm.vue';
import Admin from '../views/AdminDashboard.vue';
import Profile from '../views/ProfileView.vue';
import Payment from '../views/PaymentView.vue';

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
    component: () => import('../views/EventDetail.vue')
  },
  { path: '/cart', component: Cart },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, requiresRole: 'A' }
  },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/profile', component: Profile },
  {
    path: '/payment/:orderPk',
    name: 'Payment',
    component: Payment,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/reserva',
    name: 'Reserva',
    component: Reserva,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, left: 0 };
  }
});

// Guardias de navegación
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresRole = to.meta.requiresRole;

  if (requiresAuth && !userStore.isAuthenticated) {
    next({ path: '/login' });
  } else if (requiresRole && userStore.user?.role !== requiresRole) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
