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
  // Rutas públicas (sin autenticación requerida)
  { 
    path: '/', 
    component: Home,
    meta: { title: 'Inicio - Grow Studio' }
  },
  { 
    path: '/about', 
    component: About,
    meta: { title: 'Acerca de - Grow Studio' }
  },
  { 
    path: '/contact', 
    component: Contact,
    meta: { title: 'Contacto - Grow Studio' }
  },
  { 
    path: '/products', 
    component: Products,
    meta: { title: 'Productos - Grow Studio' }
  },
  { 
    path: '/services', 
    component: Services,
    meta: { title: 'Servicios - Grow Studio' }
  },
  { 
    path: '/events', 
    component: Events,
    meta: { title: 'Eventos - Grow Studio' }
  },
  {
    path: '/eventos/:id',
    name: 'EventDetail',
    component: () => import('../views/EventDetail.vue'),
    meta: { title: 'Detalle del Evento - Grow Studio' }
  },
  { 
    path: '/login', 
    component: Login,
    meta: { title: 'Iniciar Sesión - Grow Studio' }
  },
  { 
    path: '/signup', 
    component: Signup,
    meta: { title: 'Registrarse - Grow Studio' }
  },

  // Rutas que requieren autenticación
  { 
    path: '/cart', 
    component: Cart,
    meta: { 
      requiresAuth: true,
      title: 'Carrito - Grow Studio'
    }
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { 
      requiresAuth: true,
      title: 'Perfil - Grow Studio'
    }
  },
  {
    path: '/reserva',
    name: 'Reserva',
    component: Reserva,
    meta: { 
      requiresAuth: true,
      title: 'Reservar Servicio - Grow Studio'
    }
  },
  {
    path: '/payment/:orderPk',
    name: 'Payment',
    component: Payment,
    props: true,
    meta: { 
      requiresAuth: true,
      title: 'Pago - Grow Studio'
    }
  },

  // Rutas administrativas
  {
    path: '/admin',
    component: Admin,
    meta: { 
      requiresAuth: true, 
      requiresRole: 'A',
      title: 'Panel Admin - Grow Studio'
    }
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
  }
});

// Guardias de navegación
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // Inicializar el store si no está inicializado
  if (!userStore.isAuthenticated && !userStore.user) {
    userStore.initialize();
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiresRole = to.meta.requiresRole;

  // Verificar autenticación
  if (requiresAuth && !userStore.isAuthenticated) {
    console.log('Redirigiendo a login - usuario no autenticado');
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } // Guardar la ruta de destino
    });
    return;
  }

  // Verificar rol
  if (requiresRole && userStore.user?.role !== requiresRole) {
    console.log('Acceso denegado - rol insuficiente');
    next({ path: '/' });
    return;
  }

  // Actualizar título de la página
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  next();
});

export default router;