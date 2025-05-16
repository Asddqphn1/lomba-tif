import {
  Sidebar, // Ubah nama impor untuk menghindari konflik
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

import { PesertaSection } from "./PesrtaSection";
import UsersSection from "./UsersSection";


function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [openLomba, setOpenLomba] = useState(false);
  const [openPeserta, setOpenPeserta] = useState(false);
  const [openJuri, setOpenJuri] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

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
                  
                    <SidebarMenuItem key="">
                      <SidebarMenuButton className="hover:bg-[#2E4EC5]">
                          <icons.House className="text-white" />
                          <span className="text-white font-bold">
                            Dashboard
                          </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="daftar-lomba">
                      <SidebarMenuButton className="hover:bg-[#2E4EC5]">
                          <icons.Trophy className="text-white" />
                          <span className="text-white font-bold">
                            Daftar Lomba
                          </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem key="peserta">
                      <SidebarMenuButton className="hover:bg-[#2E4EC5]">
                          <icons.Users className="text-white" />
                          <span className="text-white font-bold">
                            Peserta
                          </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                     <SidebarMenuItem key="juri">
                      <SidebarMenuButton className="hover:bg-[#2E4EC5]">
                          <icons.Star className="text-white" />
                          <span className="text-white font-bold">
                            Juri
                          </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                     <SidebarMenuItem key="Users">
                      <SidebarMenuButton className="hover:bg-[#2E4EC5]" onClick={() => setOpenUsers(!openUsers)}>
                          <icons.User className="text-white" />
                          <span className="text-white font-bold">
                            Users
                          </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    
                
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
      <UsersSection openSidebar={openUsers}/>     
          
      <PesertaSection />
    </div>
  );
}

export default AdminSidebar;
