import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "lucide-react";

const DaftarLombaSection: React.FC = () => {
  interface Competition {
    id: string;
    nama: string;
    deskripsi: string;
    tanggal: string;
    lokasi: string;
    url: string;
    bataswaktu: string;
    jenis_lomba: "INDIVIDU" | "TIM";
  }

  const [dataLomba, setDataLomba] = useState<Competition[]>([]);
  const [sudah_login, setSudah_login] = useState<boolean>(false);
  const navigate = useNavigate();

  const formatTanggalIndonesia = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    fetch("http://localhost:3000/daftarlomba", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDataLomba(data.data);
        setSudah_login(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        navigate("/login");
      });
  }, [navigate]);

  if (!sudah_login) {
    return null; // or a loading spinner while redirect happens
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Daftar Lomba
          </h1>
          <p className="text-xl text-gray-600">
            Temukan dan ikuti berbagai lomba menarik
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dataLomba.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <div className="p-6">
                {item.url && (
                  <img
                    src={item.url}
                    alt={item.nama}
                    className="h-56 w-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.nama}
                </h2>

                <div className="flex items-center text-gray-700 mb-2">
                  <icons.CalendarDays />
                  <span>
                    {formatTanggalIndonesia(item.tanggal)} -{" "}
                    {formatTanggalIndonesia(item.bataswaktu)}
                  </span>
                </div>

                <div className="flex items-center text-gray-700 mb-4">
                  <icons.MapPin />
                  <span>{item.lokasi}</span>
                </div>

                <div className="mt-4">
                  <span className="flex">
                    Kategori : {"  "}
                    {item.jenis_lomba === "TIM" ? (
                      <icons.Users />
                    ) : (
                      <icons.User />
                    )}
                    {item.jenis_lomba}
                  </span>
                  <div className="text-gray-800 line-clamp-3 hover:line-clamp-none transition-all">
                    {item.deskripsi}
                  </div>
                </div>

                <div className="mt-6">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center !rounded-button whitespace-nowrap cursor-pointer">
                    <icons.Plus />
                    Daftar Lomba
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DaftarLombaSection;
