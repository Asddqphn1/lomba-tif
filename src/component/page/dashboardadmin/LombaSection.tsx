import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Swal from "sweetalert2";

interface prorpsOpen {
  open: boolean;
  onClose: () => void; // Tambahkan prop untuk menutup modal
}

const LombaSection: React.FC<prorpsOpen> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<{
    id: string;
    nama: string;
    tanggal: string;
    lokasi: string;
    bataswaktu: string;
    deskripsi: string;
    jenis_lomba: string;
    jumlah_anggota: number | undefined;
    url: string;
  }>({
    id: "",
    nama: "",
    tanggal: "",
    lokasi: "",
    bataswaktu: "",
    deskripsi: "",
    jenis_lomba: "",
    jumlah_anggota: undefined,
    url: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama lomba tidak boleh kosong";
    }
    if (!formData.tanggal || isNaN(new Date(formData.tanggal).getTime())) {
      newErrors.tanggal = "Tanggal tidak valid";
    }

    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal lomba tidak boleh kosong";
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi lomba tidak boleh kosong";
    }

    if (!imageFile) {
      newErrors.gambar = "Gambar lomba harus diunggah";
    }

    if (!formData.bataswaktu) {
      newErrors.bataswaktu = "Batas waktu pendaftaran tidak boleh kosong";
    } else if (new Date(formData.bataswaktu) < new Date(formData.tanggal)) {
      newErrors.bataswaktu = "Batas waktu tidak boleh sebelum tanggal lomba";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi lomba tidak boleh kosong";
    }

    // Validasi jumlah anggota jika jenis lomba TIM
    if (formData.jenis_lomba === "TIM" && !formData.jumlah_anggota) {
      newErrors.jumlah_anggota = "Jumlah anggota tim harus diisi";
    } else if (
      formData.jenis_lomba === "TIM" &&
      isNaN(Number(formData.jumlah_anggota))
    ) {
      newErrors.jumlah_anggota = "Jumlah anggota harus berupa angka";
    } else if (
      (formData.jenis_lomba === "TIM" &&
        Number(formData.jumlah_anggota) > 30) ||
      Number(formData.jumlah_anggota) < 2
    ) {
      newErrors.jumlah_anggota = "Jumlah anggota maksimal 30 orang atau minimal 2 orang";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      jenis_lomba: value,
      // Reset jumlah anggota jika jenis lomba diubah ke INDIVIDU
      jumlah_anggota: value === "INDIVIDU" ? undefined : Number(formData.jumlah_anggota),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formdata = new FormData();
      formdata.append("file", e.target.files[0]);
      formdata.append("upload_preset", "lombapost");
      fetch("https://api.cloudinary.com/v1_1/dkkoi3qc0/image/upload", {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            ...formData,
            url: data.url,
          });
          console.log(data);
        });
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error when user uploads an image
      if (errors.gambar) {
        setErrors({
          ...errors,
          gambar: "",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const payload = {
          id: formData.id,
          nama: formData.nama,
          tanggal: new Date(formData.tanggal).toISOString(),
          lokasi: formData.lokasi,
          url: formData.url, // Pastikan nama field sesuai dengan backend
          bataswaktu: new Date(formData.bataswaktu).toISOString(),
          deskripsi: formData.deskripsi,
          jenis_lomba: formData.jenis_lomba.toUpperCase(),
          jumlah_anggota:
            formData.jenis_lomba === "TIM"
              ? Number(formData.jumlah_anggota)
              : null, // Kirim null untuk INDIVIDU
        };

        const response = await fetch("http://localhost:3000/daftarlomba", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal menyimpan data lomba");
        }

        const data = await response.json();

        setIsSuccess(true);
        Swal.fire({
          title: "Sukses",
          text: data.message || "Lomba berhasil ditambahkan",
          icon: "success",
        });

        handleReset();
        setTimeout(() => onClose(), 2000);
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan data"
        );
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Terjadi kesalahan",
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleReset = () => {
    setFormData({
      id: "",
      nama: "",
      tanggal: "",
      lokasi: "",
      bataswaktu: "",
      deskripsi: "",
      jenis_lomba: "",
      jumlah_anggota: undefined,
      url: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
  };

  // Jika modal tidak open, return null
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay gelap */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose} // Tutup modal ketika overlay diklik
      ></div>

      {/* Konten modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-3xl mx-auto">
          <Card className="shadow-xl relative">
            {/* Tombol close di pojok kanan atas */}
            <button
              type="button"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              ❌
            </button>

            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardTitle className="text-2xl font-bold">
                Post Lomba Baru
              </CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Isi formulir di bawah untuk menambahkan lomba baru ke sistem
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {errorMessage && (
                <Alert className="mb-6 bg-red-50 border-red-500 text-red-700">
                  <AlertDescription>
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-circle mr-2 text-red-500"></i>
                      {errorMessage}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="id" className="text-sm font-medium">
                      ID Lomba
                    </Label>
                    <Input
                      id="id"
                      name="id"
                      value={formData.id}
                      placeholder="Masukkan ID lomba"
                      onChange={handleInputChange}
                      className="bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-sm font-medium">
                      Nama Lomba <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lomba"
                      className={errors.nama ? "border-red-500" : ""}
                    />
                    {errors.nama && (
                      <p className="text-sm text-red-500">{errors.nama}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tanggal" className="text-sm font-medium">
                        Tanggal Lomba <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tanggal"
                        name="tanggal"
                        type="datetime-local"
                        value={formatDate(formData.tanggal)}
                        onChange={handleInputChange}
                        className={errors.tanggal ? "border-red-500" : ""}
                      />
                      {errors.tanggal && (
                        <p className="text-sm text-red-500">{errors.tanggal}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Format: Tanggal dan waktu (UTC)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="bataswaktu"
                        className="text-sm font-medium"
                      >
                        Batas Waktu Pendaftaran{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bataswaktu"
                        name="bataswaktu"
                        type="datetime-local"
                        value={formatDate(formData.bataswaktu)}
                        onChange={handleInputChange}
                        className={errors.bataswaktu ? "border-red-500" : ""}
                      />
                      {errors.bataswaktu && (
                        <p className="text-sm text-red-500">
                          {errors.bataswaktu}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Format: Tanggal dan waktu (UTC)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lokasi" className="text-sm font-medium">
                      Lokasi Lomba <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lokasi"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      placeholder="Masukkan lokasi lomba"
                      className={errors.lokasi ? "border-red-500" : ""}
                    />
                    {errors.lokasi && (
                      <p className="text-sm text-red-500">{errors.lokasi}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gambar" className="text-sm font-medium">
                      Gambar Lomba <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1 flex items-center">
                      <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                          errors.gambar ? "border-red-300" : "border-gray-300"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          id="gambar"
                          name="gambar"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        {!imagePreview ? (
                          <div className="text-center">
                            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                            <p className="text-sm text-gray-600">
                              Klik untuk mengunggah gambar
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Format: JPG, PNG, GIF (Maks. 5MB)
                            </p>
                          </div>
                        ) : (
                          <div className="relative w-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mx-auto max-h-64 rounded-md object-contain"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setImageFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                            >
                              <i className="fas fa-times text-xs"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.gambar && (
                      <p className="text-sm text-red-500">{errors.gambar}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deskripsi" className="text-sm font-medium">
                      Deskripsi Lomba <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi lengkap tentang lomba"
                      className={`min-h-32 ${
                        errors.deskripsi ? "border-red-500" : ""
                      }`}
                    />
                    {errors.deskripsi && (
                      <p className="text-sm text-red-500">{errors.deskripsi}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Jenis Lomba <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.jenis_lomba}
                      onValueChange={handleRadioChange}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TIM" id="tim" />
                        <Label htmlFor="tim" className="cursor-pointer">
                          TIM
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="INDIVIDU" id="individu" />
                        <Label htmlFor="individu" className="cursor-pointer">
                          INDIVIDU
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Input jumlah anggota tim (hanya muncul jika jenis lomba TIM) */}
                  {formData.jenis_lomba === "TIM" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="jumlah_anggota"
                        className="text-sm font-medium"
                      >
                        Jumlah Anggota Tim{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="jumlah_anggota"
                        name="jumlah_anggota"
                        type="number"
                        min="2"
                        value={Number(formData.jumlah_anggota)}
                        onChange={handleInputChange}
                        placeholder="Masukkan jumlah anggota tim (minimal 2)"
                        className={
                          errors.jumlah_anggota ? "border-red-500" : ""
                        }
                      />
                      {errors.jumlah_anggota && (
                        <p className="text-sm text-red-500">
                          {errors.jumlah_anggota}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Separator className="my-8" />

                <CardFooter className="px-0 pb-0 pt-2 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="!rounded-button whitespace-nowrap w-full sm:w-auto"
                  >
                    <i className="fas fa-undo mr-2"></i>
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    className="!rounded-button whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Publikasikan Lomba
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LombaSection;
