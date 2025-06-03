import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  id: string;
  username: string;
  email: string;
  open: boolean;
  onClose: () => void;
}

interface LombaOption {
  id: string;
  nama: string;
}

const EditUsers: React.FC<Props> = ({
  id,
  username,
  email,
  open,
  onClose,
}) => {
  const [namaJuri, setNamaJuri] = useState(username);
  const [lombaId, setLombaId] = useState("");
  const [lombaOptions, setLombaOptions] = useState<LombaOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch daftar lomba saat komponen terbuka
  useEffect(() => {
    if (open) {
      fetchLombaOptions();
    }
  }, [open]);

  const fetchLombaOptions = async () => {
    try {
      const response = await fetch(
        "https://hono-api-lomba-tif-production.up.railway.app/daftarlomba",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memuat daftar lomba");
      }

      const data = await response.json();
      setLombaOptions(data.data);
    } catch (error) {
      console.error("Error fetching lomba options:", error);
      setAlert({
        type: "error",
        message: "Gagal memuat daftar lomba. Silakan coba lagi.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: null, message: "" });

    try {
      const response = await fetch(
        `https://hono-api-lomba-tif-production.up.railway.app/juri/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            namaJuri: namaJuri,
            id_lomba: lombaId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui data juri");
      }

      setAlert({
        type: "success",
        message: "Data juri berhasil diperbarui!",
      });

      // Panggil callback onSuccess setelah 2 detik
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay Background */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-10"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-20">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg relative">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            ❌
          </button>

          <h2 className="text-xl font-semibold mb-4">Ubah User menjadi Juri</h2>

          {/* User Info */}
          <div className="mb-4">
            <p className="font-medium">Email: {email}</p>
          </div>

          {/* Alert Message */}
          {alert.type && (
            <Alert
              variant={alert.type === "success" ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertTitle>
                {alert.type === "success" ? "Sukses" : "Error"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="namaJuri">Nama Juri</Label>
              <Input
                id="namaJuri"
                value={namaJuri}
                onChange={(e) => setNamaJuri(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="lomba">Lomba yang Dinilai</Label>
              <Select value={lombaId} onValueChange={setLombaId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Lomba" />
                </SelectTrigger>
                <SelectContent>
                  {lombaOptions.map((lomba) => (
                    <SelectItem key={lomba.id} value={lomba.id}>
                      {lomba.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading || !lombaId}>
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUsers;
