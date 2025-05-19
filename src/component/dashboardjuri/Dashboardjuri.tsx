// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { icons } from 'lucide-react';

interface profile {
    id: string;
    nama: string;
    email: string;
    role: string;
}

const Dashboardjuri: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [profile, setProfile] = useState<profile>();


  useEffect(() => {
      // Fetch user data
      fetch("http://localhost:3000/auth/me", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => setProfile(data.user))
    }, []);
    

  const submissions = [
    { id: 1, name: 'Ahmad Fauzi', category: 'Tenis Meja Teknik Informatika', date: '15/05/2025', status: 'Belum Dinilai' },
    { id: 2, name: 'Siti Nurhaliza', category: 'Tenis Meja Teknik Informatika', date: '16/05/2025', status: 'Belum Dinilai' },
    { id: 3, name: 'Budi Santoso', category: 'Tenis Meja Teknik Informatika', date: '16/05/2025', status: 'Belum Dinilai' },
    { id: 4, name: 'Dewi Kartika', category: 'Tenis Meja Teknik Informatika', date: '17/05/2025', status: 'Belum Dinilai' },
  ];

  React.useEffect(() => {
    if (activeTab === 'dashboard') {
      const chartDom = document.getElementById('submissionChart');
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          animation: false,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Submission',
              type: 'bar',
              barWidth: '60%',
              data: [1, 2, 0, 1, 0, 0, 0],
              itemStyle: {
                color: '#4F46E5'
              }
            }
          ]
        };
        myChart.setOption(option);
      }

      const distributionChartDom = document.getElementById('distributionChart');
      if (distributionChartDom) {
        const distributionChart = echarts.init(distributionChartDom);
        const option = {
          animation: false,
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: 'Status Penilaian',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 4, name: 'Belum Dinilai', itemStyle: { color: '#EF4444' } },
                { value: 0, name: 'Sudah Dinilai', itemStyle: { color: '#10B981' } }
              ]
            }
          ]
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
              <p className="text-sm text-gray-500">Submission Masuk</p>
              <p className="text-2xl font-bold">4</p>
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
              <p className="text-2xl font-bold">4</p>
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
            onClick={() => setActiveTab('submission')}
          >
            Lihat Semua
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.slice(0, 3).map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => {
                        setActiveTab('penilaian');
                        setSelectedSubmission(submission.id);
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
            <p className="text-sm text-gray-500">Total 4 submission yang perlu dinilai</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => {
                        setActiveTab('penilaian');
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
          <p className="text-sm text-gray-500">Menampilkan 1-4 dari 4 submission</p>
          <div className="flex">
            <button className="px-3 py-1 border rounded-l-lg bg-gray-100 text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 border-t border-b border-r bg-blue-600 text-white cursor-pointer !rounded-button whitespace-nowrap">1</button>
            <button className="px-3 py-1 border-t border-b border-r rounded-r-lg bg-gray-100 text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPenilaian = () => {
    const submission = submissions.find(s => s.id === selectedSubmission);
    
    if (!submission) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Penilaian Submission</h1>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <i className="fas fa-exclamation-circle text-yellow-500 text-5xl mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Tidak ada submission yang dipilih</h2>
            <p className="text-gray-500 mb-4">Silakan pilih submission dari daftar untuk melakukan penilaian</p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
              onClick={() => setActiveTab('submission')}
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
            onClick={() => setActiveTab('submission')}
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
                  <p className="font-medium">{submission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori Lomba</p>
                  <p className="font-medium">{submission.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Submit</p>
                  <p className="font-medium">{submission.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {submission.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Deskripsi Karya</h3>
                <p className="text-gray-700">
                  Karya ini merupakan implementasi dari teknik permainan tenis meja dengan menggunakan teknologi informatika.
                  Peserta telah mengembangkan sistem analisis gerakan dan strategi permainan yang dapat membantu pemain
                  meningkatkan kemampuan mereka.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">File Submission</h2>
              
              <div className="border rounded-lg p-4 mb-4 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <i className="fas fa-file-pdf text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Dokumentasi_Karya.pdf</p>
                  <p className="text-sm text-gray-500">2.4 MB</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-download"></i>
                </button>
              </div>
              
              <div className="border rounded-lg p-4 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <i className="fas fa-file-video text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Presentasi_Karya.mp4</p>
                  <p className="text-sm text-gray-500">45.7 MB</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Form Penilaian</h2>
              
              <form>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1"> Nilai (1-100)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Komentar</label>
                  <textarea 
                    rows={4} 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Berikan catatan atau komentar untuk peserta..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    type="button" 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Reset
                  </button>
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Simpan Penilaian
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profil Juri</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                <icons.User className="text-blue-600 w-16 h-16" />
              </div>
              <h2 className="text-xl font-bold">{profile?.nama}</h2>
              <p className="text-gray-500">{profile?.role}</p>
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-8 md:border-l">
            <h3 className="text-lg font-semibold mb-4">Informasi Juri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
            </div>
            
           
            <div>
              <h3 className="text-lg font-semibold mb-2">Statistik Penilaian</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Dinilai</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Menunggu Penilaian</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Rata-rata Nilai</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-600'} cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab('dashboard')}
              >
                <icons.House className="w-6 mr-2" />    
                <span>Dashboard</span>
              </button>
            </li>
            <li className="mb-2">
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'submission' ? 'bg-blue-800' : 'hover:bg-blue-600'} cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab('submission')}
              >
                <icons.FileCheck className="w-6 mr-2" />
                <span>Submission</span>
              </button>
            </li>
            <li className="mb-2">
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'penilaian' ? 'bg-blue-800' : 'hover:bg-blue-600'} cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab('penilaian')}
              >
                <icons.ClipboardList className="w-6 mr-2" />
                <span>Penilaian</span>
              </button>
            </li>
            <li className="mb-2">
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-800' : 'hover:bg-blue-600'} cursor-pointer !rounded-button whitespace-nowrap`}
                onClick={() => setActiveTab('profile')}
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'submission' && renderSubmission()}
        {activeTab === 'penilaian' && renderPenilaian()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default Dashboardjuri;

