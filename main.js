// -------- Quiz logic (multi-question with explanations + disable until complete) --------
const ANSWERS = { q1: 'false', q2: 'true', q3: 'true', q4: 'true', q5: 'false' };
const EXPLAIN = {
  q1: 'It’s both: environmental hazards create social impacts (health, jobs, migration).',
  q2: 'Some nanomaterials may have unknown toxicity; standards and lifecycle studies matter.',
  q3: 'GMOs can help (e.g., biofortification) but risks include resistance & market concentration.',
  q4: 'PH is megadiverse; biodiversity underpins food security and disaster protection.',
  q5: 'Effectiveness ≠ ethics — consent, safety, and fair access still apply.'
};

function gradeQuiz(){
  const total = Object.keys(ANSWERS).length; let score=0; const missed=[];
  for(const key of Object.keys(ANSWERS)){
    const chosen = document.querySelector(`input[name="${key}"]:checked`);
    highlightFieldset(key, null);
    if(!chosen){ missed.push(key+' (no answer)'); highlightFieldset(key,'warn'); continue; }
    if(chosen.value===ANSWERS[key]){ score++; highlightFieldset(key,'ok'); }
    else { missed.push(key); highlightFieldset(key,'bad'); }
  }
  const pct = Math.round((score/total)*100);
  const res = document.getElementById('quizResult');
  res.innerHTML = `Score: ${score}/${total} (${pct}%). ${missed.length? 'Review: '+missed.join(', ') : 'Great job!'} ` +
    '<ul style="margin-top:8px;">' + Object.keys(ANSWERS).map(k=>`<li><small>${EXPLAIN[k]}</small></li>`).join('') + '</ul>';
  res.style.color = (score===total) ? 'lightgreen' : (score>=Math.ceil(total*0.6)? '#f59e0b' : 'tomato');
  res.scrollIntoView({behavior:'smooth', block:'center'});
}

function highlightFieldset(qName, state){
  const fs = document.querySelector(`input[name="${qName}"]`)?.closest('fieldset');
  if(!fs) return; fs.style.border='1px solid rgba(255,255,255,.12)'; fs.style.boxShadow='none';
  if(state==='ok'){ fs.style.border='1px solid rgba(16,185,129,.7)'; fs.style.boxShadow='0 0 0 3px rgba(16,185,129,.20)'; }
  else if(state==='bad'){ fs.style.border='1px solid rgba(239,68,68,.7)'; fs.style.boxShadow='0 0 0 3px rgba(239,68,68,.20)'; }
  else if(state==='warn'){ fs.style.border='1px solid rgba(245,158,11,.7)'; fs.style.boxShadow='0 0 0 3px rgba(245,158,11,.20)'; }
}

function resetQuiz(){
  for(const key of Object.keys(ANSWERS)){
    document.querySelectorAll(`input[name="${key}"]`).forEach(i=>i.checked=false);
    highlightFieldset(key,null);
  }
  const res=document.getElementById('quizResult'); res.textContent=''; res.style.color='';
  // Disable submit again until all answered
  const form = document.getElementById('quizForm');
  const submitBtn = form?.querySelector('button[type="submit"]');
  if(submitBtn) submitBtn.disabled = true;
}

// Disable Submit until all answered
const form = document.getElementById('quizForm');
if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  form.addEventListener('change', () => {
    const allAnswered = Object.keys(ANSWERS).every(k => document.querySelector(`input[name="${k}"]:checked`));
    submitBtn.disabled = !allAnswered;
  });
}

// -------- Live Article Search Filter --------
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.article-item');
if (searchInput && cards.length) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach(c => {
      const text = c.innerText.toLowerCase() + ' ' + (c.dataset.tags || '');
      c.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// -------- Image helpers (lazy-load + fallback) --------
for (const img of document.querySelectorAll('img')) { img.loading = 'lazy'; }
const FALLBACK = 'https://placehold.co/1200x800/0f172a/9fb3d1?text=TechnoSphere+PH';
for (const img of document.querySelectorAll('img')) {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = FALLBACK; img.alt = (img.alt||'Image') + ' (placeholder due to load error)';
  });
}

// -------- PH Trend Ad Rotator --------
const ADS = [
  { title: '11.11 Mega Sale — Up to 70% OFF', text: 'Add to cart now, check out on 11.11. Free shipping vouchers and flash deals every hour.', img: 'https://images.unsplash.com/photo-1519996529931-28324d5a6301?q=80&w=1200&auto=format&fit=crop', cta: 'Shop now' },
  { title: 'Milktea Craze — New Ube Cheesecake Series', text: 'Buy 1 Take 1 from 2–4 PM daily. Limited time in participating PH branches.', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop', cta: 'Order pickup' },
  { title: 'Flagship Phone Launch — 108MP Night Camera', text: 'Pre-order to get free buds and a 1‑year screen replacement. 5G. AMOLED 120Hz.', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop', cta: 'Pre‑order' },
  { title: 'Seat Sale Alert — Fly for as low as ₱1*', text: 'Book early for 2026 travel dates. Base fare only; terms apply.', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200&auto=format&fit=crop', cta: 'Book flight' }
];
(function rotateAds(){
  const titleEl = document.getElementById('adTitle');
  const textEl  = document.getElementById('adText');
  const imgEl   = document.getElementById('adImg');
  const btnEl   = document.getElementById('adBtn');
  if(!titleEl || !textEl || !imgEl || !btnEl) return;
  let i = 0; function show(){ const ad = ADS[i % ADS.length]; titleEl.textContent = ad.title; textEl.textContent = ad.text; imgEl.src = ad.img; btnEl.textContent = ad.cta; i++; }
  show(); setInterval(show, 6000);
})();