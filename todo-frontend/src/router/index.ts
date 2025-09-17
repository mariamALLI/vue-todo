import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '../components/WelcomPage.vue';
import TodosList from '../pages/TodoList.vue';
import TodosDetails from '../pages/TodoDetails.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
import TestError from '../pages/TestError.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: WelcomePage },
    { path: '/todos', component: TodosList },
    { path: '/todos/:id', component: TodosDetails },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
    { path: '/test-error', component: TestError },
  ],
})

export default router
