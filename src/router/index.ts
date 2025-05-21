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

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/products', component: Products },
  { path: '/services', component: Services },
  { path: '/events', component: Events },
  {path: '/eventos/:id',
    name: 'EventDetail',
    component: () => import('@/views/EventDetail.vue')},
  { path: '/cart', component: Cart },
  { path: '/admin', component: Admin },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  {
    path: '/reserva',
    name: 'Reserva',
    component: Reserva,
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


router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0); 
  next();
});

export default router;
