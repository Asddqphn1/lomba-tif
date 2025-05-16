import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { icons } from "lucide-react";
import { useState } from "react";

import UsersSection from "./UsersSection";

import DaftarLombaAdmin from "./DaftarLombaAdmin";

import PesertaSection from "./PesrtaSection";
import DaftarJuriaAdmin from "./DaftarJuriaAdmin";
import { DashboardSection } from "./DasboardSection";

function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [openSide, setOpenSide] = useState<string>("dashboard");

  const renderContent = () => {
    switch (openSide) {
      case "peserta":
        return <PesertaSection />;
      case "users":
        return <UsersSection />;
      case "daftar-lomba":
        return <DaftarLombaAdmin />;
      case "juri":
        return <DaftarJuriaAdmin />;
      case "dashboard":
        return <DashboardSection/>
      default :
        return <DashboardSection/>
    }
  };

  return (
    <div className="flex">
      <SidebarProvider
        defaultOpen={open}
        open={open}
        onOpenChange={() => setOpen(!open)}
      >
        <Sidebar>
          <SidebarContent className="bg-[#1E40AF]">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white font-extrabold text-xl">
                Admin Lomba{" "}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="mt-8">
                  <SidebarMenuItem key="dashboard">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("dashboard")}
                    >
                      <icons.House className="text-white" />
                      <span className="text-white font-bold">Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="daftar-lomba">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("daftar-lomba")}
                    >
                      <icons.Trophy className="text-white" />
                      <span className="text-white font-bold">Daftar Lomba</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="peserta">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("peserta")}
                    >
                      <icons.Users className="text-white" />
                      <span className="text-white font-bold">Peserta</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="juri">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("juri")}
                    >
                      <icons.Star className="text-white" />
                      <span className="text-white font-bold">Juri</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="users">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("users")}
                    >
                      <icons.User className="text-white" />
                      <span className="text-white font-bold">Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
     

      {/* Bagian konten utama */}
      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  );
}

export default AdminSidebar;
