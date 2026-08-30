/* latihan.js — latihan bervariasi sesuai 3 pertemuan Modul Ajar Bab 2. */

const LATIHAN_DATA = [
  { id:'l1', bab:'p1', type:'pg', q:'Percabangan di dalam percabangan lain disebut...',
    opts:['Nested if', 'Single loop', 'Comparison chaining'], answer:0 },
  { id:'l2', bab:'p1', type:'prediksi', q:'Prediksi output Python: nilai = 92; if 80 <= nilai <= 90: print("Sedang") elif nilai > 90: print("Tinggi")',
    opts:['Sedang', 'Tinggi', 'Tidak ada output'], answer:1 },
  { id:'l3', bab:'p1', type:'pg', q:'Metode list Python .sort() digunakan untuk...',
    opts:['Menghapus item terakhir', 'Mengurutkan elemen list', 'Menambah item baru'], answer:1 },
  { id:'l4', bab:'p1', type:'benar-salah', q:'Fungsi di Python dibuat dengan kata kunci "def" dan boleh mengembalikan nilai memakai "return".',
    opts:['Benar', 'Salah'], answer:0 },
  { id:'l5', bab:'p2', type:'prediksi', q:'Prediksi output: total = 350000; poin = 0; if total > 500000: poin = 5 elif total > 300000: poin = 3 elif total > 100000: poin = 2; print(poin)',
    opts:['2', '3', '5'], answer:1 },
  { id:'l6', bab:'p2', type:'pg', q:'Strategi algoritma yang selalu memilih langkah terbaik di tiap tahap (misalnya memilih pecahan uang terbesar dulu saat memberi kembalian) disebut...',
    opts:['Divide and Conquer', 'Algoritma Greedy', 'Binary Search'], answer:1 },
  { id:'l7', bab:'p2', type:'benar-salah', q:'Prinsip antrean FIFO berarti data yang terakhir masuk akan dilayani lebih dulu.',
    opts:['Benar', 'Salah'], answer:1 },
  { id:'l8', bab:'p3', type:'pg', q:'Program berhenti saat dijalankan karena membagi dengan angka nol. Ini termasuk jenis kesalahan...',
    opts:['Syntax Error', 'Runtime Error', 'Logic Error'], answer:1 },
  { id:'l9', bab:'p3', type:'perbaiki', q:'Kode berikut error: def sapa(nama)  print("Halo", nama) — apa yang kurang?',
    opts:['Tanda titik dua (:) setelah kurung parameter', 'Kata kunci "return"', 'Tidak ada yang salah'], answer:0 },
  { id:'l10', bab:'p3', type:'pg', q:'Program berjalan lancar tanpa pesan error tapi hasilnya salah. Ini termasuk jenis kesalahan...',
    opts:['Syntax Error', 'Runtime Error', 'Logic Error'], answer:2 },
];

const TYPE_LABEL = { pg:'Pilihan Ganda', 'benar-salah':'Benar / Salah', prediksi:'Prediksi Output', perbaiki:'Perbaiki Kode' };

function renderLatihan(filterBab = 'semua'){
  const wrap = document.getElementById('latihanList');
  if(!wrap) return;
  const items = LATIHAN_DATA.filter(l => filterBab === 'semua' || l.bab === filterBab);
  wrap.innerHTML = items.map(item => `
    <div class="latihan-box" data-id="${item.id}">
      <div class="eyebrow">${TYPE_LABEL[item.type]} · ${window.BAB_LIST ? window.BAB_LIST.find(b=>b.id===item.bab).title : item.bab}</div>
      <p style="font-weight:600; font-size:15px; margin:8px 0 12px 0;">${item.q}</p>
      ${item.opts.map((opt,i) => `
        <label class="opt-label">
          <input type="radio" name="${item.id}" value="${i}"> ${opt}
        </label>`).join('')}
      <div style="margin-top:10px;">
        <button class="btn sm" data-check="${item.id}">Periksa Jawaban</button>
      </div>
      <div class="feedback" data-fb="${item.id}"></div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-check]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-check');
      const item = LATIHAN_DATA.find(l => l.id === id);
      const box = wrap.querySelector(`.latihan-box[data-id="${id}"]`);
      const selected = box.querySelector('input:checked');
      const fb = box.querySelector('[data-fb]');
      box.querySelectorAll('.opt-label').forEach(l => l.classList.remove('correct','wrong'));
      if(!selected){
        fb.textContent = 'Pilih salah satu jawaban dulu ya.';
        fb.className = 'feedback bad';
        return;
      }
      const correctLabel = box.querySelectorAll('.opt-label')[item.answer];
      if(parseInt(selected.value) === item.answer){
        selected.closest('.opt-label').classList.add('correct');
        fb.textContent = '✅ Benar!';
        fb.className = 'feedback ok';
        if(window.setLatihanSelesai) setLatihanSelesai(id);
      } else {
        selected.closest('.opt-label').classList.add('wrong');
        correctLabel.classList.add('correct');
        fb.textContent = '❌ Belum benar. Coba periksa kembali jawaban yang ditandai hijau.';
        fb.className = 'feedback bad';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if(!document.getElementById('latihanList')) return;
  renderLatihan('semua');
  document.querySelectorAll('.tag-row button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tag-row button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLatihan(btn.dataset.bab);
    });
  });
});
