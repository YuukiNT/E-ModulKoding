/* icebreak.js — 3 aktivitas pembuka kelas: Mesin Ajaib, Roda Pertanyaan, Tebak Istilah lewat Emoji. */

/* ===== 1. Mesin Ajaib (analogi fungsi: input -> proses -> output) ===== */
const mesinPairs = {
  '🍎': '🧃', '🥚': '🍳', '🌾': '🍞', '🐄': '🥛', '☕': '😃', '🎵': '💃', '📖': '🧠', '💤': '😴'
};
function initMesin(){
  const row = document.getElementById('mesinSelectRow');
  if(!row) return;
  Object.keys(mesinPairs).forEach(emoji => {
    const btn = document.createElement('button');
    btn.textContent = emoji;
    btn.addEventListener('click', () => {
      row.querySelectorAll('button').forEach(b => b.classList.remove('picked'));
      btn.classList.add('picked');
      document.getElementById('mesinInputSlot').textContent = emoji;
      document.getElementById('mesinOutputSlot').textContent = '❓';
      document.getElementById('mesinBox').dataset.selected = emoji;
    });
    row.appendChild(btn);
  });
}
function prosesMesin(){
  const box = document.getElementById('mesinBox');
  const selected = box.dataset.selected;
  if(!selected){
    if(window.showToast) showToast('Pilih benda dulu di bawah!');
    return;
  }
  box.classList.remove('spin');
  void box.offsetWidth; // restart animasi
  box.classList.add('spin');
  setTimeout(() => {
    document.getElementById('mesinOutputSlot').textContent = mesinPairs[selected] || '✨';
  }, 400);
}

/* ===== 2. Roda Pertanyaan Seru ===== */
const ibQuestions = [
  'Kalau kamu jadi satu baris kode, kamu mau jadi print() atau if/else? Kenapa?',
  'Menurutmu, program apa yang paling sering kamu pakai tanpa sadar itu ada "kode"-nya?',
  'Kalau bug di programmu punya wajah, kira-kira dia terlihat seperti apa?',
  'Sebutkan satu benda di sekitarmu yang bisa "diprogram" biar hidupmu lebih mudah!',
  'Kalau kamu jadi detektif debugging, petunjuk pertama apa yang kamu cari?',
  'Menurutmu, kenapa komputer "bodoh" tapi bisa melakukan hal yang rumit?',
  'Sebutkan satu aplikasi favoritmu — kira-kira ada percabangan (if/else) apa di dalamnya?',
  'Kalau variabel itu kotak, kira-kira apa isi kotak "mood_hari_ini" kamu sekarang?',
];
let ibLastIndex = -1;
function putarPertanyaan(){
  const box = document.getElementById('ibQuestionBox');
  let idx;
  do{ idx = Math.floor(Math.random()*ibQuestions.length); } while(idx === ibLastIndex && ibQuestions.length > 1);
  ibLastIndex = idx;
  box.classList.remove('pop');
  void box.offsetWidth;
  box.textContent = ibQuestions[idx];
  box.classList.add('pop');
}

/* ===== 3. Tebak Istilah Coding lewat Emoji ===== */
const emojiRounds = [
  { clue: '🐛🔍', opts: ['Debugging', 'Looping', 'Variabel'], answer: 0 },
  { clue: '🔁➡️🔁', opts: ['Fungsi', 'Perulangan (Loop)', 'Komentar'], answer: 1 },
  { clue: '📦🏷️', opts: ['Percabangan', 'Variabel', 'Syntax Error'], answer: 1 },
  { clue: '🚦🤔', opts: ['Percabangan (If/Else)', 'List', 'Debugging'], answer: 0 },
  { clue: '🚶🚶🚶➡️🚪', opts: ['Greedy', 'Antrean FIFO', 'Fungsi'], answer: 1 },
];
let emojiIndex = 0;
let emojiScore = 0;
function renderEmojiRound(){
  const r = emojiRounds[emojiIndex];
  document.getElementById('ibEmojiClue').textContent = r.clue;
  document.getElementById('ibEmojiRoundText').textContent = `Ronde ${emojiIndex+1} dari ${emojiRounds.length}`;
  const optsWrap = document.getElementById('ibEmojiOpts');
  optsWrap.innerHTML = '';
  r.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      [...optsWrap.children].forEach(b => b.disabled = true);
      if(i === r.answer){
        btn.classList.add('correct');
        emojiScore++;
      } else {
        btn.classList.add('wrong');
        optsWrap.children[r.answer].classList.add('correct');
      }
      document.getElementById('ibEmojiScore').textContent = emojiScore;
      setTimeout(() => {
        emojiIndex = (emojiIndex + 1) % emojiRounds.length;
        renderEmojiRound();
      }, 900);
    });
    optsWrap.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('mesinSelectRow')){
    initMesin();
    document.getElementById('btnProsesMesin').addEventListener('click', prosesMesin);
  }
  if(document.getElementById('ibQuestionBox')){
    document.getElementById('btnPutarPertanyaan').addEventListener('click', putarPertanyaan);
  }
  if(document.getElementById('ibEmojiClue')){
    renderEmojiRound();
  }
});
