import { createBrowserRouter } from "react-router-dom";
import Login from "../page/login/page";
import DaftarLomba from "../page/daftarlomba/page";
import AdminDashboard from "@/page/admindashboard/page";
import Register from "@/page/register/page";
import AdminOnly from "@/page/adminonly/page";
import Idlomba from "@/page/daftarlomba/idlomba/page";
import Pesertadashboard from "@/page/pesertadashboard/page";
<<<<<<< HEAD
import Dashboardjuri from "@/component/dashboardjuri/Dashboardjuri";
=======
import Submitform from "@/page/pesertadashboard/submitform/Page";
>>>>>>> 8de47f86e50f6a691af8b33ea851b78e460e0c73
const router = createBrowserRouter([
    {
        path: '/admindashboard',
        element: <AdminDashboard/>
    },
    {
        path: '/adminonly',
        element: <AdminOnly/>
    },
    {
        path: '/pesertadashboard',
        element: <Pesertadashboard/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/daftarlomba',
        element: <DaftarLomba/>
    },
    {
        path : "/daftarlomba/:idlomba",
        element: <Idlomba/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
<<<<<<< HEAD
        path : '/juridashboard',
        element: <Dashboardjuri/>
=======
        path : "/submit/:idpeserta",
        element: <Submitform/>
>>>>>>> 8de47f86e50f6a691af8b33ea851b78e460e0c73
    }
    
])

export default router