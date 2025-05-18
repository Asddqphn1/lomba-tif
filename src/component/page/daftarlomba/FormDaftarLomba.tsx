import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
interface DaftarLomba {
  id: string;
  nama: string;
  jenis_lomba: string;
  jumlah_tim: number | null;
}

interface FormData {
  nama_peserta: string;
  nama_tim?: string; // Tambahkan field nama tim
  anggota_tim?: string[];
}
  

const FormDaftarLomba: React.FC = () => {
  const [lomba, setLomba] = useState<DaftarLomba | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nama_peserta: "",
    nama_tim: "", // Inisialisasi nama tim
    anggota_tim: [],
  });
  const { idlomba } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [isTim, setIsTim] = useState(false);
  const navigate = useNavigate();

  // Fetch the user ID from the JWT token in cookies
  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUserId(data.user.id));
  }, [navigate]);

  // Fetch lomba details based on `idlomba`
  useEffect(() => {
    if (idlomba) {
      fetch(`http://localhost:3000/daftarlomba/${idlomba}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setLomba(data.data);
          if (data.data?.jenis_lomba === "TIM") {
            setIsTim(true); // If the competition is TIM, set isTim to true
          }
        })
        .catch((err) => {
          console.error("Error fetching lomba data:", err);
          Swal.fire({
            title: "Error",
            text: "Failed to fetch lomba data",
            icon: "error",
          });
          navigate("/login"); // Navigate to login on failure
        });
    }
  }, [idlomba, navigate]); // Added `idlomba` to the dependency array to refetch on idlomba change

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "nama_peserta") {
      setFormData({ ...formData, nama_peserta: value });
    } else if (name === "nama_tim") {
      // Tambahkan penanganan nama tim
      setFormData({ ...formData, nama_tim: value });
    } else if (name === "anggota_tim" && index !== undefined) {
      const updatedAnggota = [...(formData.anggota_tim || [])];
      updatedAnggota[index] = value;
      setFormData({ ...formData, anggota_tim: updatedAnggota });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire({
        title: "Error",
        text: "User is not logged in!",
        icon: "error",
      });
      return;
    }

    try {
      const payload = {
        nama: isTim ? formData.nama_tim : formData.nama_peserta,
        nama_anggota: isTim ? formData.anggota_tim : undefined,
      };
      const response = await fetch(
        `http://localhost:3000/daftarpeserta/${userId}/${idlomba}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mendaftar");
      }

      const data = await response.json();
      Swal.fire({
        title: "Sukses",
        text:
          data.message || "Pendaftaran Berhasil, Selamat Berkompetisi🔥🔥🔥",
        icon: "success",
      });
    } catch (err) {
      console.error("Error during registration:", err);
      Swal.fire({
        title: "Error",
        text: err instanceof Error ? err.message : "Unknown error",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Pendaftaran Lomba</h2>

      {lomba && (
        <>
          <div className="mb-4">
            <h3 className="font-semibold">Nama Lomba: {lomba.nama}</h3>
            <p>Jenis Lomba: {lomba.jenis_lomba}</p>
            <p>Batas Tim: {lomba.jumlah_tim ? lomba.jumlah_tim : "Individu"}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {lomba.jenis_lomba === "TIM" ? (
              <div>
                {/* Tambahkan input nama tim */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Nama Tim
                  </label>
                  <input
                    type="text"
                    name="nama_tim"
                    value={formData.nama_tim || ""}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama tim"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <label className="block text-sm font-medium mb-2">
                  Nama Anggota Tim
                </label>
                {[...Array(lomba.jumlah_tim || 0)].map((_, index) => (
                  <div key={index} className="mb-3">
                    <input
                      type="text"
                      name="anggota_tim"
                      value={formData.anggota_tim?.[index] || ""}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder={`Anggota Tim ${index + 1}`}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Nama Peserta
                </label>
                <input
                  type="text"
                  name="nama_peserta"
                  value={formData.nama_peserta}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama peserta"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md"
            >
              Daftar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default FormDaftarLomba;
