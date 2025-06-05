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
    fetch("https://hono-api-lomba-tif-production.up.railway.app/users", {
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
        setDataPeserta(
          data.data.filter((user: Peserta) => user.role === "USERS")
        );
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
        const response = await fetch(
          `https://hono-api-lomba-tif-production.up.railway.app/users/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

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
    <div className="p-6 absolute w-full top-10 lg:relative lg:top-0">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
      </div>
      <h2 className="text-xl font-semibold mb-6">Daftar Users</h2>

      <div className="overflow-x-auto w-full lg:w-[93vw]">
        <Table className="border table-auto min-w-full">
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
                    className="mr-2 P-2 bg-green-300"
                    size="sm"
                    onClick={() => handleEditClick(participant.id)} // Open the modal for this user
                  >
                    <Pencil />
                    EDIT
                  </Button>
                  <Button
                    variant="ghost"
                    className="mr-2 P-2 bg-red-300"
                    size="sm"
                    onClick={() => {
                      handleDeleteUser(participant.id);
                    }}
                  >
                    <Trash2 />
                    HAPUS
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
