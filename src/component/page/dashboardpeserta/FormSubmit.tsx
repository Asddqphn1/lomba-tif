import React, { useState } from "react";
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
      if (file.size > 1000000 * 1024) {
        setErrors({ ...errors, file: "Ukuran file maksimum 100KB" });
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

  const handleUploadToCloudinary = async () => {
    if (!imageFile || !validateForm()) return;

    setIsUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("file", imageFile);
      formdata.append("upload_preset", "lombapost");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkkoi3qc0/image/upload",
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await response.json();
      await handleSubmit(data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ ...errors, file: "Gagal mengupload file" });
    } finally {
      setIsUploading(false);
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
        `http://localhost:3000/submit/${idpeserta}`,
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
        text:
          "Berhasil Submit semoga berhasil 🔥🔥🔥",
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
                  <p>Ukuran maksimum: 100KB</p>
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
