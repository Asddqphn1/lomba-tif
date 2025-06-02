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



const DaftarJuriaAdmin : React.FC = () => {
  interface peserta {
    nama: string;
    lomba: {
        nama: string;
        tanggal: string;
    }
    users: {
        email: string;
    }
    nama_lomba: string;
    id: string;
    created_at: string;
  }
  const [open, setOpen] = useState(false);
  const navigasi = useNavigate();
  const [dataJuri, setDataJuri] = useState<peserta[]>([]);
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

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <Button variant="outline">Semua Kategori</Button>
          <Button variant="outline">Semua Status</Button>
        </div>
      </div>

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
                <TableCell className="font-bold">{FormatTanggal(juri.lomba?.tanggal)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}} // Open the modal for this user
                  >
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(juri.id, juri.nama)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <LombaSection open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}

export default DaftarJuriaAdmin;
