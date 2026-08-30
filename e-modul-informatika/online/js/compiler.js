/* compiler.js — Coding Lab, menjalankan kode PYTHON asli lewat Skulpt (library lokal, tanpa internet).
   Skulpt menafsirkan Python di dalam JavaScript sendiri — tidak memberi akses ke DOM utama,
   localStorage, cookie, atau jaringan halaman ini, jadi tetap aman dijalankan di browser. */

function getLineCount(text){
  return text.split('\n').length;
}

function renderLineNumbers(){
  const editor = document.getElementById('codeEditor');
  const nums = document.getElementById('lineNumbers');
  if(!editor || !nums) return;
  const count = getLineCount(editor.value);
  let out = '';
  for(let i = 1; i <= count; i++) out += i + '\n';
  nums.textContent = out;
}

function outputLine(text, cls){
  const output = document.getElementById('outputArea');
  const line = document.createElement('div');
  if(cls) line.className = cls;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function skBuiltinRead(x){
  if(Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined){
    throw 'File tidak ditemukan: "' + x + '"';
  }
  return Sk.builtinFiles['files'][x];
}

function runCode(){
  const editor = document.getElementById('codeEditor');
  const output = document.getElementById('outputArea');
  const runBtn = document.getElementById('btnRun');
  if(!editor || !output) return;
  output.innerHTML = '';
  runBtn.disabled = true;
  runBtn.textContent = '⏳ Menjalankan...';

  let bufferedText = '';
  function outf(text){
    bufferedText += text;
  }
  function flushBuffer(){
    if(bufferedText.length){
      bufferedText.split('\n').forEach((chunk, i, arr) => {
        if(chunk.length || i < arr.length - 1) outputLine(chunk, 'out-log');
      });
      bufferedText = '';
    }
  }

  Sk.configure({
    output: outf,
    read: skBuiltinRead,
    inputfun: function(promptText){
      const val = window.prompt(promptText || 'Masukkan nilai:');
      return val === null ? '' : val;
    },
    inputfunTakesPrompt: true,
    __future__: Sk.python3
  });

  const code = editor.value;

  Sk.misceval.asyncToPromise(function(){
    return Sk.importMainWithBody('<stdin>', false, code, true);
  }).then(function(){
    flushBuffer();
    if(output.children.length === 0){
      outputLine('(Tidak ada output. Gunakan print() untuk menampilkan sesuatu.)', 'out-empty');
    }
    runBtn.disabled = false;
    runBtn.textContent = '▶ Jalankan';
  }, function(err){
    flushBuffer();
    let pesan = err.toString();
    outputLine('⚠️ Terjadi kesalahan pada program:', 'out-error-title');
    outputLine(pesan, 'out-error');
    outputLine('💡 Petunjuk: periksa kembali baris yang disebutkan di atas — cek tanda titik dua (:), indentasi (spasi di awal baris), dan nama variabel.', 'out-hint');
    runBtn.disabled = false;
    runBtn.textContent = '▶ Jalankan';
  });
}

function resetCode(){
  const editor = document.getElementById('codeEditor');
  const output = document.getElementById('outputArea');
  const starter = editor && editor.dataset.starter ? editor.dataset.starter : '# Tulis kode Python-mu di sini\n';
  if(editor){ editor.value = starter; renderLineNumbers(); }
  if(output){ output.innerHTML = '<span class="out-empty">(Belum ada output. Klik Jalankan untuk mencoba kodemu.)</span>'; }
}

function copyCode(){
  const editor = document.getElementById('codeEditor');
  if(!editor) return;
  editor.select();
  editor.setSelectionRange(0, editor.value.length);
  try{
    document.execCommand('copy');
    if(window.showToast) showToast('Kode disalin ✅');
  }catch(e){
    if(window.showToast) showToast('Gagal menyalin, salin manual ya.');
  }
}

function clearOutput(){
  const output = document.getElementById('outputArea');
  if(output) output.innerHTML = '<span class="out-empty">(Output dikosongkan.)</span>';
}

document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('codeEditor');
  if(!editor) return;

  // Jika ada kode kiriman dari halaman materi (tombol "Coba Kode"), muat di sini.
  const kirim = sessionStorage.getItem('emodul_kirim_kode');
  const tugas = sessionStorage.getItem('emodul_kirim_tugas');
  if(kirim){
    editor.value = kirim;
    editor.dataset.starter = kirim;
    sessionStorage.removeItem('emodul_kirim_kode');
  }
  const taskBox = document.getElementById('labTaskText');
  if(tugas && taskBox){
    taskBox.innerHTML = '<strong>Tantangan:</strong> ' + tugas;
    sessionStorage.removeItem('emodul_kirim_tugas');
  }

  renderLineNumbers();
  editor.addEventListener('input', renderLineNumbers);
  editor.addEventListener('scroll', () => {
    document.getElementById('lineNumbers').scrollTop = editor.scrollTop;
  });
  // Tab menyisipkan indentasi 4 spasi (sesuai gaya indentasi Python), bukan pindah fokus.
  editor.addEventListener('keydown', (e) => {
    if(e.key === 'Tab'){
      e.preventDefault();
      const start = editor.selectionStart, end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
      renderLineNumbers();
    }
  });

  document.getElementById('btnRun')?.addEventListener('click', runCode);
  document.getElementById('btnReset')?.addEventListener('click', resetCode);
  document.getElementById('btnCopy')?.addEventListener('click', copyCode);
  document.getElementById('btnClearOut')?.addEventListener('click', clearOutput);
});

/* Dipanggil dari halaman materi.html lewat tombol "Coba Kode" */
function kirimKeCodingLab(kode, tugas){
  sessionStorage.setItem('emodul_kirim_kode', kode);
  if(tugas) sessionStorage.setItem('emodul_kirim_tugas', tugas);
  window.location.href = 'coding-lab.html';
}
window.kirimKeCodingLab = kirimKeCodingLab;
