import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EditJuriModalProps {
  open: boolean;
  onClose: () => void;
  juri: {
    id: string;
    nama: string;
    lomba_id: string;
  };
  lombaOptions: Array<{
    id: string;
    nama: string;
  }>;
  onSave: (
    id: string,
    data: { nama: string; lomba_id: string }
  ) => Promise<boolean>;
}
const EditJuriModal = ({
  open,
  onClose,
  juri,
  lombaOptions,
  onSave,
}: EditJuriModalProps) => {
  const [nama, setNama] = useState(juri.nama);
  const [lombaId, setLombaId] = useState(juri.lomba_id);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(juri.id, { nama, lomba_id: lombaId });
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Data Juri</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama">Nama Juri</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="lomba">Cabang Lomba</Label>
            <Select value={lombaId} onValueChange={setLombaId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Lomba" />
              </SelectTrigger>
              <SelectContent>
                {lombaOptions.map((lomba) => (
                  <SelectItem key={lomba.id} value={lomba.id}>
                    {lomba.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJuriModal;
