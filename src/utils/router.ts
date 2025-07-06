import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/default.vue";
import NotFound from "../views/notFound.vue";
import LoginLayout from "../layouts/login.vue";
import AdminLayout from "../layouts/admin.vue";

const Home = () => import("../views/home..vue");
const DataManagement = () => import("../views/dataManagement.vue");
const Dashboard = () => import("../views/dashboard.vue");
const Login = () => import("../views/login.vue");

const routes = [
  {
    path: "/",
    redirect: () => {
      const user = getUser();
      if (!user) return "/login";
      return user.role === "admin" ? "/dashboard" : "/form-report";
    },
  },
  {
    path: "/login",
    component: LoginLayout,
    children: [{ path: "", component: Login }],
  },
  {
    path: "/form-report",
    component: MainLayout,
    meta: { requiresAuth: true, role: "user" },
    children: [{ path: "/form-report", component: Home }],
  },
  {
    path: "/dashboard",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "/dashboard", component: Dashboard },
      { path: "/data-management", component: DataManagement }
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

router.beforeEach((to, _, next) => {
  const user = getUser();

  if (to.meta.requiresAuth) {
    if (!user) {
      return next("/login");
    }

    if (to.meta.role && to.meta.role !== user.role) {
      return next("/login");
    }
  }

  next();
});

export default router;
