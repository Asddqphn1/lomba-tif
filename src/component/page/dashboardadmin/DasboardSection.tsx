import { useEffect, useState } from "react";
import { icons } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function DashboardSection() {

  const [peserta, setPeserta] = useState([])
  const [juri, setJuri] = useState([])
  const [lomba, setLomba] = useState([])
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  
  useEffect( () => {
    fetch("http://localhost:3000/daftarpeserta", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then(response => {response.json()
      if (response.status === 401) {
        // If token is expired, redirect to login
        navigate("/adminonly", { replace: true });
      }
      return response.json();
    })
    .then(data => setPeserta(data.data))
    
  }, [])
  useEffect( () => {
    fetch("http://localhost:3000/juri", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then(response => response.json())
    .then(data => setJuri(data.data))
    
  }, [])
  useEffect( () => {
    fetch("http://localhost:3000/daftarlomba", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then(response => response.json())
    .then(data => setLomba(data.data))
    
  }, [])
  useEffect( () => {
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then(response => response.json())
    .then(data => setUsers(data.data))
    
  }, [])
  return (
    <>
      <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Dashboard
            </h1>
          </div>
      </header>
      <div className="p-6 h-screen w-[93vw]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <icons.Users/>
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <icons.Star/>
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Juri</p>
                <h3 className="text-2xl font-bold">{juri.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <icons.Trophy/>
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Lomba</p>
                <h3 className="text-2xl font-bold">{lomba.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <icons.User/>
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Peserta</p>
                <h3 className="text-2xl font-bold">{peserta.length}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
