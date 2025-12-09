import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue';
import Hourly from '../views/hourly.vue';
import FiveDay from '../views/forecast5day.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/hourly', name: 'Hourly', component: Hourly },
  { path: '/5day', name: 'FiveDay', component: FiveDay }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
