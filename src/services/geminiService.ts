import { GoogleGenAI } from "@google/genai";
import { DEEP_LEARNING_ELEMENTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface RPPParams {
  schoolName: string;
  teacherName: string;
  subject: string;
  grade: string;
  major: string;
  topic: string;
  timeAllocation: string;
  dimensions: string[];
  deepLearningElements: string[];
  learningObjectives: string;
  learningCompetency: string;
  hoursPerDay: string;
  location: string;
  date: string;
  principalName: string;
}

export async function generateRPP(params: RPPParams) {
  const dlElements = params.deepLearningElements.map(id => {
    return DEEP_LEARNING_ELEMENTS.find(e => e.id === id)?.label || id;
  }).join(", ");

  const prompt = `
    Anda adalah Pakar Kurikulum SMK dan Pedagogi DEEP LEARNING (Mindful, Meaningful, Joyful).
    Buatkan MODUL AJAR (Bukan sekadar RPP administratif) yang SANGAT DETAIL, PROFESIONAL, dan RAPI untuk jenjang SMK.
    PENTING: Gunakan istilah "Dimensi Profil Lulusan (DPL)" dalam konteks Deep Learning, JANGAN gunakan istilah P5 atau Kurikulum Merdeka lama.

    INFORMASI UTAMA:
    - Instansi/Sekolah: ${params.schoolName}
    - Nama Guru: ${params.teacherName}
    - Nama Kepala Sekolah: ${params.principalName}
    - Mata Pelajaran: ${params.subject}
    - Kelas: ${params.grade}
    - Jurusan/Konsentrasi: ${params.major}
    - Pokok Bahasan/Judul Modul: ${params.topic}
    - Total Alokasi Waktu: ${params.timeAllocation}
    - Jam Tatap Muka Per Hari: ${params.hoursPerDay} JP
    - Lokasi: ${params.location}
    - Tanggal: ${params.date}

    STRUKTUR MODUL AJAR DEEP LEARNING (PANDUAN WAJIB):
    
    1. INFORMASI UMUM (BUAT DALAM TABEL RAPI):
       Susun Identitas Modul secara elegan.

    2. DIMENSI PROFIL LULUSAN (DPL):
       Integrasikan Dimensi: ${params.dimensions.join(", ")} ke dalam skenario pembelajaran.

    3. KOMPETENSI AWAL & PRASYARAT.

    4. CAPAIAN PEMBELAJARAN (CP): Berdasarkan input user: "${params.learningCompetency}".

    5. TUJUAN PEMBELAJARAN (TP): Berdasarkan input user: "${params.learningObjectives}".

    6. PEMAHAMAN BERMAKNA (MEANINGFUL LEARNING): Hubungkan materi dengan dunia kerja/industri nyata.

    7. PERTANYAAN PEMANTIK (MINDFUL TRIGGERS).

    8. KEGIATAN PEMBELAJARAN (WAJIB DALAM TABEL DETAIL):
       - LOGIKA PEMBAGIAN HARI: Jika Total Alokasi Waktu adalah (X) JP dan Tatap Muka Per Hari adalah (${params.hoursPerDay}) JP, maka bagi menjadi (X/${params.hoursPerDay}) hari/pertemuan.
       - Buatlah tabel untuk SETIAP HARI/PERTEMUAN dengan kolom [Tahap], [Aktivitas Deep Learning], dan [Alokasi Waktu].
       - Setiap pertemuan harus mencakup PENDAHULUAN (Mindful Awareness), KEGIATAN INTI (Meaningful Exploration), dan PENUTUP (Joyful Reflection).

    9. ASESMEN (WAJIB DALAM TABEL RAPI).

    10. PENGAYAAN & REMEDIAL.

    11. REFLEKSI GURU & PESERTA DIDIK.

    12. LEMBAR PENGESAHAN (MAKSIMALKAN KERAPIAN TABEL).
        
        | | |
        | :--- | :--- |
        | Mengetahui, | ${params.location}, ${params.date} |
        | Kepala Sekolah, | Guru Mata Pelajaran, |
        | | |
        | | |
        | **${params.principalName || "(.........................)"}** | **${params.teacherName}** |
        | NIP. ......................... | NIP. ......................... |

    CATATAN KHUSUS:
    - Dominasi konten harus pada elemen MINDFUL, MEANINGFUL, dan JOYFUL.
    - Pastikan relevansi SMK sangat kuat (Dunia Kerja, Budaya Kerja).
    - Gunakan Markdown yang konsisten untuk keterbacaan yang sempurna.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating RPP:", error);
    throw error;
  }
}
