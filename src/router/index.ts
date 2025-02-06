import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/AboutView.vue';
import { compile } from 'vue';
import Home from '../views/HomeView.vue';
import Contact from '../views/ContactView.vue';
import Haircuts from '../views/HaircutsView.vue';
import Products from '../views/ProductsView.vue';
import Events from '../views/EventsView.vue';
import Cart from '../views/CartView.vue';
import Courses from '../views/CoursesView.vue';

const routes = [
  {path: '/', component: Home},
  {path: '/about', component: About},
  {path: '/contact',component: Contact},
  {path: '/products',component: Products},
  {path: '/haircuts',component: Haircuts},
  {path: '/events',component: Events},
  {path: '/courses',component: Courses},
  {path: '/cart',component: Cart}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
