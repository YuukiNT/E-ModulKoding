/* quiz.js — 10 soal diambil dari bank soal asesmen sumatif Modul Ajar Bab 2 (kunci jawaban asli). */

const QUIZ_DATA = [
  { q:'Percabangan di dalam percabangan lain pada struktur logika pemrograman disebut...', opts:['Nested if','Nested loop','Comparison chaining','Modular function'], answer:0 },
  { q:'Pengulangan yang ditempatkan di dalam perulangan lainnya dinamakan...', opts:['Single loop','Nested loop','Break loop','Loop function'], answer:1 },
  { q:'nilai = 80; if nilai >= 75: print("Lulus") — hasil keluaran dari kode tersebut adalah...', opts:['Tidak Lulus','Perlu Evaluasi','Lulus','Error'], answer:2 },
  { q:'Metode list Python untuk menambahkan data baru ke baris paling akhir adalah...', opts:['.remove()','.pop()','.append()','.sort()'], answer:2 },
  { q:'Ekspresi comparison chaining 80 <= nilai <= 90 sama artinya dengan...', opts:['nilai >= 80 or nilai <= 90','nilai >= 80 and nilai <= 90','nilai == 80 and nilai == 90','nilai < 80 and nilai > 90'], answer:1 },
  { q:'Kata kunci untuk mendefinisikan sebuah fungsi dalam Python adalah...', opts:['function','def','create','void'], answer:1 },
  { q:'Strategi pemrograman yang selalu memilih langkah terbaik di setiap tahap tanpa melihat keseluruhan hasil akhir dinamakan...', opts:['Divide and Conquer','Algoritma Greedy','Binary Search','Recursion'], answer:1 },
  { q:'Prinsip kerja antrean di mana data yang pertama masuk akan dilayani/keluar pertama disebut...', opts:['LIFO (Last In First Out)','FIFO (First In First Out)','Random Access','Binary Search'], answer:1 },
  { q:'Kesalahan penulisan aturan sintaks kode program (misal lupa tanda titik dua) dikategorikan sebagai...', opts:['Logic Error','Syntax Error','Hardware Error','Network Error'], answer:1 },
  { q:'Program dapat berjalan tanpa pesan error tetapi menghasilkan keluaran yang salah — ini dinamakan...', opts:['Syntax Error','Logic Error','Runtime Error','System Error'], answer:1 },
];

let currentIndex = 0;
let userAnswers = new Array(QUIZ_DATA.length).fill(null);

function renderQuizQuestion(){
  const box = document.getElementById('quizBox');
  const item = QUIZ_DATA[currentIndex];
  const optsHtml = item.opts.map((opt, i) => `
    <label class="opt-label ${userAnswers[currentIndex] === i ? 'selected' : ''}">
      <input type="radio" name="quizOpt" value="${i}" ${userAnswers[currentIndex] === i ? 'checked' : ''}>
      ${opt}
    </label>`).join('');

  box.innerHTML = `
    <div class="eyebrow">Soal ${currentIndex + 1} dari ${QUIZ_DATA.length}</div>
    <p class="qtext" style="font-weight:600; font-size:15.5px; margin:10px 0 14px 0;">${item.q}</p>
    ${optsHtml}
  `;

  box.querySelectorAll('input[name="quizOpt"]').forEach(inp => {
    inp.addEventListener('change', () => {
      userAnswers[currentIndex] = parseInt(inp.value);
    });
  });

  document.getElementById('quizProgressText').textContent = `${currentIndex + 1} / ${QUIZ_DATA.length}`;
  document.getElementById('quizProgressFill').style.width = `${((currentIndex + 1) / QUIZ_DATA.length) * 100}%`;
  document.getElementById('btnPrev').disabled = currentIndex === 0;
  document.getElementById('btnNext').style.display = currentIndex === QUIZ_DATA.length - 1 ? 'none' : 'inline-flex';
  document.getElementById('btnFinish').style.display = currentIndex === QUIZ_DATA.length - 1 ? 'inline-flex' : 'none';
}

function finishQuiz(){
  let benar = 0;
  QUIZ_DATA.forEach((item, i) => { if(userAnswers[i] === item.answer) benar++; });
  const total = QUIZ_DATA.length;
  const pct = Math.round((benar/total) * 100);

  if(window.setKuisSkor) setKuisSkor(benar, total);

  let feedback = 'Jangan menyerah. Pelajari kembali materi dan coba kuis lagi.';
  if(pct >= 90) feedback = 'Sangat baik! Pemahamanmu sudah sangat bagus.';
  else if(pct >= 80) feedback = 'Bagus! Tinggal sedikit lagi untuk lebih menguasai materi.';
  else if(pct >= 70) feedback = 'Cukup baik. Coba pelajari kembali bagian yang masih belum dipahami.';

  document.getElementById('quizArea').style.display = 'none';
  const result = document.getElementById('quizResult');
  result.style.display = 'block';
  result.innerHTML = `
    <div class="eyebrow">Kuis Selesai 🎉</div>
    <h2 class="title" style="font-size:26px; margin:8px 0;">Nilai: ${pct}</h2>
    <p>Benar: <strong>${benar}</strong> &nbsp;·&nbsp; Salah: <strong>${total - benar}</strong></p>
    <p style="color:var(--ink-soft);">${feedback}</p>
    <button class="btn" id="btnRetry">↻ Ulangi Kuis</button>
    <a class="btn ghost" href="evaluasi.html" style="margin-left:8px;">Lihat Progres</a>
  `;
  document.getElementById('btnRetry').addEventListener('click', () => {
    currentIndex = 0;
    userAnswers = new Array(QUIZ_DATA.length).fill(null);
    document.getElementById('quizArea').style.display = 'block';
    result.style.display = 'none';
    renderQuizQuestion();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if(!document.getElementById('quizBox')) return;
  renderQuizQuestion();
  document.getElementById('btnPrev').addEventListener('click', () => { currentIndex--; renderQuizQuestion(); });
  document.getElementById('btnNext').addEventListener('click', () => { currentIndex++; renderQuizQuestion(); });
  document.getElementById('btnFinish').addEventListener('click', finishQuiz);
});
