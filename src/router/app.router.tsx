import { createBrowserRouter } from "react-router-dom";
import Login from "../page/login/page";
import DaftarLomba from "../page/daftarlomba/page";
import AdminDashboard from "@/page/admindashboard/page";
import Register from "@/page/register/page";
import AdminOnly from "@/page/adminonly/page";
import Idlomba from "@/page/daftarlomba/idlomba/page";
import Pesertadashboard from "@/page/pesertadashboard/page";
import Submitform from "@/page/pesertadashboard/submitform/Page";
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
        path : "/submit/:idpeserta",
        element: <Submitform/>
    }
    
])

export default router