import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { icons } from "lucide-react";
import Swal from "sweetalert2";

const FormSubmit: React.FC = () => {
  const { idpeserta } = useParams<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [formData, setFormData] = useState({
    url: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (activeTab === "file" && !imageFile) {
      newErrors.file = "File harus diupload";
    } else if (activeTab === "url" && !formData.url.trim()) {
      newErrors.url = "URL tidak boleh kosong";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (100KB max)
      if (file.size > 100 * 1024 * 1024) {
        // 100MB = 100 × 1024 × 1024 bytes
        setErrors({ ...errors, file: "Ukuran file maksimum 100MB" });
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/zip",
        "application/x-rar-compressed",
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, file: "Format file tidak didukung" });
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, file: "" });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cek status submission saat komponen mount
  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const response = await fetch(
          `https://hono-api-lomba-tif-production.up.railway.app/submit/submission/${idpeserta}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.data) {
          setHasSubmitted(true);
          setSubmissionData(data.data);
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSubmission();
  }, [idpeserta]);

  const handleUploadToCloudinary = async () => {
    if (!imageFile || !validateForm()) return;

    setIsUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("file", imageFile);
      formdata.append("upload_preset", "lombapost");

      // --- FIX 1: Logika Penentuan Endpoint yang Lebih Baik ---
      // Jika tipe file diawali dengan 'image/', gunakan endpoint image.
      // Untuk tipe lain (pdf, docx, zip, dll.), gunakan endpoint raw.
      const isImage = imageFile.type.startsWith("image/");
      const endpoint = isImage
        ? "https://api.cloudinary.com/v1_1/dkkoi3qc0/image/upload"
        : "https://api.cloudinary.com/v1_1/dkkoi3qc0/raw/upload";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formdata,
      });

      const data = await response.json();

      // --- FIX 2: Pengecekan Status Respons ---
      // Periksa apakah respons dari Cloudinary tidak OK (bukan status 2xx).
      // Jika tidak OK, lemparkan error agar ditangkap oleh block `catch`.
      if (!response.ok) {
        // Ambil pesan error dari Cloudinary jika ada, jika tidak buat pesan default
        throw new Error(
          data.error?.message || "Gagal mengupload file ke Cloudinary."
        );
      }

      // Jika berhasil, panggil handleSubmit dengan URL yang aman
      await handleSubmit(data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
      // Tampilkan error yang sebenarnya di Swal
      Swal.fire({
        title: "Gagal Upload!",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak diketahui.",
        icon: "error",
      });
      // Anda juga bisa set error ke state di sini jika perlu
      setErrors({
        ...errors,
        file: error instanceof Error ? error.message : "Gagal mengupload file",
      });
    } finally {
      setIsUploading(false);
    }
  };


  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(
        `https://hono-api-lomba-tif-production.up.railway.app/submit/hapus/${submissionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: data.message,
          icon: "success",
        });
        // Refresh data atau update state
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error instanceof Error ? error.message : String(error),
        icon: "error",
      });
    }
  };
  
  const handleResetFile = () => {
    setImageFile(null);
    setImagePreview(null);
    setErrors({ ...errors, file: "" }); // Clear any file errors
  };

  const handleSubmit = async (fileUrl?: string) => {
    const submissionUrl = fileUrl || formData.url;

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `https://hono-api-lomba-tif-production.up.railway.app/submit/${idpeserta}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: submissionUrl }),
        }
      );

      if (!response.ok) throw new Error("Gagal mengirim submission");

      // Handle success (e.g., show success message, redirect, etc.)
      Swal.fire({
        title: "Sukses",
        text: "Berhasil Submit semoga berhasil 🔥🔥🔥",
        icon: "success",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ ...errors, submit: "Gagal mengirim submission" });
      Swal.fire({
        title: "Gagal",
        text: Object.values(errors).join(", "),
        icon: "error",
      });
    }
  };

  if (isChecking) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Memeriksa Status Submission...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Sedang memeriksa apakah Anda sudah melakukan submission...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Submission Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <p className="font-medium text-green-600">
                  Sudah melakukan submission
                </p>
              </div>

              <div>
                <Label>Waktu Submission</Label>
                <p>
                  {new Date(submissionData.submission_time).toLocaleString()}
                </p>
              </div>

              <div>
                <Label>File/URL</Label>
                <p className="break-all">
                  {submissionData.file_url.startsWith("http") ? (
                    <a
                      href={submissionData.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {submissionData.file_url}
                    </a>
                  ) : (
                    submissionData.file_url
                  )}
                </p>
              </div>

              <div>
                <Label>Lomba</Label>
                <p>{submissionData.pesertalomba.lomba.nama}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => handleDeleteSubmission(submissionData.id)}>
              Hapus Submission
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Karya</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="url">Submit URL</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="mt-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    {imagePreview ? (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-40 mx-auto"
                        />
                        <p className="mt-2 text-sm text-gray-600">
                          {imageFile?.name}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={handleResetFile}
                        >
                          <icons.X className="mr-2 h-4 w-4" />
                          Reset File
                        </Button>
                      </div>
                    ) : (
                      <>
                        <icons.CloudUpload className="h-10 w-10" />
                        <p className="text-sm text-gray-500">
                          Drag & drop file di sini atau klik untuk upload
                        </p>
                      </>
                    )}
                  </div>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Label
                    htmlFor="file"
                    className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                  >
                    Pilih File
                  </Label>
                </div>
                {errors.file && (
                  <p className="text-sm text-red-500">{errors.file}</p>
                )}
                <div className="text-sm text-gray-500">
                  <p>
                    Format yang didukung: JPG, PNG, PDF, DOC, DOCX, PPT, PPTX,
                    ZIP, RAR
                  </p>
                  <p>Ukuran maksimum: 100MB</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">URL Karya</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="Masukkan URL karya Anda"
                  />
                  {errors.url && (
                    <p className="text-sm text-red-500">{errors.url}</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={
              activeTab === "file"
                ? handleUploadToCloudinary
                : () => handleSubmit()
            }
            disabled={isUploading}
          >
            {isUploading ? "Mengupload..." : "Submit Karya"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormSubmit;
