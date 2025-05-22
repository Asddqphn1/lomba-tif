// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { icons } from "lucide-react";
import { FormatTanggal } from "@/helper/FormatTanggal";
import Swal from "sweetalert2";
import ProfileSection from "../profile/ProfileSection";

interface profile {
  id: string;
  nama: string;
  email: string;
  role: string;
}

interface Submission {
  id: string;
  pesertalomba_id: string;
  file_url: string;
  submission_time: string;
  pesertalomba: {
    id: string;
    peserta_id: string;
    lomba_id: string;
    peserta: {
      id: string;
      nama: string;
      user_id: string;
      created_at: string;
    };
    lomba: {
      id: string;
      tanggal: string;
      jenis_lomba: string;
      lokasi: string;
      nama: string;
      url: string;
      bataswaktu: string;
      deksripsi: string;
      jumlaht_tim: string;
    };
  };
  penilaian: {
    id: string;
    juri_id: string;
    submission_id: string;
    status_penilaian: string;
    nilai_penilaian: number;
    deksripsi_penilaian: string;
    created_at: string;
  };
}

interface juriId {
  id: string;
}

const Dashboardjuri: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(
    null
  );
  const [profile, setProfile] = useState<profile>();
  const [submission, setSubmission] = useState<Submission[]>([]);
  const [juriId, setjuriId] = useState<juriId>();
  const [idUser, setIdUser] = useState<string | null>(null);
  const [nilai, setNilai] = useState<number>();
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);



  const handleDownload = (url: string) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setProfile(data.user);
        setIdUser(data.user.id);
        console.log("User ID:", data.user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (idUser) {
      const fetchJuriId = async () => {
        try {
          const res = await fetch(`http://localhost:3000/juri/${idUser}`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch juri data");
          const data = await res.json();
          setjuriId(data.data[0].id);
          console.log("Juri ID:", data.data[0].id);
        } catch (error) {
          console.error("Error fetching juri data:", error);
        }
      };

      fetchJuriId();
    }
  }, [idUser]);

  useEffect(() => {
    // Fetch submissions after juriId is loaded
    if (juriId) {
      const fetchSubmissions = async () => {
        try {
          const res = await fetch(`http://localhost:3000/penilaian/${juriId}`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch submissions");
          const data = await res.json();
          setSubmission(data.data);
          console.log("Submissions:", data.data.length);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };

      fetchSubmissions();
    }
  }, [juriId]);

  const handleFetchSubmission = async () => {
    if (!selectedSubmission) return;

    try {
      const res = await fetch(
        `http://localhost:3000/submit/${selectedSubmission}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch submissions");

      const data = await res.json();
      setSubmission(data.data);
      console.log("Submitpenilaian:", data.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const resetForm = () => {
    setNilai(0);
    setDeskripsi("");
  };

  const showError = (message: string) => {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: message,
    });
  };

  const handleSubmitPenilaian = async () => {
    if (nilai == null || nilai > 100) {
      showError("Nilai harus antara 1 hingga 100.");
      return;
    }

    const payload = {
      nilai_penilaian: nilai,
      deskripsi_penilaian: deskripsi,
    };

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/penilaian/${selectedSubmission}/${juriId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        showError(result.message || "Gagal mengirim penilaian.");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Penilaian berhasil disimpan!",
      });

      resetForm();
    } catch (err) {
      console.error(err);
      showError("Terjadi kesalahan saat mengirim penilaian.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: "Reset Form?",
      text: "Data nilai dan deskripsi akan dikosongkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, reset!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        Swal.fire("Direset!", "Form berhasil dikosongkan.", "success");
      }
    });
  };


  React.useEffect(() => {
    if (activeTab === "dashboard") {
      const chartDom = document.getElementById("submissionChart");
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          animation: false,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: [
                "Senin",
                "Selasa",
                "Rabu",
                "Kamis",
                "Jumat",
                "Sabtu",
                "Minggu",
              ],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "Submission",
              type: "bar",
              barWidth: "60%",
              data: [1, 2, 0, 1, 0, 0, 0],
              itemStyle: {
                color: "#4F46E5",
              },
            },
          ],
        };
        myChart.setOption(option);
      }

      const distributionChartDom = document.getElementById("distributionChart");
      if (distributionChartDom) {
        const distributionChart = echarts.init(distributionChartDom);
        const option = {
          animation: false,
          tooltip: {
            trigger: "item",
          },
          series: [
            {
              name: "Status Penilaian",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: 4,
                  name: "Belum Dinilai",
                  itemStyle: { color: "#EF4444" },
                },
                {
                  value: 0,
                  name: "Sudah Dinilai",
                  itemStyle: { color: "#10B981" },
                },
              ],
            },
          ],
        };
        distributionChart.setOption(option);
      }
    }
  }, [activeTab]);

  const renderDashboard = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Juri</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <i className="fas fa-file-alt text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submission Total</p>

              <p className="text-2xl font-bold">{submission.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <i className="fas fa-clock text-red-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Penilaian Pending</p>
              <p className="text-2xl font-bold">{ }</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <i className="fas fa-users text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Peserta</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Submission Mingguan</h2>
          <div id="submissionChart" className="w-full h-64"></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Status Penilaian</h2>
          <div id="distributionChart" className="w-full h-64"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Submission Terbaru</h2>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap"
            onClick={() => setActiveTab("submission")}
          >
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Peserta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lomba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submission.slice(0, 3).map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.pesertalomba.peserta.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.pesertalomba.lomba.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(submission.submission_time).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {submission.penilaian.status_penilaian}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => {
                        setActiveTab("penilaian");
                        setSelectedSubmission(null);
                      }}
                    >
                      <i className="fas fa-star mr-1"></i> Nilai
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubmission = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Submission</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">Semua Submission</h2>
            <p className="text-sm text-gray-500">
              Total <span>{submission.length}</span> submission yang perlu
              dinilai
            </p>
          </div>

          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Cari peserta..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Semua Status</option>
              <option value="pending">Belum Dinilai</option>
              <option value="done">Sudah Dinilai</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Peserta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submission.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.pesertalomba.peserta.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.pesertalomba.lomba.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {FormatTanggal(submission.submission_time, true)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {submission.penilaian.status_penilaian}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => {
                        setActiveTab("penilaian");
                        handleFetchSubmission();
                        setSelectedSubmission(submission.id);
                      }}
                    >
                      <i className="fas fa-star mr-1"></i> Nilai
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 cursor-pointer !rounded-button whitespace-nowrap">
                      <i className="fas fa-eye mr-1"></i> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Menampilkan 1-4 dari 4 submission
          </p>
          <div className="flex">
            <button className="px-3 py-1 border rounded-l-lg bg-gray-100 text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 border-t border-b border-r bg-blue-600 text-white cursor-pointer !rounded-button whitespace-nowrap">
              1
            </button>
            <button className="px-3 py-1 border-t border-b border-r rounded-r-lg bg-gray-100 text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPenilaian = () => {
    const submit = submission.find((sub) => sub.id === selectedSubmission);
    if (!submit) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Penilaian Submission</h1>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <i className="fas fa-exclamation-circle text-yellow-500 text-5xl mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">
              Tidak ada submission yang dipilih
            </h2>
            <p className="text-gray-500 mb-4">
              Silakan pilih submission dari daftar untuk melakukan penilaian
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
              onClick={() => setActiveTab("submission")}
            >
              Lihat Daftar Submission
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            className="mr-4 text-blue-600 hover:text-blue-800 cursor-pointer !rounded-button whitespace-nowrap"
            onClick={() => setActiveTab("submission")}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-2xl font-bold">Penilaian Submission</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Detail Submission</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Peserta</p>
                  <p className="font-medium">
                    {submit.pesertalomba.peserta.nama}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lomba</p>
                  <p className="font-medium">
                    {submit.pesertalomba.lomba.nama}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori Lomba</p>
                  <p className="font-medium">
                    {submit.pesertalomba.lomba.jenis_lomba}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Submit</p>
                  <p className="font-medium">
                    {FormatTanggal(submit.submission_time, true)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">File Submission</h2>

              <div className="border rounded-lg p-4 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  {/* Ganti ikon berdasarkan tipe file */}
                  {submit.file_url?.endsWith(".pdf") ? (
                    <i className="fas fa-file-pdf text-red-600"></i>
                  ) : (
                    <i className="fas fa-file-video text-blue-600"></i>
                  )}
                </div>

                <div className="flex-grow overflow-hidden">
                  {submit.file_url?.endsWith(".pdf") ? (
                    // Untuk file PDF, tampilkan nama file saja
                    <span className="font-medium break-words">
                      {submit.file_url.split("/").pop()}
                    </span>
                  ) : (
                    // Untuk file lain, tampilkan link
                    <a
                      href={submit.file_url}
                      className="font-medium hover:text-blue-600 break-words"
                    >
                      {submit.file_url}
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDownload(submit.file_url)}
                  className="ml-4 text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap"
                >
                  <icons.ArrowDownToLine />
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Form Penilaian</h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitPenilaian();
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Nilai <span className="text-red-600">*</span>
                  </label>
                  <input
                  placeholder="Masukkan nilai antara 1-100"
                    type="number"
                    min={1}
                    max={100}
                    value={nilai}
                    onChange={(e) => setNilai(parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan / Komentar (<span className="text-gray-500">Opsional</span>)
                  </label>
                  <textarea
                    rows={4}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Berikan catatan atau komentar untuk peserta..."
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading ? "Menyimpan..." : "Simpan Penilaian"}

                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <ProfileSection />
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 border-b border-blue-600">
          <h1 className="text-xl font-bold">Dashboard Juri</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2">
              <button
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === "dashboard"
                  ? "bg-blue-800"
                  : "hover:bg-blue-600"
                  } cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab("dashboard")}
              >
                <icons.House className="w-6 mr-2" />
                <span>Dashboard</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === "submission"
                  ? "bg-blue-800"
                  : "hover:bg-blue-600"
                  } cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab("submission")}
              >
                <icons.FileCheck className="w-6 mr-2" />
                <span>Submission</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === "penilaian"
                  ? "bg-blue-800"
                  : "hover:bg-blue-600"
                  } cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab("penilaian")}
              >
                <icons.ClipboardList className="w-6 mr-2" />
                <span>Penilaian</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === "profile" ? "bg-blue-800" : "hover:bg-blue-600"
                  } cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab("profile")}
              >
                <icons.User className="w-6 mr-2" />
                <span>Profil</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-600">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
              <icons.User className="text-white" />
            </div>
            <div>
              <p className="font-medium">{profile?.nama}</p>
              <p className="text-sm text-blue-200">{profile?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "submission" && renderSubmission()}
        {activeTab === "penilaian" && renderPenilaian()}
        {activeTab === "profile" && renderProfile()}
      </div>
    </div>
  );
};

export default Dashboardjuri;
