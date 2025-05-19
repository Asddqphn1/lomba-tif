import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { icons } from "lucide-react";

interface LombaUser {
  id: string;
  nama: string;
  lokasi: string;
  tanggal: string;
  bataswaktu: string;
  url : string  
}
interface peserta {
    nama : string
}


interface DataLombaUser {
  id_peserta_lomba: string;
  lomba: {
    id: string;
    nama: string;
    tanggal: string;
    lokasi: string;
    bataswaktu: string;
    url: string;
    jenis_lomba: string;
  };
  peserta: {
    nama: string;
    id: string;
    users: {
      email: string;
      nama: string;
    };
  };
}

const SubmissionSection: React.FC = () => {
  const [lombaUser, setLombaUser] = useState<LombaUser[]>([]);
  const [error, setError] = useState("");
  const [namaPeserta, setNamaPeserta] = useState<peserta[]>([])
  const [iduser, setIdUser] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    fetch("http://localhost:3000/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setIdUser(data.user.id))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!iduser) return;

    setLoading(true);
    fetch(`http://localhost:3000/daftarlomba/userlomba/${iduser}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user lomba");
        return res.json();
      })
      .then((data) => {
        setLombaUser(data.data.map((item: DataLombaUser) => item.lomba))
        setNamaPeserta(data.data.map((item : DataLombaUser) => item.peserta))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [iduser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (lombaUser.length === 0) {
    return <div className="text-center p-4">No competitions found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 w-[93vw]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lombaUser.map((lomba, index) => (
          <Card key={lomba.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img src={lomba.url} alt="" />

              <CardTitle className="text-xl font-bold mx-auto">
                {lomba.nama}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <icons.CircleUser className="" />
                  <span className="font-medium">Nama:</span>
                  <span className="ml-1">
                    {namaPeserta[index].nama}
                  </span>
                </div>
                <div className="flex items-center">
                  <icons.CalendarDays className="text-red-500"/>
                  <span className="font-medium">Deadline:</span>
                  <span className="ml-1">
                    {new Date(lomba.bataswaktu).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <icons.MapPin />
                  <span className="font-medium">Location:</span>
                  <span className="ml-1">{lomba.lokasi}</span>
                </div>
                <div className="flex items-center">
                  <icons.User />
                  <span className="font-medium">Category:</span>
                  <span className="ml-1">Individual/Team</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button className="bg-primary hover:bg-primary/90">
                Submit Work
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};



export default SubmissionSection;
