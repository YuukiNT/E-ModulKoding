/* flashcard.js — 16 istilah kunci Bab 2, dengan tracking status hafal via localStorage */

const FLASHCARD_DATA = [
  { term:'Nested If', def:'Percabangan if yang diletakkan di dalam percabangan if lain — dipakai saat ada lebih dari satu syarat yang harus dicek berurutan.' },
  { term:'Nested Loop', def:'Perulangan (for/while) yang diletakkan di dalam perulangan lain — perulangan dalam berjalan penuh dulu setiap kali perulangan luar melangkah satu kali.' },
  { term:'Comparison Chaining', def:'Jalan pintas Python untuk mengecek rentang nilai sekaligus, contoh: 80 <= nilai <= 90, tanpa perlu menulis "and" dua kali.' },
  { term:'.append()', def:'Metode list untuk menambahkan satu data baru ke posisi paling akhir/belakang.' },
  { term:'.sort()', def:'Metode list untuk mengurutkan seluruh elemen di dalamnya (angka dari kecil ke besar, teks dari A ke Z).' },
  { term:'.pop()', def:'Metode list untuk mengambil sekaligus menghapus satu data — .pop(0) mengambil data paling depan.' },
  { term:'.remove()', def:'Metode list untuk menghapus satu data tertentu berdasarkan isinya (bukan posisinya).' },
  { term:'def & return', def:'def dipakai untuk membuat fungsi baru; return dipakai untuk mengirim balik hasil dari dalam fungsi ke luar.' },
  { term:'Parameter & Argumen', def:'Parameter adalah "lubang input" pada definisi fungsi; argumen adalah nilai asli yang dimasukkan saat fungsi itu dipanggil.' },
  { term:'FIFO', def:'First In First Out — prinsip antrean di mana data/orang yang pertama masuk adalah yang pertama dilayani/keluar.' },
  { term:'Algoritma Greedy', def:'Strategi yang selalu memilih langkah terbaik/terbesar di setiap tahap tanpa memikirkan jauh ke depan — contohnya menentukan kembalian uang dengan lembar paling sedikit.' },
  { term:'Syntax Error', def:'Kesalahan penulisan aturan bahasa pemrograman, seperti lupa tanda titik dua (:) — program bahkan tidak bisa mulai dijalankan.' },
  { term:'Runtime Error', def:'Kesalahan yang membuat program berhenti di tengah jalan saat dijalankan, misalnya membagi dengan angka nol.' },
  { term:'Logic Error', def:'Kesalahan logika — program berjalan lancar tanpa pesan error sama sekali, tapi hasilnya ternyata salah.' },
  { term:'Traceback', def:'Pesan yang ditampilkan Python saat terjadi error, berisi petunjuk baris dan jenis kesalahan yang terjadi.' },
  { term:'try-except', def:'Blok kode untuk menangani error supaya program tidak langsung berhenti total, tapi memberi pesan alternatif dan tetap lanjut.' },
];

const FC_KEY = 'emodul_flashcard_hafal_v1';
let fcOrder = FLASHCARD_DATA.map((_, i) => i);
let fcIndex = 0;

function getHafalSet(){
  try{
    const raw = localStorage.getItem(FC_KEY);
    if(raw) return new Set(JSON.parse(raw));
  }catch(e){}
  return new Set();
}
function saveHafalSet(set){
  try{ localStorage.setItem(FC_KEY, JSON.stringify([...set])); }catch(e){}
}
let hafalSet = getHafalSet();

function renderCard(){
  const idx = fcOrder[fcIndex];
  const item = FLASHCARD_DATA[idx];
  document.getElementById('fcTerm').textContent = item.term;
  document.getElementById('fcDef').textContent = item.def;
  document.getElementById('fcCard').classList.remove('flipped');
  document.getElementById('fcPosisi').textContent = fcIndex + 1;
  document.getElementById('fcTotal').textContent = FLASHCARD_DATA.length;
  document.getElementById('fcHafalCount').textContent = hafalSet.size;
  document.getElementById('fcProgressFill').style.width = (hafalSet.size / FLASHCARD_DATA.length * 100) + '%';
  document.getElementById('fcTagFront').textContent = hafalSet.has(idx) ? 'ISTILAH · ✅ HAFAL' : 'ISTILAH';
}

document.getElementById('fcCard').addEventListener('click', () => {
  document.getElementById('fcCard').classList.toggle('flipped');
});

document.getElementById('fcNext').addEventListener('click', () => {
  fcIndex = (fcIndex + 1) % fcOrder.length;
  renderCard();
});
document.getElementById('fcPrev').addEventListener('click', () => {
  fcIndex = (fcIndex - 1 + fcOrder.length) % fcOrder.length;
  renderCard();
});
document.getElementById('fcShuffle').addEventListener('click', () => {
  fcOrder = fcOrder.sort(() => Math.random() - 0.5);
  fcIndex = 0;
  renderCard();
  if(window.showToast) showToast('Urutan kartu diacak 🔀');
});

document.getElementById('fcHafal').addEventListener('click', () => {
  hafalSet.add(fcOrder[fcIndex]);
  saveHafalSet(hafalSet);
  renderCard();
  if(window.showToast) showToast('✅ Ditandai sudah hafal!');
});
document.getElementById('fcBelum').addEventListener('click', () => {
  hafalSet.delete(fcOrder[fcIndex]);
  saveHafalSet(hafalSet);
  renderCard();
});
document.getElementById('fcReset').addEventListener('click', () => {
  hafalSet = new Set();
  saveHafalSet(hafalSet);
  renderCard();
  if(window.showToast) showToast('Progres hafalan direset.');
});

renderCard();
