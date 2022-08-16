//=====================================
//            All Componenets
//=====================================
// ------ Dashboard -------
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";

// ------ Auth Pages ------- 
import Pageslogin from './pages/Auth/Login';
import ForgetPassword from './pages/Auth/ForgetPassword';
import CambiarPassword from './pages/Auth/CambiarPassword';
import Logout from './pages/Auth/Logout';
import Empleados from './pages/Empleados';

const routes = [
    //=====================================
    //            Public Routes
    //=====================================
    { path: '/logout', component: Logout, ispublic: true },
    { path: '/login', component: Pageslogin, ispublic: true },
    { path: '/recuperar-cuenta', component: ForgetPassword, ispublic: true },
    { path: '/cambiar-password/:token', component: CambiarPassword, ispublic: true },
    { path: '/status-pedido/:pedidoId', component: EstadoPedido, ispublic: true },
    { path: '/impresion-factura/:facturaId', component: FacturaPublica, ispublic: true },
    { path: '/dashboard', component: Dashboard },
    { path: '/nuevo-pedido', component: Dashboard },
    { path: '/pedidos', component: Pedidos },
    { path: '/facturas', component: Facturas },
    { path: '/cocina', component: Cocina },
    { path: '/mensajeria', component: Mensajeria },
    { path: '/productos', component: Productos },
    { path: '/usuarios', component: Usuarios },
    { path: '/empleados', component: Empleados },
    { path: '/roles', component: Roles },
    { path: '/clientes', component: Clientes },
    { path: '/', component: Pageslogin, ispublic: true, exact: true},
];

export default routes;
