import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FormatTanggal } from "@/helper/FormatTanggal";
import { useNavigate } from "react-router-dom";
import LombaSection from "./LombaSection";

const PesertaSection: React.FC = () => {
  interface peserta {
    id: string; // Pastikan ada id peserta
    nama: string;
    pesertalomba: [
      {
        lomba?: {
          jenis_lomba: string;
          nama: string;
        };
      }
    ];
    created_at: string;
    is_team?: boolean; // Tambahkan field ini jika ada
    team_members?: string[]; // Tambahkan jika data anggota tim tersedia
  }
  interface namaAnggota {
    nama: string;
  }

  const [open, setOpen] = useState(false);
  const [jenis, setJenis] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<namaAnggota[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const navigasi = useNavigate();
  const [dataPeserta, setDataPeserta] = useState<peserta[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/daftarpeserta?jenis=${jenis}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          navigasi("/login", { replace: true });
        }
        return response.json();
      })

      .then((data) => {

        setDataPeserta(data.data);

      })
      .catch((error) => console.error(error));
  }, [jenis]);

  const handleViewTeam = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/daftarpeserta/anggotatim/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Perhatikan konsistensi penamaan (anggotatim vs anggotaTim)
      const anggotaTim = data.data?.anggotatim || data.data?.anggotaTim;

      if (!anggotaTim) {
        throw new Error("Data anggota tim tidak ditemukan dalam response");
      }

      if (!Array.isArray(anggotaTim)) {
        throw new Error("Data anggota tim bukan array");
      }

      setSelectedTeam(anggotaTim);
      setShowMembers(true);

      console.log("Data anggota tim:", anggotaTim); // Untuk debugging
    } catch (error) {
      console.error("Error dalam handleViewTeam:", error);
      // Anda bisa menambahkan notifikasi ke user di sini
      // contoh: setErrorState(error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Admin Lomba</h1>
        <Button variant="outline" onClick={() => setOpen(true)}>
          + Tambah Lomba
        </Button>
      </div>
      <h2 className="text-xl font-semibold mb-6">Daftar Peserta</h2>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <Button variant="outline" onClick={() => setJenis("")}>
            Semua Kategori
          </Button>
          <Button variant="outline" onClick={() => setJenis("TIM")}>
            TIM
          </Button>
          <Button variant="outline" onClick={() => setJenis("INDIVIDU")}>
            INDIVIDU
          </Button>
        </div>
      </div>

      <div className="w-[92vw]">
        <Table className="border table-fixed overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">NO</TableHead>
              <TableHead className="w-1/4">PESERTA</TableHead>
              <TableHead className="w-1/5">KATEGORI LOMBA</TableHead>
              <TableHead className="w-1/5">NAMA LOMBA</TableHead>
              <TableHead className="w-1/6">TANGGAL PENDAFTARAN</TableHead>
              <TableHead className="w-1/6">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPeserta.map((participant, index) => (
              <TableRow key={participant.id || index}>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{participant.nama}</TableCell>
                <TableCell>
                  {participant.pesertalomba[0].lomba?.jenis_lomba}
                </TableCell>
                <TableCell>{participant.pesertalomba[0].lomba?.nama}</TableCell>
                <TableCell>{FormatTanggal(participant.created_at)}</TableCell>
                <TableCell>
                  {participant.pesertalomba[0].lomba?.jenis_lomba === "TIM" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTeam(participant.id)}
                    >
                      Lihat Anggota
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal untuk menampilkan anggota tim */}
        {showMembers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Anggota Tim</h3>
                <button
                  onClick={() => setShowMembers(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedTeam && selectedTeam.length > 0 ? (
                  selectedTeam.map((member, index) => (
                    <div key={index} className="p-2 border-b flex items-center">
                      <span className="w-6 text-gray-500">{index + 1}.</span>
                      <span>{member.nama}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 py-4 text-center">
                    Tidak ada anggota tim
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowMembers(false)} variant="outline">
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        )}
        <LombaSection open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default PesertaSection;
