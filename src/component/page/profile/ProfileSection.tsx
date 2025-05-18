// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { icons } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface dataUser {
    id : string,
    nama : string,
    email : string,
    role : "ADMIN" | "USERS" | "PESERTA" | "JURI"
}

const ProfileSection: React.FC = () => {

  const [data, setData] = useState<dataUser>()
  const navigate = useNavigate() 
  useEffect(() => {
      fetch("http://localhost:3000/auth/me", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data.user); // Set the role after fetching user data
          console.log(data.user);
        });
    }, []);
  

    const handleLogout = () => {
      fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Logout failed");
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 w-[93vw]">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profil Pengguna
        </h1>

        <Card className="w-full shadow-md">
          <CardHeader className="flex flex-col items-center pb-2">
            
            <icons.UsersRound/>
            <CardTitle className="text-xl font-bold text-center">
              {data?.nama}
            </CardTitle>

            <Badge className="mt-2 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 cursor-default whitespace-nowrap">
              {data?.role}
            </Badge>
          </CardHeader>

          <Separator className="my-2" />

          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 flex-shrink-0 text-gray-500">
                  <i className="fas fa-envelope text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{data?.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 flex-shrink-0 text-gray-500">
                  <i className="fas fa-shield-alt text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status Akun</p>
                  <p className="font-medium">Aktif</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 flex-shrink-0 text-gray-500">
                  <i className="fas fa-calendar-alt text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Terakhir Login</p>
                  <p className="font-medium">18 Mei 2025, 09:45 WIB</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              variant="destructive"
              className="w-full !rounded-button whitespace-nowrap cursor-pointer"
              onClick={handleLogout}
            >
              <icons.ArrowLeftFromLine/>
              Keluar
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Sistem Manajemen Pengguna. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
