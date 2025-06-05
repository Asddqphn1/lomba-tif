import React, { useEffect, useState } from "react";
import { icons } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface lomba_user {
  nama: string;
  id: string;
  lokasi: string;
  tanggal: string;
  bataswaktu: string;
}
interface submit {
  id: string;
  file_url: string;
  submission_time: string;
}

interface pesertaLomba {
  id_peserta_lomba: string;
  lomba: {
    id: string;
    nama: string;
    tanggal: string;
    lokasi: string;
    bataswaktu: string;
  };
}
const MainDashboard: React.FC = () => {
  const [lombaUser, setLombauser] = useState<lomba_user[]>([]);
  const [lomba, setLomba] = useState([]);
  const [iduser, setIduser] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [url, setUrl] = useState<submit[]>([]);
  const [showAllCompetitions, setShowAllCompetitions] = useState(false); // New state for toggling

  useEffect(() => {
    // Fetch user data
    fetch("https://hono-api-lomba-tif-production.up.railway.app/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setIduser(data.user.id))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    // Fetch all lomba
    fetch("https://hono-api-lomba-tif-production.up.railway.app/daftarlomba", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lomba");
        return res.json();
      })
      .then((data) => setLomba(data.data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!iduser) return; // Don't fetch if no user ID

    setLoading(true);
    fetch(`https://hono-api-lomba-tif-production.up.railway.app/daftarlomba/userlomba/${iduser}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user lomba");
        return res.json();
      })
      .then((data) => {
        setLombauser(data.data.map((item: pesertaLomba) => item.lomba)); // Changed from data.lomba to data.data
        console.log("User lomba data:", data.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [iduser]);

  useEffect(() => {
    if (!iduser) return; // Don't fetch if no user ID

    setLoading(true);
    fetch(`https://hono-api-lomba-tif-production.up.railway.app/submit/users/${iduser}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user lomba");
        return res.json();
      })
      .then((data) => {
        setUrl(data.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [iduser]);

  const toggleShowAllCompetitions = () => {
    setShowAllCompetitions(!showAllCompetitions);
  };

  // Get the competitions to display - either first 3 or all
  const displayedCompetitions = showAllCompetitions
    ? lombaUser
    : lombaUser.slice(0, 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const data = {
    labels: ["Lomba Diikuti", "Daftar Lomba"], // Labels for the bars
    datasets: [
      {
        label: "Total Lomba", // Label for the dataset
        data: [lombaUser.length, lomba.length], // Counts for lombaUser and lomba
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Color for the bars
        borderColor: "rgba(75, 192, 192, 1)", // Border color for the bars
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Perbandingan Lomba User dan Daftar Lomba",
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
      <div className="p-6 w-[93vw]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <icons.Users />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Lomba Yang Diikuti</p>
                <h3 className="text-2xl font-bold">{lombaUser.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <icons.Star />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Submission</p>
                <h3 className="text-2xl font-bold">
                  {url.length}/{lombaUser.length}
                </h3>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
          <Card className="shadow-lg rounded-lg p-6 w-full">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900">
                Lomba List
              </h2>
            </CardHeader>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {displayedCompetitions.map((item) => (
                  <div key={item.id} className="border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.nama}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(item.tanggal).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Location:</strong> {item.lokasi}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Deadline:</strong>{" "}
                      {new Date(item.bataswaktu).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {lombaUser.length > 3 && (
                  <p className="text-sm text-gray-500">
                    Showing {displayedCompetitions.length} of {lombaUser.length}{" "}
                    competitions
                  </p>
                )}
              </div>
            </div>
            <CardFooter>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={toggleShowAllCompetitions}
              >
                {showAllCompetitions ? "Show Less" : "View All"}
              </button>
            </CardFooter>
          </Card>
          <Card className="shadow-lg rounded-lg p-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg">Partisipasi Lomba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Displaying the lengths */}
                <div>
                  <strong>Lomba Diikuti:</strong> {lombaUser.length}
                </div>
                <div>
                  <strong>Daftar Lomba:</strong> {lomba.length}
                </div>

                {/* Chart Component */}
                <Bar data={data} options={options} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MainDashboard;
