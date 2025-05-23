// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { icons, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const SertifikatSection: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const { idLomba } = useParams();

  const validateUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setStatus({
        type: "error",
        message: "URL tidak boleh kosong.",
      });
      return;
    }

    if (!validateUrl(url)) {
      setStatus({
        type: "error",
        message:
          "URL tidak valid. Pastikan URL dimulai dengan http:// atau https://",
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch(
        `http://localhost:3000/sertifikat/${idLomba}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengupload sertifikat");
      }

      Swal.fire({
        title: "Sukses",
        text: "Sertifikat berhasil ditambahkan",
        icon: "success",
      });

      setStatus({
        type: "success",
        message: data.message || "Sertifikat berhasil diupload",
      });
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[93vw] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pengiriman Sertifikat
          </h1>
          <p className="text-gray-600">
            Masukkan URL sertifikat Anda untuk memulai proses pengiriman
          </p>
        </div>

        <Card className="p-8 shadow-lg bg-white">
          <div className="mb-6">
            <img
              src="https://readdy.ai/api/search-image?query=A%20professional%20certificate%20with%20elegant%20design%2C%20gold%20seal%2C%20and%20official%20stamp%20on%20a%20clean%20white%20background.%20The%20certificate%20has%20decorative%20borders%20and%20appears%20formal%20and%20prestigious.%20High%20quality%2C%20professional%20photography&width=800&height=400&seq=1&orientation=landscape"
              alt="Contoh Sertifikat"
              className="w-full h-48 object-cover object-top rounded-lg mb-6"
            />
            <p className="text-gray-700 mb-4">
              Sistem kami akan memproses sertifikat Anda dan mengirimkannya ke
              penerima yang terdaftar. Pastikan URL yang Anda masukkan valid dan
              dapat diakses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="certificate-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL Sertifikat
              </label>
              <div className="relative">
                <Input
                  id="certificate-url"
                  type="text"
                  placeholder="https://"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <icons.Link className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Contoh: https://example.com/certificates/your-certificate-id
              </p>
            </div>

            <Button
              type="submit"
              className="w-full !rounded-button whitespace-nowrap cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <icons.Send className="mr-2 h-4 w-4" />
                  Kirim Sertifikat
                </>
              )}
            </Button>
          </form>

          {status.type && (
            <Alert
              className={`mt-4 ${
                status.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <div className="flex items-center">
                {status.type === "success" ? (
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                ) : (
                  <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                )}
                <AlertTitle>
                  {status.type === "success" ? "Berhasil!" : "Gagal!"}
                </AlertTitle>
              </div>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </Card>
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Sistem Pengiriman Sertifikat. Hak Cipta Dilindungi.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-700 cursor-pointer">
              Syarat & Ketentuan
            </a>
            <a href="#" className="hover:text-gray-700 cursor-pointer">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-gray-700 cursor-pointer">
              Bantuan
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SertifikatSection;
