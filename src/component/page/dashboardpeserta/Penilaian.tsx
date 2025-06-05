import { FormatTanggal } from "@/helper/FormatTanggal";
import { Trophy, User, Users} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PenilaianProps {
  id: string;
  nama: string;
  pesertalomba: Array<{
    lomba: {
      id: string;
      nama: string;
      jenis_lomba: string;
      tanggal: string;
    };
    submission: {
      id: string;
      penilaian: Array<{
        nilai_penilaian: number;
        deskripsi_penilaian: string;
        created_at: string;
        juri: {
          id: string;
          users: {
            id: string;
            nama: string;
          };
        };
      }>;
    } | null;
  }>;
}

function Penilaian() {
  const { idUser } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataPenilaian, setDataPenilaian] = useState<PenilaianProps[]>([]);
  
  const navigate = useNavigate();

  const handleLihatKlasmen = (idLomba: string) => {
    navigate(`/klasmen/${idLomba}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://hono-api-lomba-tif-production.up.railway.app/penilaian/peserta/${idUser}/penilaian`,
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
        setDataPenilaian(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (idUser) {
      fetchData();
    }
  }, [idUser]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="w-[92vw] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Penilaian Peserta Lomba</h1>
      <p className="text-gray-600 mb-8">
        Lihat hasil penilaian dari koreksi koreksi yang telah dilakukan.
        Bandingkan dan analisis dengan peserta lainnya.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {dataPenilaian.map((item) =>
          item.pesertalomba.map((lomba, index) => (
            <div
              key={`${item.id}-${index}`}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 flex gap-2">
                <span>
                  <Trophy size={20} />
                </span>
                {lomba.lomba.nama}
              </h2>
              <p className="text-gray-500 mb-1 flex gap-2">
                <span>
                  {lomba.lomba.jenis_lomba === "INDIVIDU" ? (
                    <User size={20} />
                  ) : (
                    lomba.lomba.jenis_lomba === "TIM" && <Users size={20} />
                  )}
                </span>
                {lomba.lomba.jenis_lomba}
              </p>

              <div className="my-4">
                <p
                  className={`text-2xl font-bold ${
                    lomba.submission?.penilaian?.[0]?.nilai_penilaian
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status:{" "}
                  {lomba.submission?.penilaian?.[0]
                    ? "SUDAH DINILAI"
                    : "BELUM DINILAI"}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/penilaian/${lomba.submission?.id}`)}
                  disabled={!lomba.submission?.penilaian?.[0]}
                  className={`flex-1 px-4 py-2 ${
                    !lomba.submission?.penilaian?.[0]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  }`}
                >
                  Lihat Penilaian
                </button>
                <button
                  onClick={() => handleLihatKlasmen(lomba.lomba.id)}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Lihat Klasmen
                </button>
              </div>

              <div className="border-t pt-3 text-sm text-gray-500 bg-gray-100 p-4 mt-4">
                <p>{FormatTanggal(lomba.lomba.tanggal, true)}</p>
                <p>
                  Juri:{" "}
                  {lomba.submission?.penilaian?.[0]?.juri.users.nama ||
                    "Juri belum memberikan penilaian"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Statistik Penilaian</h2>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Lomba Diikuti</p>
          <p className="text-3xl font-bold">
            {dataPenilaian.reduce(
              (acc, item) => acc + item.pesertalomba.length,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Penilaian;
