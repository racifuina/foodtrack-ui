//=====================================
//            All Componenets
//=====================================
// ------ Dashboard -------
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";

// ------ Auth Pages -------
import Pageslogin from "./pages/Auth/Login";
import Empleados from "./pages/Empleados";

const routes = [
  //=====================================
  //            Public Routes
  //=====================================
  { path: "/login", component: Pageslogin, ispublic: true },
  { path: "/dashboard", component: Dashboard },
  { path: "/productos", component: Productos },
  { path: "/usuarios", component: Usuarios },
  { path: "/empleados", component: Empleados },
  { path: "/", component: Pageslogin, ispublic: true, exact: true },
];

export default routes;
