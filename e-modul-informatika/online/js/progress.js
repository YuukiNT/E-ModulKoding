/* progress.js — menyimpan & menampilkan progres belajar siswa via localStorage.
   Struktur mengikuti Modul Ajar Bab 2: 3 pertemuan + kuis + kasus Detektif Debugging.
   Tidak menyimpan data pribadi/sensitif. */

const BAB_LIST = [
  { id:'p1', title:'Pertemuan 1 — Struktur Logika Kompleks' },
  { id:'p2', title:'Pertemuan 2 — Kasir Cerdas & Strategi Algoritma' },
  { id:'p3', title:'Pertemuan 3 — Pengenalan Debugging' },
];

const PROGRESS_KEY = 'emodul_koding_ai_progress_v1';

function getProgress(){
  try{
    const raw = localStorage.getItem(PROGRESS_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){ /* localStorage tidak tersedia, lanjut dengan default */ }
  return { bab:{}, kuisSkor:null, kuisBenar:0, kuisTotal:0, latihanSelesai:{}, refleksi:{}, detektifKasusSelesai:0, detektifTotalKasus:5 };
}

function saveProgress(data){
  try{ localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }catch(e){ /* abaikan jika gagal */ }
}

function setBabSelesai(babId){
  const p = getProgress();
  p.bab[babId] = true;
  saveProgress(p);
}

function setKuisSkor(benar, total){
  const p = getProgress();
  p.kuisBenar = benar; p.kuisTotal = total;
  p.kuisSkor = Math.round((benar/total)*100);
  saveProgress(p);
}

function setLatihanSelesai(latihanId){
  const p = getProgress();
  p.latihanSelesai[latihanId] = true;
  saveProgress(p);
}

function setRefleksi(babId, teks){
  const p = getProgress();
  p.refleksi[babId] = teks;
  saveProgress(p);
}

function setDetektifKasusSelesai(jumlahKasusBenar){
  const p = getProgress();
  p.detektifKasusSelesai = Math.max(p.detektifKasusSelesai || 0, jumlahKasusBenar);
  saveProgress(p);
}

function hitungTotalProgres(){
  const p = getProgress();
  const babDone = BAB_LIST.filter(b => p.bab[b.id]).length;
  const babPct = Math.round((babDone / BAB_LIST.length) * 40);     // materi 3 pertemuan = 40% bobot
  const kuisPct = p.kuisSkor ? Math.round((p.kuisSkor/100) * 30) : 0; // kuis = 30% bobot
  const detektifPct = Math.round(((p.detektifKasusSelesai || 0) / (p.detektifTotalKasus || 5)) * 30); // detektif = 30% bobot
  return Math.min(100, babPct + kuisPct + detektifPct);
}

function renderProgressBars(container){
  const el = document.querySelector(container);
  if(!el) return;
  const p = getProgress();
  let html = '';
  BAB_LIST.forEach(b => {
    const done = !!p.bab[b.id];
    html += `
      <div class="progress-item">
        <div class="label"><span>${b.title}</span><span>${done ? '100%' : '0%'}</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${done ? 100 : 0}%"></div></div>
      </div>`;
  });
  const detektifPct = Math.round(((p.detektifKasusSelesai || 0) / (p.detektifTotalKasus || 5)) * 100);
  html += `
    <div class="progress-item">
      <div class="label"><span>🕵️ Kasus Detektif Debugging</span><span>${p.detektifKasusSelesai || 0}/${p.detektifTotalKasus || 5}</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${detektifPct}%"></div></div>
    </div>`;
  const total = hitungTotalProgres();
  html += `<div class="progress-total">Total progres belajar: ${total}%</div>`;
  if(p.kuisSkor !== null){
    html += `<div class="progress-total" style="font-weight:400; color:var(--ink-soft);">Nilai kuis terakhir: ${p.kuisSkor} (${p.kuisBenar}/${p.kuisTotal} benar)</div>`;
  }
  el.innerHTML = html;
}
window.renderProgressBars = renderProgressBars;
window.setBabSelesai = setBabSelesai;
window.setKuisSkor = setKuisSkor;
window.setLatihanSelesai = setLatihanSelesai;
window.setRefleksi = setRefleksi;
window.setDetektifKasusSelesai = setDetektifKasusSelesai;
window.getProgress = getProgress;
window.BAB_LIST = BAB_LIST;
