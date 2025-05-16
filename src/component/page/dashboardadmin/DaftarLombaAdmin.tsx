// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const DaftarLombaAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('http://localhost:3000/daftarlomba', {
          headers: {
            'Content-Type': 'application/json',

          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch competitions');
        }
        
        const data = await response.json();
        setCompetitions(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Gagal menyimpan data lomba");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter(comp => 
    comp.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.jenis_lomba.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompetition = async () => {
    // You would implement the POST request here
    console.log('Add competition functionality');
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log('Edit competition with id:', id);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log('Delete competition with id:', id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat daftar lomba...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-500 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Lomba</h1>
          
          <div className="flex w-full md:w-auto gap-4 items-center">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Cari..."
                className="pl-10 pr-4 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
            </div>
            
            <Button 
              onClick={handleAddCompetition}
              className="bg-blue-600 hover:bg-blue-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-plus mr-2"></i>
              Tambah Lomba
            </Button>
          </div>
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {competition.url && (
                  <img 
                    src={competition.url} 
                    alt={competition.nama}
                    className="w-full h-full object-cover object-top"
                  />
                )}
                <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white">
                  {new Date(competition.bataswaktu) > new Date() ? 'Aktif' : 'Selesai'}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold text-gray-800">{competition.nama}</h3>
                <p className="text-sm text-gray-600">{competition.deskripsi}</p>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>Tanggal: {new Date(competition.tanggal).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>Lokasi: {competition.lokasi}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-users mr-2"></i>
                    <span>Jenis: {competition.jenis_lomba}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="far fa-clock mr-2"></i>
                    <span>Batas Waktu: {new Date(competition.bataswaktu).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  onClick={() => handleEdit(competition.id)}
                  variant="outline" 
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="far fa-edit mr-1"></i>
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDelete(competition.id)}
                  variant="outline" 
                  className="text-red-600 border-red-600 hover:bg-red-50 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="far fa-trash-alt mr-1"></i>
                  Hapus
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredCompetitions.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 text-5xl mb-4">
              <i className="far fa-folder-open"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak Ada Lomba Ditemukan</h3>
            <p className="text-gray-500 max-w-md">
              Lomba yang Anda cari tidak ditemukan. Silakan coba dengan kata kunci lain atau tambahkan lomba baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaftarLombaAdmin;