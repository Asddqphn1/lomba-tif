import { useEffect, useState } from "react";
import { icons } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Lomba {
  bataswaktu: string;
  deskripsi: string;
  id: string;
  nama: string;
  pesertalomba: [
    {
      id: string;
    }
  ], 
  sertifikat : [
    {
      url : string
    }
  ]
}

export function DashboardSection() {
  const [peserta, setPeserta] = useState([]);
  const [juri, setJuri] = useState([]);
  const [lomba, setLomba] = useState<Lomba[]>([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Hitung jumlah lomba yang sudah selesai
  const lombaSelesai = lomba.filter(
    (item) => new Date(item.bataswaktu) < new Date()
  ).length;

  const lombaAktif = lomba.length - lombaSelesai;

  const lombaDenganSertifikat = lomba.filter(
    (item) => item.sertifikat.length > 0
  ).length;

  // Data untuk chart
  const chartData = {
    labels: ["Lomba Aktif", "Lomba Selesai"],
    datasets: [
      {
        data: [lombaAktif, lombaSelesai],
        backgroundColor: ["#6366F1", "#10B981"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    fetch(
      "https://hono-api-lomba-tif-production.up.railway.app/daftarpeserta",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => {
        if (response.status === 401) {
          navigate("/adminonly", { replace: true });
        }
        return response.json();
      })
      .then((data) => setPeserta(data.data));
  }, []);

  useEffect(() => {
    fetch("https://hono-api-lomba-tif-production.up.railway.app/juri", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setJuri(data.data));
  }, []);

  useEffect(() => {
    fetch("https://hono-api-lomba-tif-production.up.railway.app/daftarlomba", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setLomba(data.data);
        console.log(data.data);
      });
  }, []);

  useEffect(() => {
    fetch("https://hono-api-lomba-tif-production.up.railway.app/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUsers(data.data));
  }, []);
  const partisipasiData = {
    labels: lomba.map((item) => item.nama),
    datasets: [
      {
        label: "Jumlah Peserta",
        data: lomba.map((item) => item.pesertalomba.length),
        backgroundColor: "#6366F1",
        borderColor: "#4F46E5",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Partisipasi Lomba",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah Peserta",
        },
      },
      x: {
        title: {
          display: true,
          text: "Nama Lomba",
        },
      },
    },
  };
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>
      </header>
      <div className="p-6 h-screen w-[93vw]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <icons.Users />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <icons.Star />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Juri</p>
                <h3 className="text-2xl font-bold">{juri.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <icons.Trophy />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Lomba</p>
                <h3 className="text-2xl font-bold">{lomba.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                <icons.User />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Peserta</p>
                <h3 className="text-2xl font-bold">{peserta.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-200 text-green-600">
                <icons.CheckCheck />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Lomba Selesai</p>
                <h3 className="text-2xl font-bold">{lombaSelesai}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-200 text-orange-600">
                <icons.Flag />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Lomba Aktif</p>
                <h3 className="text-2xl font-bold">{lombaAktif}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-200 text-blue-600">
                <icons.FileCheck2 />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Sertifikat Upload</p>
                <h3 className="text-2xl font-bold">{lombaDenganSertifikat}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <icons.FileX />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Belum Ada sertifikat</p>
                <h3 className="text-2xl font-bold">
                  {lomba.length - lombaDenganSertifikat}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status Lomba</h2>
            <div className="h-64">
              <Pie
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Partisipasi Lomba</h2>
            <div className="h-64">
              <Bar data={partisipasiData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
