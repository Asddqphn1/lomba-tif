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

export function PesertaSection() {
  interface peserta {
    nama_peserta: string;
    nama_lomba: string;
    id: number;
    created_at: string;
  }
  const [open, setOpen] = useState(false);
  const navigasi = useNavigate();
  const [dataPeserta, setDataPeserta] = useState<peserta[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/daftarpeserta", {
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
        setDataPeserta(data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Admin Lomba</h1>
        <Button variant="outline" onClick={() => setOpen(true)}>+ Tambah Lomba</Button>
      </div>
      <h2 className="text-xl font-semibold mb-6">Daftar Peserta</h2>

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
              <TableHead className="w-1/6">ID</TableHead>
              <TableHead className="w-1/3">PESERTA</TableHead>
              <TableHead className="w-1/4">KATEGORI LOMBA</TableHead>
              <TableHead className="w-1/6">TANGGAL PENDAFTARAN</TableHead>
              <TableHead className="w-1/6">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPeserta.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-bold">{participant.id}</TableCell>
                <TableCell>{participant.nama_peserta}</TableCell>
                <TableCell>{participant.nama_lomba}</TableCell>
                <TableCell>{FormatTanggal(participant.created_at)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ☑
                  </Button>
                  <Button variant="ghost" size="sm">
                    ☐
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
