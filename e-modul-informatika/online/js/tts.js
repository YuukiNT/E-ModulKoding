/* tts.js — Text-to-Speech pakai Web Speech API bawaan browser (tidak perlu internet).
   Membacakan hanya paragraf yang ditandai class "tts-para" di dalam kontainer target,
   supaya blok kode tidak ikut dibacakan. */

let currentUtterance = null;
let currentBtn = null;
let indoVoice = null;

function pickIndoVoice(){
  const voices = window.speechSynthesis.getVoices();
  indoVoice = voices.find(v => v.lang === 'id-ID') || voices.find(v => v.lang && v.lang.startsWith('id')) || null;
}
if('speechSynthesis' in window){
  pickIndoVoice();
  window.speechSynthesis.onvoiceschanged = pickIndoVoice;
}

function collectReadableText(container){
  const paras = container.querySelectorAll('.tts-para');
  return Array.from(paras).map(p => p.innerText.trim()).filter(Boolean).join('. ');
}

function stopSpeaking(){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  if(currentBtn){
    currentBtn.classList.remove('tts-playing');
    currentBtn.innerHTML = currentBtn.dataset.labelIdle || '🔊 Dengarkan';
  }
  currentUtterance = null;
  currentBtn = null;
}

function initTtsButtons(){
  if(!('speechSynthesis' in window)){
    document.querySelectorAll('[data-tts-target]').forEach(btn => btn.style.display = 'none');
    return;
  }
  document.querySelectorAll('[data-tts-target]').forEach(btn => {
    btn.dataset.labelIdle = btn.innerHTML;
    btn.addEventListener('click', () => {
      const isThisPlaying = currentBtn === btn && window.speechSynthesis.speaking;
      stopSpeaking();
      if(isThisPlaying) return; // klik kedua pada tombol yang sama = berhenti

      const targetSelector = btn.getAttribute('data-tts-target');
      const container = document.querySelector(targetSelector);
      if(!container) return;
      const text = collectReadableText(container);
      if(!text){ if(window.showToast) showToast('Tidak ada teks untuk dibacakan di sini.'); return; }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'id-ID';
      if(indoVoice) utter.voice = indoVoice;
      utter.rate = 0.95;
      utter.onend = () => { if(currentBtn === btn) stopSpeaking(); };
      utter.onerror = () => { if(currentBtn === btn) stopSpeaking(); };

      currentUtterance = utter;
      currentBtn = btn;
      btn.classList.add('tts-playing');
      btn.innerHTML = '⏹ Berhenti';
      window.speechSynthesis.speak(utter);
    });
  });

  // Hentikan bacaan kalau pindah halaman/tutup tab
  window.addEventListener('beforeunload', stopSpeaking);
}

document.addEventListener('DOMContentLoaded', initTtsButtons);
window.stopSpeaking = stopSpeaking;
