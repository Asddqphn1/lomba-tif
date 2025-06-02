// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from "react";
import { icons } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BerandaSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("beranda");
  const [statCounts, setStatCounts] = useState({
    peserta: 0,
    lomba: 0,
    karya: 0,
    juri: 0,
  });
  const navigasi = useNavigate();

  // Animasi counter untuk statistik
  useEffect(() => {
    const targetCounts = {
      peserta: 1250,
      lomba: 48,
      karya: 876,
      juri: 32,
    };

    const duration = 2000; // 2 detik
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      if (progress >= 1) {
        setStatCounts(targetCounts);
        clearInterval(timer);
      } else {
        setStatCounts({
          peserta: Math.floor(targetCounts.peserta * progress),
          lomba: Math.floor(targetCounts.lomba * progress),
          karya: Math.floor(targetCounts.karya * progress),
          juri: Math.floor(targetCounts.juri * progress),
        });
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold -ml-3 flex">
                <img src="/logo.png" alt="logo" className="w-8 h-8 mr-2" />
                Lomba TIF
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => handleTabClick("beranda")}
                className={`text-white hover:text-blue-200 !rounded-button whitespace-nowrap cursor-pointer ${
                  activeTab === "beranda"
                    ? "font-bold border-b-2 border-blue-300"
                    : ""
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => navigasi("/login")}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              >
                Masuk / Daftar
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none !rounded-button whitespace-nowrap cursor-pointer"
              >
                <i
                  className={`fas ${
                    isMenuOpen ? "fa-times" : "fa-bars"
                  } text-2xl`}
                ></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
              <button
                onClick={() => handleTabClick("beranda")}
                className={`text-white hover:text-blue-200 py-2 !rounded-button whitespace-nowrap cursor-pointer ${
                  activeTab === "beranda"
                    ? "font-bold border-b border-blue-300"
                    : ""
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => handleTabClick("daftar-lomba")}
                className={`text-white hover:text-blue-200 py-2 !rounded-button whitespace-nowrap cursor-pointer ${
                  activeTab === "daftar-lomba"
                    ? "font-bold border-b border-blue-300"
                    : ""
                }`}
              >
                Daftar Lomba
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                Masuk / Daftar
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/hero.webp"
            alt="Hero Background"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Platform Lomba Teknik Informatika UIN Suska Riau
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Wadah digital untuk mengembangkan kreativitas, inovasi, dan
              kompetisi di bidang teknologi informasi bagi mahasiswa Teknik
              Informatika UIN Suska Riau.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigasi("/login")}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white font-medium text-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              >
                Daftar Sekarang
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg text-white font-medium text-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fitur Utama
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Platform kami menyediakan berbagai fitur untuk memudahkan proses
              pendaftaran, pengumpulan karya, dan penilaian lomba.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <icons.UserPlus />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Pendaftaran Online
              </h3>
              <p className="text-gray-600">
                Daftar lomba dengan mudah melalui platform digital tanpa perlu
                tatap muka.
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <icons.Upload />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload Karya
              </h3>
              <p className="text-gray-600">
                Unggah hasil karya lomba Anda secara langsung ke platform dengan
                aman.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <icons.Star />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Penilaian Juri
              </h3>
              <p className="text-gray-600">
                Sistem penilaian terstruktur oleh juri yang kompeten di
                bidangnya.
              </p>
            </div>

            {/* Fitur 4 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center cursor-pointer">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <icons.FileBadge />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Manajemen Lomba
              </h3>
              <p className="text-gray-600">
                Pengelolaan lomba yang efisien dengan dashboard khusus untuk
                admin.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Alur Pendaftaran */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Alur Pendaftaran
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ikuti langkah-langkah sederhana berikut untuk mulai berpartisipasi
              dalam lomba.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-0">
              {/* Step 1 */}
              <motion.div
                className="md:flex items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    1. Registrasi Akun
                  </h3>
                  <p className="text-gray-600">
                    Buat akun baru atau masuk dengan akun yang sudah ada untuk
                    mengakses platform.
                  </p>
                </div>
                <div className="md:w-12 mx-auto md:mx-0 flex justify-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white relative z-10">
                    <icons.UserPlus />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block">
                  <img
                    src="https://readdy.ai/api/search-image?query=Person%20registering%20on%20a%20website%2C%20close-up%20of%20hands%20typing%20on%20keyboard%2C%20digital%20registration%20form%20visible%20on%20screen%2C%20professional%20tech%20environment%20with%20blue%20and%20purple%20accents%2C%20clean%20modern%20interface%20design&width=500&height=300&seq=step1&orientation=landscape"
                    alt="Registrasi Akun"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="md:flex items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="md:w-1/2 md:pr-12 hidden md:block">
                  <img
                    src="https://readdy.ai/api/search-image?query=Person%20browsing%20through%20competition%20listings%20on%20a%20website%2C%20digital%20catalog%20of%20tech%20competitions%2C%20user%20selecting%20from%20multiple%20contest%20options%2C%20professional%20interface%20with%20blue%20and%20purple%20tech%20elements%2C%20clean%20modern%20design&width=500&height=300&seq=step2&orientation=landscape"
                    alt="Pilih Lomba"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-12 mx-auto md:mx-0 flex justify-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white relative z-10">
                    <icons.ListCollapse />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    2. Pilih Lomba
                  </h3>
                  <p className="text-gray-600">
                    Jelajahi daftar lomba yang tersedia dan pilih sesuai minat
                    dan keahlian Anda.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="md:flex items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    3. Upload Karya
                  </h3>
                  <p className="text-gray-600">
                    Kerjakan dan unggah hasil karya Anda sebelum batas waktu
                    yang ditentukan.
                  </p>
                </div>
                <div className="md:w-12 mx-auto md:mx-0 flex justify-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white relative z-10">
                    <icons.Upload />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block">
                  <img
                    src="https://readdy.ai/api/search-image?query=Person%20uploading%20digital%20project%20files%20to%20a%20competition%20platform%2C%20file%20upload%20interface%20with%20progress%20bar%2C%20document%20submission%20process%2C%20professional%20tech%20environment%20with%20blue%20and%20purple%20accents%2C%20clean%20modern%20design&width=500&height=300&seq=step3&orientation=landscape"
                    alt="Upload Karya"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                className="md:flex items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="md:w-1/2 md:pr-12 hidden md:block">
                  <img
                    src="https://readdy.ai/api/search-image?query=Judges%20evaluating%20digital%20projects%20on%20a%20competition%20platform%2C%20assessment%20interface%20with%20rating%20system%2C%20professional%20evaluation%20process%2C%20tech%20environment%20with%20blue%20and%20purple%20accents%2C%20clean%20modern%20design&width=500&height=300&seq=step4&orientation=landscape"
                    alt="Proses Penilaian"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-12 mx-auto md:mx-0 flex justify-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white relative z-10">
                    <icons.Star />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    4. Proses Penilaian
                  </h3>
                  <p className="text-gray-600">
                    Tim juri akan menilai karya Anda dan mengumumkan pemenang
                    sesuai jadwal.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik & Pencapaian */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Statistik & Pencapaian
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Lomba TIF terus berkembang dengan dukungan dari mahasiswa, dosen,
              dan juri yang berpartisipasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statCounts.peserta}+
              </div>
              <div className="text-xl">Peserta Terdaftar</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statCounts.lomba}+
              </div>
              <div className="text-xl">Lomba Diselenggarakan</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statCounts.karya}+
              </div>
              <div className="text-xl">Karya Dikumpulkan</div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statCounts.juri}+
              </div>
              <div className="text-xl">Juri Terlibat</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo dan Deskripsi */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <i className="fas fa-code mr-2 text-blue-400"></i>
                <span className="text-2xl font-bold">Lomba TIF</span>
              </div>
              <p className="text-gray-400 mb-4">
                Platform digital untuk memfasilitasi proses pelaksanaan dan
                manajemen perlombaan di lingkungan Teknik Informatika UIN Suska
                Riau.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
                Tautan Cepat
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Daftar Lomba
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cara Pendaftaran
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Tentang Kami
                  </a>
                </li>
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
                Kontak
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-blue-400"></i>
                  <span className="text-gray-400">
                    Jurusan Teknik Informatika, UIN Sultan Syarif Kasim Riau,
                    Pekanbaru
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-3 text-blue-400"></i>
                  <a
                    href="mailto:info@lombatif.ac.id"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    info@lombatif.ac.id
                  </a>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-3 text-blue-400"></i>
                  <a
                    href="tel:+6282112345678"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    +62 821 1234 5678
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 mb-4 md:mb-0">
              &copy; 2025 Lomba TIF. Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center">
              <img
                src="https://readdy.ai/api/search-image?query=UIN%20Sultan%20Syarif%20Kasim%20Riau%20logo%2C%20official%20university%20emblem%2C%20professional%20educational%20institution%20symbol%2C%20clean%20design%20on%20transparent%20background&width=120&height=60&seq=uinlogo&orientation=landscape"
                alt="UIN Suska Riau"
                className="h-10 mr-4"
              />
              <div className="text-gray-500">
                Didukung oleh Jurusan Teknik Informatika UIN Suska Riau
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BerandaSection;
