import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LombaSection from "./LombaSection";
import { icons } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Competition {
  id: string;
  nama: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  url: string;
  bataswaktu: string;
  jenis_lomba: "INDIVIDU" | "TIM";
  jumlah_tim: number
}

const DaftarLombaAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("http://localhost:3000/daftarlomba", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch competitions");
        }

        const data = await response.json();
        setCompetitions(data.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Gagal menyimpan data lomba"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleDelete = (id: string) => {
    setCompetitionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!competitionToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/daftarlomba/${competitionToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setCompetitions(
          competitions.filter((comp) => comp.id !== competitionToDelete)
        );
        setAlert({
          type: "success",
          message: "Lomba berhasil dihapus!",
        });
      } else {
        throw new Error("Gagal menghapus lomba");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : "Gagal menghapus lomba",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCompetitionToDelete(null);
    }
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCompetitions = competitions.filter(
    (comp) =>
      comp.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.jenis_lomba.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log("Edit competition with id:", id);
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat daftar lomba...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-500 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className=" w-[93vw] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Lomba</h1>

          <div className="flex w-full md:w-auto gap-4 items-center">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Cari..."
                className="pl-10 pr-4 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
            >
              + Tambah Lomba
            </Button>
          </div>
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredCompetitions.map((competition) => (
            <Card
              key={competition.id}
              className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="">
                {/* Image */}
                <div className="w-full h-48 overflow-hidden bg-gray-200">
                  {competition.url && (
                    <img
                      src={competition.url}
                      alt={competition.nama}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="w-full p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {competition.nama}
                    </h3>
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      {new Date(competition.bataswaktu) > new Date()
                        ? "Aktif"
                        : "Selesai"}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-600">
                      {expandedDescriptions[competition.id]
                        ? competition.deskripsi
                        : `${competition.deskripsi.substring(0, 80)}...`}
                    </p>
                    {competition.deskripsi.length > 80 && (
                      <button
                        onClick={() => toggleDescription(competition.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                      >
                        {expandedDescriptions[competition.id]
                          ? "Lihat lebih sedikit"
                          : "Lihat selengkapnya"}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <icons.CalendarDays className="h-6 w-6" />
                      <span>
                        {new Date(competition.tanggal).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <icons.Hash />
                      <span>{competition.id}</span>
                    </div>
                    <div className="flex items-center">
                      <icons.MapPinned />
                      <span>{competition.lokasi}</span>
                    </div>
                    <div className="flex items-center">
                      {competition.jenis_lomba === "TIM" ? (
                        <icons.Users />
                      ) : (
                        <icons.User />
                      )}

                      <span>
                        {competition.jenis_lomba}{" "}
                        {competition.jenis_lomba === "TIM" ? (
                         "Anggota Tim: " + competition.jumlah_tim
                        ) : (
                          " "
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-600">
                        Berakhir pada{" "}
                        {new Date(competition.bataswaktu).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <CardFooter className="flex justify-between gap-2 p-0">
                    <Button
                      onClick={() => handleEdit(competition.id)}
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(competition.id)}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompetitions.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 text-5xl mb-4">
              <i className="far fa-folder-open"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Tidak Ada Lomba Ditemukan
            </h3>
            <p className="text-gray-500 max-w-md">
              Lomba yang Anda cari tidak ditemukan. Silakan coba dengan kata
              kunci lain atau tambahkan lomba baru.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus lomba secara permanen dan tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LombaSection open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default DaftarLombaAdmin;
