import { createWebHistory, createRouter } from "vue-router";
import Main from "../pages/customer/main/main.vue";
import IndicationCoslList from '../pages/customer/consult/IndicationCoslList.vue'
import DemoChat from '../pages/customer/consult/DemoChat.vue'
import IndicationCoslChat from '../pages/customer/consult/IndicationCoslChat.vue'
// import JqxGridData from "../components/JqxGridData.vue";
// 이 이부분만 추가해주면 끝!
const routes = [
//   {
//     path: "/list",
//     component: List,
//   },
  {
    path: "/",
    component: Main,
  },
  {
    path: "/const",
    component: IndicationCoslList,
  },
  {
    path: "/chat",
    component: DemoChat,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;