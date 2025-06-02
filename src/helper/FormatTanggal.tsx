/**
 * Format tanggal Indonesia dari ISO string
 * @param isoDate - String tanggal ISO (contoh: "2025-05-05T22:40:46.725Z")
 * @param withTime - Tampilkan waktu (default: false)
 * @returns String format "5 Mei 2025" atau "5 Mei 2025, 22:40 WIB"
 */
export function FormatTanggal(
  isoDate: string | Date,
  withTime: boolean = false
): string {
  // Daftar nama bulan dalam Bahasa Indonesia
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(isoDate);

  // Validasi tanggal
  if (isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  // Komponen tanggal dengan penyesuaian timezone WIB (UTC+7)
  const offsetWIB = 7 * 60 * 60 * 1000; // Offset WIB dalam milidetik
  const dateWIB = new Date(date.getTime() + offsetWIB);

  const hari = dateWIB.getUTCDate();
  const bulanIndex = dateWIB.getUTCMonth();
  const tahun = dateWIB.getUTCFullYear();
  const jam = dateWIB.getUTCHours().toString().padStart(2, "0");
  const menit = dateWIB.getUTCMinutes().toString().padStart(2, "0");

  // Format dasar
  let formattedDate = `${hari} ${bulan[bulanIndex]} ${tahun}`;

  // Tambahkan waktu jika diperlukan
  if (withTime) {
    formattedDate += `, ${jam}:${menit} WIB`;
  }

  return formattedDate;
}
