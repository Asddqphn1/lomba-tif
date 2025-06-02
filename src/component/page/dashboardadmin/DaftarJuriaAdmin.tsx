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
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import EditJuriModal from "./EditJuriModal";

const DaftarJuriaAdmin: React.FC = () => {
  interface Juri {
    id: string;
    nama: string;
    lomba: {
      id: string;
      nama: string;
      tanggal: string;
    };
    users: {
      email: string;
    };
    created_at: string;
  }

  interface Lomba {
    id: string;
    nama: string;
  }

  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedJuri, setSelectedJuri] = useState<Juri | null>(null);
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const navigasi = useNavigate();
  const [dataJuri, setDataJuri] = useState<Juri[]>([]);

  
  // Fungsi untuk handle update juri
  const handleUpdateJuri = async (
    id: string,
    updateData: { nama: string; lomba_id: string }
  ) => {
    try {
      const response = await fetch(`http://localhost:3000/juri/juri/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        navigasi("/login", { replace: true });
        return false;
      }

      const data = await response.json();

      if (data.success) {
        // Update data juri di state
        setDataJuri((prevData) =>
          prevData.map((juri) =>
            juri.id === id
              ? {
                  ...juri,
                  nama: updateData.nama,
                  lomba: { ...juri.lomba, id: updateData.lomba_id },
                }
              : juri
          )
        );

        Swal.fire("Berhasil!", "Data juri berhasil diperbarui.", "success");
        return true;
      } else {
        Swal.fire(
          "Gagal!",
          data.message || "Gagal memperbarui data juri.",
          "error"
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating juri:", error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat memperbarui data juri.",
        "error"
      );
      return false;
    }
  };

  // Fungsi untuk membuka modal edit
  const openEditModal = (juri: Juri) => {
    setSelectedJuri(juri);
    setEditModalOpen(true);
  };

  // Load data juri dan lomba saat komponen mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [juriResponse, lombaResponse] = await Promise.all([
          fetch("http://localhost:3000/juri", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
          fetch("http://localhost:3000/daftarlomba", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
        ]);

        if (juriResponse.status === 401 || lombaResponse.status === 401) {
          navigasi("/login", { replace: true });
          return;
        }

        const juriData = await juriResponse.json();
        const lombaData = await lombaResponse.json();

        setDataJuri(juriData.data);
        setLombaList(lombaData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleDelete = (id: string, nama: string) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Anda akan menghapus juri ${nama}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/juri/hapus/${id}`, {
          method: "PATCH",
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
            console.log(data);
            if (data.status === "success") {
              // Update the state to remove the deleted juri
              setDataJuri(dataJuri.filter((juri) => juri.id !== id));
              Swal.fire("Dihapus!", `Juri ${nama} telah dihapus.`, "success");
            } else {
              Swal.fire(
                "Gagal!",
                "Terjadi kesalahan saat menghapus juri.",
                "error"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Gagal!",
              "Terjadi kesalahan saat menghapus juri.",
              "error"
            );
          });
      }
    });
  };

  useEffect(() => {
    fetch("http://localhost:3000/juri", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          // Jika token kedaluwarsa, arahkan pengguna ke login
          navigasi("/login", { replace: true }); // Ganti dengan URL login Anda
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        setDataJuri(data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Admin Lomba</h1>
      </div>
      <h2 className="text-xl font-semibold mb-6">Daftar Juri</h2>

      <div className="mb-6"></div>

      <div className="w-[92vw]">
        <Table className="border table-fixed overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">JURI</TableHead>
              <TableHead className="w-1/3">EMAIL</TableHead>
              <TableHead className="w-1/4">CABANG LOMBA</TableHead>
              <TableHead className="w-1/6">TANGGAL LOMBA</TableHead>
              <TableHead className="w-1/6">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataJuri.map((juri) => (
              <TableRow key={juri.id}>
                <TableCell className="font-bold">{juri.nama}</TableCell>
                <TableCell className="font-bold">{juri.users?.email}</TableCell>
                <TableCell className="font-bold">{juri.lomba?.nama}</TableCell>
                <TableCell className="font-bold">
                  {FormatTanggal(juri.lomba?.tanggal)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(juri)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(juri.id, juri.nama)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedJuri && (
          <EditJuriModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            juri={{
              id: selectedJuri.id,
              nama: selectedJuri.nama,
              lomba_id: selectedJuri.lomba.id,
            }}
            lombaOptions={lombaList}
            onSave={handleUpdateJuri}
          />
        )}
        <LombaSection open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default DaftarJuriaAdmin;
