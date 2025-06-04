// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { icons } from "lucide-react";
import { FormatTanggal } from "@/helper/FormatTanggal";
interface TeamData {
  nilai: number;
  peserta: {
    nama: string;
    email: string;
  };
  lomba: {
    nama: string;
  };
}

interface ProcessedTeamData {
  nama: string;
  email: string;
  lomba: string;
  totalNilai: number;
  jumlahData: number;
  rataRata: number;
}

const Klasmen: React.FC = () => {
  const { idLomba } = useParams();
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [processedTeams, setProcessedTeams] = useState<ProcessedTeamData[]>([]);
  const [namaLomba, setNamaLomba] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");
  const [sertifikat, setSertifikat] = useState<string | null>(null);
  const [animatedPoints, setAnimatedPoints] = useState<{
    [key: number]: number;
  }>({});

  const processTeamsData = (data: TeamData[]) => {
    const groupedData: Record<string, ProcessedTeamData> = {};

    data.forEach((item) => {
      const nilai =
        typeof item.nilai === "string" ? parseFloat(item.nilai) : item.nilai;
      const key = item.peserta.nama;

      if (!groupedData[key]) {
        groupedData[key] = {
          nama: item.peserta.nama,
          email: item.peserta.email,
          lomba: item.lomba.nama,
          totalNilai: nilai,
          jumlahData: 1,
          rataRata: nilai,
        };
      } else {
        groupedData[key].totalNilai += nilai;
        groupedData[key].jumlahData += 1;
        groupedData[key].rataRata =
          groupedData[key].totalNilai / groupedData[key].jumlahData;
      }
    });

    // Bulatkan nilai rata-rata sebelum disort
    const sortedData = Object.values(groupedData)
      .map((team) => ({
        ...team,
        rataRata: Math.round(team.rataRata), // Pembulatan di sini
      }))
      .sort((a, b) => b.rataRata - a.rataRata);

    setProcessedTeams(sortedData);
  };

  useEffect(() => {
    fetch(`https://hono-api-lomba-tif-production.up.railway.app/penilaian/daftarnilai/${idLomba}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTeams(data.data);
        processTeamsData(data.data);
      });
  }, [idLomba]);

  useEffect(() => {
    fetch(`https://hono-api-lomba-tif-production.up.railway.app/daftarlomba/${idLomba}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setNamaLomba(data.data.nama);
        setTanggal(data.data.tanggal);
      });
  }, [idLomba]);

  useEffect(() => {
    if (processedTeams.length > 0) {
      const animationDuration = 2;
      const steps = 60;
      const incrementTimes = (animationDuration * 1000) / steps;

      const timers = processedTeams.slice(0, 3).map((team, index) => {
        const targetPoints = team.rataRata; // Sudah dibulatkan di processTeamsData
        const increment = targetPoints / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= targetPoints) {
            current = targetPoints;
            clearInterval(timer);
          }

          setAnimatedPoints((prev) => ({
            ...prev,
            [index + 1]: Math.round(current), // Gunakan round juga di animasi
          }));
        }, steps);

        return timer;
      });

      return () => timers.forEach((timer) => clearInterval(timer));
    }
  }, [processedTeams]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const firstPlaceVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: -60,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const medalVariants = {
    hidden: { rotateY: 0 },
    visible: {
      rotateY: 360,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    fetch(`http://localhost:3000/sertifikat/${idLomba}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      setSertifikat(data.data.url);
      
    })
  }, [idLomba]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white">
      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center border-b border-blue-800">
        <div className="flex items-center gap-3">
          <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
          <h1 className="text-2xl font-bold">
            Klasemen <span>{namaLomba}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-300">{FormatTanggal(tanggal, false)}</span>
          {sertifikat ? (
            <Button
              variant="outline"
              className="!rounded-button whitespace-nowrap bg-blue-900 border-blue-700 text-white hover:bg-blue-800"
            >
              <icons.Scroll />
              <Link
                to={sertifikat}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2"
              >
                Sertifikat
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="!rounded-button whitespace-nowrap bg-red-900 border-red-700 text-white hover:bg-red-800 cursor-not-allowed"
              disabled
            >
              <icons.Ban className="text-red-300" />
              <span className="ml-2">Sertifikat Belum Tersedia</span>
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Podium Section */}
        <section className="mb-16 relative">
          <div className="absolute inset-0 bg-[url(/logotiflomba.jpeg)] bg-cover bg-center opacity-30 rounded-xl"></div>
          <motion.h2
            className="text-center text-4xl font-bold mb-25"
            variants={itemVariants}
          >
            Pemenang Utama
          </motion.h2>

          <motion.div
            className="relative z-10 py-16"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-end justify-center gap-6 mb-8 md:gap-10 lg:gap-16">
                {/* Second Place */}
                <motion.div
                  className="flex flex-col items-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-b from-gray-300 to-gray-500 flex items-center justify-center mb-4 shadow-lg"
                    variants={medalVariants}
                  >
                    <icons.Medal className="w-16 h-16 md:w-20 md:h-20 text-gray-200" />
                  </motion.div>
                  <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-xl w-48 md:w-56 text-center shadow-xl">
                    <div className="text-gray-300 font-semibold mb-1">
                      Peringkat 2
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                      {processedTeams[1]?.nama || "-"}
                    </h3>
                    <div className="text-3xl md:text-4xl font-bold text-gray-700">
                      {isNaN(animatedPoints[2])
                        ? 0
                        : Math.round(processedTeams[1]?.rataRata)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">poin</div>
                  </div>
                  <div className="h-32 w-48 md:w-56 bg-gradient-to-t from-gray-700 to-gray-800 rounded-t-lg mt-4"></div>
                </motion.div>

                {/* First Place */}
                <motion.div
                  className="flex flex-col items-center -mt-16"
                  variants={firstPlaceVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 flex items-center justify-center mb-4 shadow-lg"
                    variants={medalVariants}
                  >
                    <icons.Medal className="w-20 h-20 md:w-24 md:h-24 text-yellow-300" />
                  </motion.div>
                  <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 p-8 rounded-xl w-56 md:w-64 text-center shadow-xl">
                    <div className="text-yellow-300 font-semibold mb-1">
                      Peringkat 1
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                      {processedTeams[0]?.nama || "-"}
                    </h3>
                    <div className="text-4xl md:text-5xl font-bold text-yellow-200">
                      {isNaN(animatedPoints[1])
                        ? 0
                        : Math.round(processedTeams[0]?.rataRata)}
                    </div>
                    <div className="text-sm text-yellow-400 mt-1">poin</div>
                  </div>
                  <div className="h-40 w-56 md:w-64 bg-gradient-to-t from-yellow-800 to-yellow-900 rounded-t-lg mt-4"></div>
                </motion.div>

                {/* Third Place */}
                <motion.div
                  className="flex flex-col items-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 flex items-center justify-center mb-4 shadow-lg"
                    variants={medalVariants}
                  >
                    <icons.Medal className="w-16 h-16 md:w-20 md:h-20 text-amber-800" />
                  </motion.div>
                  <div className="bg-gradient-to-r from-amber-800 to-amber-950 p-6 rounded-xl w-48 md:w-56 text-center shadow-xl">
                    <div className="text-amber-400 font-semibold mb-1">
                      Peringkat 3
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                      {processedTeams[2]?.nama || "-"}
                    </h3>
                    <div className="text-3xl md:text-4xl font-bold text-amber-300">
                      {isNaN(animatedPoints[3])
                        ? 0
                        : Math.round(processedTeams[2]?.rataRata)}
                    </div>
                    <div className="text-sm text-amber-500 mt-1">poin</div>
                  </div>
                  <div className="h-24 w-48 md:w-56 bg-gradient-to-t from-amber-900 to-amber-950 rounded-t-lg mt-4"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Full Rankings Table */}
        <section>
          <div className="bg-blue-950/50 rounded-xl p-6 backdrop-blur-sm border border-blue-900">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <icons.List className="w-6 h-6 mr-2" />
              Klasemen Lengkap
            </h2>

            <ScrollArea className="h-[400px] rounded-md">
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {processedTeams.map((team, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                        },
                      },
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className={`p-4 flex justify-between ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white"
                          : index === 2
                          ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
                          : "bg-blue-950/60 text-white"
                      } !rounded-button cursor-pointer hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mr-4 bg-blue-900/50">
                        {index === 0 ? (
                          <icons.Crown className="w-8 h-8 text-yellow-300" />
                        ) : index === 1 || index === 2 ? (
                          <icons.Medal className="w-8 h-8 text-amber-300" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex justify-between w-full">
                        <h3 className="font-bold text-lg">
                          {team.nama}
                          <br />
                          <span className="text-sm text-green-500">
                            {team.jumlahData} penilaian
                          </span>
                        </h3>
                        <div className="flex-shrink-0 text-right mr-5">
                          <div className="text-2xl font-bold">
                            {Math.round(team.rataRata)}
                          </div>
                          <div className="text-xs opacity-80">poin</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          </div>
        </section>
      </main>

      <footer className="mt-16 py-8 px-8 border-t border-blue-900 bg-blue-950/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-trophy text-yellow-500"></i>
                <span className="font-bold text-xl">
                  Kejuaraan Nasional 2025
                </span>
              </div>
              <p className="text-blue-300">
                Klasemen diperbarui pada 22 Mei 2025
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="!rounded-button whitespace-nowrap text-blue-300 hover:text-white hover:bg-blue-800"
              >
                <i className="fab fa-facebook-f mr-2"></i>
                Facebook
              </Button>
              <Button
                variant="ghost"
                className="!rounded-button whitespace-nowrap text-blue-300 hover:text-white hover:bg-blue-800"
              >
                <i className="fab fa-twitter mr-2"></i>
                Twitter
              </Button>
              <Button
                variant="ghost"
                className="!rounded-button whitespace-nowrap text-blue-300 hover:text-white hover:bg-blue-800"
              >
                <i className="fab fa-instagram mr-2"></i>
                Instagram
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-blue-400 text-sm">
            © 2025 Panitia Kejuaraan Nasional. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Klasmen;
