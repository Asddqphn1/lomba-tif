// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import * as echarts from "echarts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { icons } from "lucide-react";

interface Judge {
  nilai_penilaian: number;
  deskripsi_penilaian: string;
  created_at: string;
  juri: {
    nama: string;
    lomba: {
      nama: string;
    };
  };
}

const NilaiLomba: React.FC = () => {
  const [activeJudge, setActiveJudge] = useState<number | null>(null);
  const {idUser} = useParams();

  const [judges, setJudges] = useState<Judge[]>([]);

  const averageScore = Math.round(
    judges.reduce((acc, judge) => acc + Number(judge.nilai_penilaian), 0) /
      judges.length
  );

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const response = await fetch(
          `https://hono-api-lomba-tif-production.up.railway.app/penilaian/peserta/${idUser}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data.data);
        setJudges(data.data);
      } catch (error) {
        console.error("Error fetching judges:", error);
      }
    };
    fetchJudges();
  }, [idUser])
  

  useEffect(() => {
    const chartDom = document.getElementById("scoreChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
              color: "#5C6AC4",
            },
            progress: {
              show: true,
              roundCap: true,
              width: 18,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 18,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              fontSize: 36,
              offsetCenter: [0, 0],
              formatter: `${averageScore}`,
              color: "#333",
            },
            data: [
              {
                value: averageScore,
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    }
  }, [averageScore]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {judges[0]?.juri.lomba.nama}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {judges.map((judge, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                activeJudge === index ? "ring-2 ring-indigo-500" : ""
              }`}
              onClick={() => setActiveJudge(index)}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  <icons.Contact />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {judge.juri.nama}
                </h3>
                <p className="text-gray-600 mb-4">{judge.juri.lomba.nama}</p>
                <div className="text-4xl font-bold text-indigo-600 mb-4">
                  {judge.nilai_penilaian}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nilai Rata-rata
            </h2>
            <div className="w-48 h-48 mx-auto" id="scoreChart"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Deskripsi Penilaian
          </h2>
          <div className="space-y-6">
            {judges.map((judge, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {judge.juri.nama}
                </h3>
                <p>
                  {judge.deskripsi_penilaian
                    ? judge.deskripsi_penilaian
                    : "Tidak ada deskripsi"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NilaiLomba;
