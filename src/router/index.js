// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CarList from '@/components/CarList.vue';
import car from '@/components/car.vue';
import rc from '@/components/rc.vue';
import movies from '@/components/movies.vue';
import MovieClips from '@/components/MovieClips.vue';

const routes = [
  { path: '/', component: CarList },
  { path: '/car', component: car },
  { path: '/rc', component: rc },
  { path: '/movies', component: movies },
  { path: '/MovieClips', component: MovieClips },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;