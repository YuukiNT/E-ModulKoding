/* detektif.js — game "Detektif Debugging": 5 kasus kode bermasalah dari materi Pertemuan 3. */

const DET_CASES = [
  {
    code: 'nilai = 80\nif nilai >= 75\n    print("Lulus")',
    q: 'Kode ini gagal dijalankan sama sekali. Jenis bug-nya adalah...',
    opts: ['Syntax Error — lupa tanda titik dua (:)', 'Logic Error — hasil salah', 'Tidak ada bug'],
    answer: 0
  },
  {
    code: 'total = 5\nrata = total / 0\nprint(rata)',
    q: 'Program berhenti mendadak saat dijalankan karena pembagian dengan nol. Jenis bug-nya adalah...',
    opts: ['Syntax Error', 'Runtime Error', 'Logic Error'],
    answer: 1
  },
  {
    code: 'harga = 10000\ndiskon = 20\nharga_akhir = harga - diskon\nprint(harga_akhir)',
    q: 'Program berjalan lancar tanpa pesan error, tapi harga_akhir seharusnya dipotong 20% bukan dikurangi 20 rupiah. Jenis bug-nya adalah...',
    opts: ['Syntax Error', 'Runtime Error', 'Logic Error — logika perhitungan salah'],
    answer: 2
  },
  {
    code: 'def sapa(nama)\n    print("Halo", nama)',
    q: 'Muncul error saat program dijalankan karena definisi fungsi tidak lengkap. Apa yang kurang?',
    opts: ['Titik dua (:) setelah tanda kurung parameter', 'Kata kunci "return"', 'Tidak ada yang kurang'],
    answer: 0
  },
  {
    code: 'daftar = [1, 2, 3]\nprint(daftar[5])',
    q: 'Program berhenti dengan pesan error saat mengakses index yang tidak ada di dalam list. Jenis bug-nya adalah...',
    opts: ['Syntax Error', 'Runtime Error — index di luar jangkauan', 'Logic Error'],
    answer: 1
  }
];

let detIndex = 0;
let detAnswered = new Array(DET_CASES.length).fill(false);
let detSolved = 0;

function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function detToast(msg){
  const t = document.getElementById('detToast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2000);
}

function renderCase(){
  const c = DET_CASES[detIndex];
  const area = document.getElementById('caseArea');
  area.innerHTML = `
    <div class="case-card">
      <div class="case-tag">Kasus ${detIndex+1} dari ${DET_CASES.length}</div>
      <pre class="det-code">${escapeHtml(c.code)}</pre>
      <p class="case-q">${c.q}</p>
      ${c.opts.map((o,i)=>`<label class="det-opt"><input type="radio" name="detOpt" value="${i}"> ${o}</label>`).join('')}
      <button class="det-btn yellow" id="btnSubmitCase">🔍 Ajukan Jawaban</button>
      <div class="det-feedback" id="caseFeedback"></div>
    </div>`;
  document.getElementById('btnSubmitCase').addEventListener('click', () => {
    const selected = area.querySelector('input[name="detOpt"]:checked');
    const fb = document.getElementById('caseFeedback');
    if(!selected){ fb.textContent = 'Pilih salah satu jawaban dulu.'; fb.className='det-feedback bad'; return; }
    area.querySelectorAll('.det-opt').forEach(l=>l.classList.remove('correct','wrong'));
    const correctLabel = area.querySelectorAll('.det-opt')[c.answer];
    if(parseInt(selected.value) === c.answer){
      selected.closest('.det-opt').classList.add('correct');
      fb.textContent = '✅ Kasus terpecahkan!'; fb.className='det-feedback ok';
      if(!detAnswered[detIndex]){
        detSolved++;
        detAnswered[detIndex] = true;
        document.getElementById('caseScore').textContent = detSolved;
        if(window.setDetektifKasusSelesai) setDetektifKasusSelesai(detSolved);
        detToast('🎖️ Kasus ' + (detIndex+1) + ' terpecahkan! (' + detSolved + '/' + DET_CASES.length + ')');
      }
    } else {
      selected.closest('.det-opt').classList.add('wrong');
      correctLabel.classList.add('correct');
      fb.textContent = '❌ Belum tepat, lihat jawaban yang benar (hijau).'; fb.className='det-feedback bad';
    }
    if(detSolved >= DET_CASES.length) showDetSummary();
  });
}

function showDetSummary(){
  const summary = document.getElementById('detSummary');
  if(!summary) return;
  summary.classList.add('show');
  summary.innerHTML = `
    <div class="big">🏆 5/5</div>
    <p>Semua kasus berhasil dipecahkan! Kamu resmi jadi Detektif Debugging.</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if(!document.getElementById('caseArea')) return;
  renderCase();
  document.getElementById('btnNextCase').addEventListener('click', ()=>{ detIndex = (detIndex+1) % DET_CASES.length; renderCase(); });
  document.getElementById('btnPrevCase').addEventListener('click', ()=>{ detIndex = (detIndex-1+DET_CASES.length) % DET_CASES.length; renderCase(); });

  // Muat progres kasus yang sudah terpecahkan sebelumnya (jika ada)
  if(window.getProgress){
    const p = getProgress();
    detSolved = p.detektifKasusSelesai || 0;
    document.getElementById('caseScore').textContent = detSolved;
    if(detSolved >= DET_CASES.length) showDetSummary();
  }
});
