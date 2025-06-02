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
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react"; // Correct import for icons
import EditUsers from "./EditUsers";
import Swal from "sweetalert2";

const UsersSection: React.FC = () => {
  interface Peserta {
    id: string;
    nama: string;
    email: string;
    role: string;
  }

  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean | string>(false); // State to control modal open for specific user
  const [dataPeserta, setDataPeserta] = useState<Peserta[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          // If token is expired, redirect to login
          navigate("/login", { replace: true });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        setDataPeserta(data.data.filter((user: Peserta) => user.role === "USERS"));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEditClick = (id: string) => {
    setOpen(id); // Open the modal for the clicked user
  };

  const handleCloseModal = () => {
    setOpen(false); // Close the modal
  };

  const handleDeleteUser = async (id: string) => {
    // Tampilkan konfirmasi sebelum menghapus
    const confirmation = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "User yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    // Jika user menekan "Ya, hapus!"
    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          // Update state: Hapus user dari dataPeserta
          setDataPeserta((prevData) =>
            prevData.filter((user) => user.id !== id)
          );

          // Tampilkan notifikasi sukses
          Swal.fire({
            title: "Terhapus!",
            text: "User berhasil dihapus.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          throw new Error("Gagal menghapus user");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Gagal menghapus user",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
      </div>
      <h2 className="text-xl font-semibold mb-6">Daftar Users</h2>

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
              <TableHead className="w-1/6">USER</TableHead>
              <TableHead className="w-1/3">EMAIL</TableHead>
              <TableHead className="w-1/4">ROLE</TableHead>
              <TableHead className="w-1/6">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPeserta.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-bold">{participant.nama}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>{participant.role}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(participant.id)} // Open the modal for this user
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleDeleteUser(participant.id);
                    }}
                  >
                    <Trash2 />
                  </Button>

                  {/* Show Edit modal for this participant */}
                  {open === participant.id && (
                    <EditUsers
                      id={participant.id}
                      username={participant.nama}
                      email={participant.email}
                      open={true}
                      onClose={handleCloseModal}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersSection;
