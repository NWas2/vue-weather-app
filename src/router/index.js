import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Hourly from '../views/Hourly.vue';
import Forecast5Day from '../views/Forecast5Day.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/hourly', name: 'Hourly', component: Hourly },
  { path: '/5day', name: 'Forecast5Day', component: Forecast5Day },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
