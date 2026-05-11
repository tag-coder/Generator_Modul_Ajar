/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  User, 
  School, 
  Clock, 
  Brain,
  Smile,
  Heart,
  ChevronRight,
  Info,
  RefreshCw,
  Printer
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateRPP, type RPPParams } from "./services/geminiService";
import { cn } from "./lib/utils";
import { DIMENSIONS, DEEP_LEARNING_ELEMENTS } from "./constants";

export default function App() {
  const [params, setParams] = useState<RPPParams>({
    schoolName: "",
    teacherName: "",
    subject: "",
    grade: "X",
    major: "",
    topic: "",
    timeAllocation: "2 x 45 Menit",
    hoursPerDay: "2",
    dimensions: [],
    deepLearningElements: ["mindfull", "meaningfull", "joyfull"],
    learningObjectives: "",
    learningCompetency: "",
    location: "",
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    principalName: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleToggleDimension = (dim: string) => {
    setParams(prev => ({
      ...prev,
      dimensions: prev.dimensions.includes(dim)
        ? prev.dimensions.filter(d => d !== dim)
        : prev.dimensions.length < 8 
          ? [...prev.dimensions, dim]
          : prev.dimensions
    }));
  };

  const handleToggleElement = (id: string) => {
    setParams(prev => ({
      ...prev,
      deepLearningElements: prev.deepLearningElements.includes(id)
        ? prev.deepLearningElements.filter(e => e !== id)
        : [...prev.deepLearningElements, id]
    }));
  };

  const handleGenerate = async () => {
    if (!params.subject || !params.topic || !params.learningObjectives || !params.learningCompetency) {
      alert("Harap isi mata pelajaran, topik, Capaian Pembelajaran, dan Tujuan Pembelajaran.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const rpp = await generateRPP(params);
      setResult(rpp || "Gagal menghasilkan RPP. Silakan coba lagi.");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    if (!result || !resultRef.current) return;
    
    const content = resultRef.current.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>RPP</title>"+
            "<style>"+
            "table { border-collapse: collapse; width: 100%; margin-bottom: 20px; } "+
            "th, td { border: 1px solid #000; padding: 8px; text-align: left; font-family: 'Times New Roman', serif; font-size: 11pt; } "+
            "h1, h2, h3 { font-family: 'Times New Roman', serif; } "+
            "p, li { font-family: 'Times New Roman', serif; font-size: 11pt; } "+
            "</style>"+
            "</head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'RPP_Deep_Learning.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">EduGen SMK</h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Modul Ajar Deep Learning</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="hidden sm:inline">Kurikulum Deep Learning SMK</span>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <a href="#" className="hover:text-indigo-600 transition-colors">Panduan DPL</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Input Form */}
        <section className="lg:col-span-5 space-y-8 print:hidden">
          <header className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">RPP Generator</h2>
            <p className="text-slate-500">Generator Modul Ajar berbasis Deep Learning (Mindful, Meaningful, Joyful) khusus SMK.</p>
          </header>

          <div className="space-y-6">
            {/* Identity Group */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold border-b border-slate-50 pb-3">
                <Info size={18} />
                <span>Informasi Umum Modul</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <School size={12} /> Instansi/Sekolah
                  </label>
                  <input 
                    type="text" 
                    placeholder="SMK Negeri 1..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.schoolName}
                    onChange={e => setParams({...params, schoolName: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Guru Mapel/Produktif
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.teacherName}
                    onChange={e => setParams({...params, teacherName: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Kepala Sekolah
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nama Kepala Sekolah"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.principalName}
                    onChange={e => setParams({...params, principalName: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen size={12} /> Mata Pelajaran
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Dasar-dasar DKV"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.subject}
                    onChange={e => setParams({...params, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap size={12} /> Kelas
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.grade}
                    onChange={e => setParams({...params, grade: e.target.value})}
                  >
                    <option value="X">X (Sepuluh)</option>
                    <option value="XI">XI (Sebelas)</option>
                    <option value="XII">XII (Duabelas)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen size={12} /> Konsentrasi Keahlian
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: TSM / TKJ / DKV"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.major}
                    onChange={e => setParams({...params, major: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Materi Utama</label>
                  <input 
                    type="text" 
                    placeholder="Topik atau Judul Modul"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.topic}
                    onChange={e => setParams({...params, topic: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} /> Total Alokasi (JP)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 12 x 45 Menit"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.timeAllocation}
                    onChange={e => setParams({...params, timeAllocation: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} /> JP Per Tatap Muka
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.hoursPerDay}
                    onChange={e => setParams({...params, hoursPerDay: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kota/Kabupaten</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Malang"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.location}
                    onChange={e => setParams({...params, location: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Modul</label>
                  <input 
                    type="text" 
                    placeholder="11 Mei 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.date}
                    onChange={e => setParams({...params, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Dimensions Group */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                  <Sparkles size={18} />
                  <span>8 Dimensi Profil Lulusan (DPL)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">
                  Deep Learning
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {DIMENSIONS.map((dim) => (
                  <button
                    key={dim}
                    onClick={() => handleToggleDimension(dim)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl border text-left text-sm transition-all duration-200 group",
                      params.dimensions.includes(dim)
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-medium"
                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        params.dimensions.includes(dim) 
                        ? "bg-indigo-600 border-indigo-600" 
                        : "border-slate-200 group-hover:border-slate-400"
                      )}>
                        {params.dimensions.includes(dim) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      {dim}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deep Learning Elements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-semibold border-b border-slate-50 pb-3">
                <Brain size={18} />
                <span>Pilar Deep Learning</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {DEEP_LEARNING_ELEMENTS.map(({ id, label, icon: Icon, description }) => (
                  <button
                    key={id}
                    onClick={() => handleToggleElement(id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border text-left transition-all",
                      params.deepLearningElements.includes(id)
                        ? "bg-rose-50 border-rose-100 text-rose-900"
                        : "bg-white border-slate-100 text-slate-600 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl",
                      params.deepLearningElements.includes(id) ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Icon size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm">{label}</div>
                      <p className="text-[11px] leading-tight text-rose-800/60">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CP & TP Group */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold border-b border-slate-50 pb-3">
                  <FileText size={18} />
                  <span>Capaian & Tujuan</span>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capaian Pembelajaran (CP)</label>
                  <textarea 
                    placeholder="Tuliskan Capaian Pembelajaran dari Kurikulum. Contoh: Pada akhir fase E, peserta didik mampu menggunakan prinsip dasar desain..."
                    className="w-full min-h-[100px] p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.learningCompetency}
                    onChange={e => setParams({...params, learningCompetency: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tujuan Pembelajaran (TP)</label>
                  <textarea 
                    placeholder="Tuliskan tujuan pembelajaran spesifik. Contoh: Siswa dapat menganalisis perbedaan jenis typeface..."
                    className="w-full min-h-[100px] p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-hidden text-sm"
                    value={params.learningObjectives}
                    onChange={e => setParams({...params, learningObjectives: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative w-full bg-slate-900 overflow-hidden text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={24} />
                    <span>Menyusun RPP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="group-hover:scale-125 transition-transform" />
                    <span>Generasi RPP Sekarang</span>
                  </>
                )}
              </div>
              <motion.div 
                className="absolute inset-0 bg-indigo-600 translate-y-full"
                animate={{ translateY: isGenerating ? 0 : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </section>

        {/* Right column: Preview Area */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2 print:hidden">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Pratinjau RPP
              {!result && <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-500 rounded-md font-bold uppercase">Kosong</span>}
            </h3>
            <div className="flex items-center gap-2">
              {result && (
                <>
                  <button 
                    onClick={handleCopy}
                    title="Salin Teks"
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    <span className="hidden lg:inline">{copied ? "Tersalin" : "Salin"}</span>
                  </button>
                  <button 
                    onClick={handleDownloadWord}
                    title="Download Word (.doc)"
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Download size={18} />
                    <span className="hidden lg:inline">Word</span>
                  </button>
                  <button 
                    onClick={handlePrint}
                    title="Cetak / Save PDF"
                    className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-indigo-100"
                  >
                    <Printer size={18} />
                    <span className="hidden lg:inline">Cetak / PDF</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div 
            ref={resultRef}
            className={cn(
              "relative min-h-[600px] w-full bg-white rounded-3xl shadow-2xl shadow-indigo-50/50 border border-slate-100 overflow-hidden transition-all duration-500 p-8 sm:p-12",
              isGenerating && "opacity-50 grayscale-50 backdrop-blur-sm pointer-events-none"
            )}
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
            
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center space-y-6 text-center"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute -inset-4 border-2 border-dashed border-indigo-200 rounded-full"
                    />
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                      <RefreshCw size={40} className="animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h4 className="text-xl font-bold text-slate-800">Cerdas Berpikir...</h4>
                    <p className="text-slate-400 text-sm">AI sedang meramu strategi pembelajaran SMK dengan pendekatan Mindful, Meaningful, dan Joyful.</p>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full bg-indigo-400"
                      />
                    ))}
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-slate prose-indigo max-w-none prose-sm sm:prose-base !text-slate-800"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center space-y-6 text-center opacity-40 select-none grayscale"
                >
                  <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 rotate-3">
                    <FileText size={64} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-400">Belum Ada RPP</p>
                    <p className="text-slate-300 text-sm sm:text-base max-w-xs px-4">
                      Isi detail di samping dan klik tombol "Generasi" untuk hasilkan RPP Deep Learning.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mindfull</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meaningfull</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joyfull</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-3xl bg-amber-50 border border-amber-100 print:hidden">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200">
              <Info size={24} />
            </div>
            <div>
              <h5 className="font-bold text-amber-900">Tips Kustomisasi</h5>
              <p className="text-sm text-amber-800/70">Setelah generasikan RPP, Anda dapat menyalinnya ke Microsoft Word atau Google Docs untuk kustomisasi font dan logo sekolah yang lebih spesifik.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 py-12 border-t border-slate-100 print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="bg-slate-600 p-1.5 rounded-lg text-white">
              <GraduationCap size={16} />
            </div>
            <span className="font-bold text-sm">EduGen SMK © 2026</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Syarat Penggunaan</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Dokumentasi API</a>
          </div>
        </div>
      </footer>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .prose {
            font-size: 11pt !important;
            color: black !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
        .prose h1 { font-size: 1.5rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem; color: #1e293b; }
        .prose h2 { font-size: 1.25rem; margin-top: 1.5rem; color: #334155; }
        .prose h3 { font-size: 1.1rem; margin-top: 1.25rem; color: #475569; }
        .prose table { border: 1px solid #e2e8f0; border-collapse: collapse; width: 100%; border-radius: 8px; overflow: hidden; }
        .prose th { background: #f8fafc; padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left; font-weight: 700; color: #1e293b; }
        .prose td { padding: 0.75rem; border: 1px solid #e2e8f0; vertical-align: top; }
        .prose strong { color: #1e1b4b; font-weight: 700; }
        .prose ul, .prose ol { padding-left: 1.25rem; }
        .prose li { margin-bottom: 0.25rem; }
        .markdown-body { background: transparent !important; }
      `}</style>
    </div>
  );
}
