const UNIT_META = {
  "1":  { code:"// unit_1.js — JSON",           title:"Unit 1 · JSON (JavaScript Object Notation)",  desc:"JSON syntax, arrays, objects, parse, stringify, access methods." },
  "2":  { code:"// unit_2.js — Node.js Core",   title:"Unit 2 · Node JS — Introduction & Core Modules", desc:"require(), fs module, path module, events, EventEmitter, callbacks." },
  "3":  { code:"// unit_3.js — Server Creation", title:"Unit 3 · Node JS Modules & Server Creation", desc:"HTTP server creation, URL module, request/response objects, basic routing." },
  "4":  { code:"// unit_4.js — Express.js",      title:"Unit 4 · Express JS Fundamentals",             desc:"Express setup, app.get/post, req/res objects, middleware, routing." },
  "5":  { code:"// unit_5.js — State & API",     title:"Unit 5 · Express State Management and API",    desc:"Cookies, sessions, RESTful APIs, route parameters, CORS." },
  "6":  { code:"// unit_6.js — Advanced Express",title:"Unit 6 · Express — Advanced Concept",           desc:"File uploads (Multer), Nodemailer, EJS template engine." },
  "7":  { code:"// unit_7.js — React",           title:"Unit 7 · React Fundamentals & Core Concepts",   desc:"JSX, components, props, events, routing, conditional rendering." },
  "8":  { code:"// unit_8.js — React Hooks",     title:"Unit 8 · React Hooks & API Integration",       desc:"useState, useEffect, useContext, useReducer, Axios, forms." },
  "9":  { code:"// unit_9.js — MongoDB",         title:"Unit 9 · MongoDB — Queries and Operators",      desc:"CRUD, comparison operators, $set/$inc, sort/limit, aggregation." },
  "10": { code:"// unit_10.js — Mongoose & MERN",title:"Unit 10 · Mongoose & MERN Integration",         desc:"Mongoose schema/model, validation, indexing, full-stack MERN." },
  "all":{ code:"// all_units.js — Full Revision",title:"All Units · Full Revision",                     desc:"All 484 questions across all 10 units. Searchable, filterable." }
};

const LETTERS = ['A','B','C','D','E','F'];

// Decode HTML entities that are stored in the JSON (critical fix)
function decodeHtmlEntities(str) {
  if (typeof str !== 'string') return '';
  
  // Handle common encoded entities that appear in the data
  return str
    .replace(/&amp;#039;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&amp;quot;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

// Safe text for display (decode first, then escape only for HTML safety)
function safeText(str) {
  if (typeof str !== 'string') return '';
  const decoded = decodeHtmlEntities(str);
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Pretty print JSON if the text looks like JSON
function prettyPrintJson(text) {
  if (!text || typeof text !== 'string') return text;
  
  const trimmed = text.trim();
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(trimmed);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return text; // not valid JSON, return original
    }
  }
  return text;
}

function syntaxHighlight(text) {
  if (!text) return '';
  
  // First decode any entities
  let decoded = decodeHtmlEntities(text);
  
  // Pretty print if it's JSON-like
  decoded = prettyPrintJson(decoded);
  
  const lines = decoded.split('\n');
  let out = '';
  
  lines.forEach((line, i) => {
    const num = `<span class="line-num">${i + 1}</span>`;
    let l = safeText(line);
    
    // Syntax highlighting
    l = l.replace(/\b(var|const|let|function|return|require|if|else|for|new|class|import|export|module|async|await)\b/g, '<span class="syn-key">$1</span>');
    l = l.replace(/\b(console|fs|path|http|url|events|EventEmitter|JSON|Math|process|module\.exports|express|app|router|mongoose|Schema|Model)\b/g, '<span class="syn-fn">$1</span>');
    l = l.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-val">$1</span>');
    l = l.replace(/\b(true|false|null|undefined)\b/g, '<span class="syn-bool">$1</span>');
    l = l.replace(/(\/\/.*$)/g, '<span class="syn-com">$1</span>');
    
    if (line.startsWith('Answer:') || line.startsWith('✅')) {
      l = `<span class="syn-ok">${l}</span>`;
    }
    if (line.startsWith('Explanation:') || line.startsWith('🧠')) {
      l = `<span class="syn-com">${l}</span>`;
    }
    
    out += `<div>${num}${l}</div>`;
  });
  
  return out;
}

function buildAnswerPanel(item) {
  const rawAnswer = decodeHtmlEntities(item.answer || '');
  const rawExpl = item.explanation ? decodeHtmlEntities(item.explanation) : '';
  
  const answerText = `Answer:\n${rawAnswer}`;
  const explText = rawExpl ? `\nExplanation:\n${rawExpl}` : '';
  const fullText = answerText + explText;
  
  let codeBlock = '';
  if (item.code) {
    const prettyCode = prettyPrintJson(decodeHtmlEntities(item.code));
    codeBlock = `<div class="code-block-wrap"><pre>${safeText(prettyCode)}</pre></div>`;
  }
  
  return `
    <div class="q-answer-panel" id="ans-${item.id}">
      <div class="vscode-panel">
        <div class="vscode-tabs">
          <div class="vscode-tab active"><span class="vscode-tab-dot"></span>answer.js</div>
          ${item.explanation ? `<div class="vscode-tab" style="color:var(--dim)">explanation</div>` : ''}
        </div>
        <div class="vscode-body">
          <div class="ans-correct-label"><i class="fas fa-check-circle"></i> Correct Answer</div>
          ${syntaxHighlight(fullText)}
          ${codeBlock}
          <div class="answer-actions">
            <button class="copy-btn" aria-label="Copy answer" data-copy-text="${encodeURIComponent(fullText)}">
              <i class="fas fa-copy"></i> <span class="copy-text">Copy Answer</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function buildOptions(item) {
  if (!item.options || !item.options.length) return '';
  let html = `<div class="q-options"><div class="options-grid" id="opts-${item.id}">`;
  item.options.forEach((opt, i) => {
    const decodedOpt = decodeHtmlEntities(opt);
    html += `<div class="option-item" data-idx="${i}" data-qid="${item.id}" role="button" tabindex="0" aria-label="Option ${LETTERS[i]}"><span class="opt-letter">${LETTERS[i]}</span><span class="opt-text">${safeText(decodedOpt)}</span></div>`;
  });
  html += `</div></div>`;
  return html;
}

function getCorrectOptionIndex(item) {
  if (!item.options || !item.options.length) return -1;
  const answerLower = decodeHtmlEntities(item.answer).toLowerCase().trim();
  
  for (let i = 0; i < item.options.length; i++) {
    if (decodeHtmlEntities(item.options[i]).toLowerCase().trim() === answerLower) return i;
  }
  for (let i = 0; i < item.options.length; i++) {
    const optLower = decodeHtmlEntities(item.options[i]).toLowerCase().trim();
    if (optLower.includes(answerLower) || answerLower.includes(optLower)) return i;
  }
  return -1;
}

function highlightCorrectOption(item, card) {
  const optsContainer = card.querySelector(`#opts-${item.id}`);
  if (!optsContainer) return;
  const correctIdx = getCorrectOptionIndex(item);
  if (correctIdx === -1) return;
  
  optsContainer.querySelectorAll('.option-item').forEach((o, i) => {
    o.style.pointerEvents = 'none';
    if (i === correctIdx) {
      o.classList.add('correct');
      const letterEl = o.querySelector('.opt-letter');
      if (letterEl) letterEl.textContent = '✓';
    } else {
      o.classList.add('wrong');
    }
  });
}

function buildCard(item) {
  const hasMCQ = item.options && item.options.length > 0;
  const qType = item.type || (hasMCQ ? 'mcq' : 'theory');
  let typeBadge = '';
  
  if (qType === 'programming') typeBadge = `<span class="badge-q bq-code">{ } code</span>`;
  else if (qType === 'descriptive') typeBadge = `<span class="badge-q bq-desc">📝 descriptive</span>`;
  else if (qType === 'theory') typeBadge = `<span class="badge-q bq-theory">📘 theory</span>`;

  const decodedQuestion = decodeHtmlEntities(item.question || '');

  const card = document.createElement('div');
  card.className = 'q-card';
  card.dataset.qid = item.id;
  card.id = `qcard-${item.id}`;
  card.setAttribute('role', 'listitem');

  card.innerHTML = `
    <div class="q-card-left-accent"></div>
    <div class="q-header">
      <div class="q-meta">
        <span class="badge-q bq-id">Q${item.id}</span>
        <span class="badge-q bq-unit">unit_${item.unit}</span>
        <span class="badge-q bq-marks">${item.marks}m</span>
        ${item.previousYear ? `<span class="badge-q bq-pyq">⭐ PYQ</span>` : ''}
        ${typeBadge}
        <i class="fas fa-chevron-down q-chevron"></i>
      </div>
      <div class="q-text">${safeText(decodedQuestion)}</div>
    </div>
    ${buildOptions(item)}
    <button class="q-reveal-btn visible" aria-label="Reveal answer">
      <i class="fas fa-eye"></i> <span class="reveal-text">Reveal Answer</span>
    </button>
    ${buildAnswerPanel(item)}
  `;

  const header = card.querySelector('.q-header');
  header.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });

  const revealBtn = card.querySelector('.q-reveal-btn');
  const answerPanel = card.querySelector(`#ans-${item.id}`);

  if (revealBtn && answerPanel) {
    revealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const isShown = answerPanel.classList.contains('show');
      
      if (isShown) {
        // Hide
        answerPanel.classList.remove('show');
        card.classList.remove('expanded');
        revealBtn.querySelector('.reveal-text').textContent = 'Reveal Answer';
        revealBtn.querySelector('i').className = 'fas fa-eye';
      } else {
        // Show
        answerPanel.classList.add('show');
        card.classList.add('expanded');
        revealBtn.querySelector('.reveal-text').textContent = 'Close Answer';
        revealBtn.querySelector('i').className = 'fas fa-eye-slash';
        
        if (hasMCQ) {
          highlightCorrectOption(item, card);
        }
      }
    });
  }

  return card;
}

async function initPage() {
  const list = document.getElementById('questionList');
  if (!list) return;

  const unit = getParam('unit') || '1';
  const meta = UNIT_META[unit] || UNIT_META['1'];

  // Set active nav
  document.querySelectorAll('.unit-pill[data-unit]').forEach(a => a.classList.toggle('active', a.dataset.unit === unit));
  document.querySelectorAll('.drawer-link[data-unit]').forEach(a => a.classList.toggle('active', a.dataset.unit === unit));

  const codeEl = document.getElementById('unitCode');
  const titleEl = document.getElementById('unitTitle');
  const descEl = document.getElementById('unitDesc');
  const statsUnitEl = document.getElementById('statsUnit');
  
  if (codeEl) codeEl.textContent = meta.code;
  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.desc;
  if (statsUnitEl) statsUnitEl.textContent = unit === 'all' ? 'All Units' : `Unit ${unit}`;

  const searchInput = document.getElementById('searchInput');
  const marksFilter = document.getElementById('marksFilter');
  const pyqFilter = document.getElementById('pyqFilter');
  const typeFilter = document.getElementById('typeFilter');
  const visibleCount = document.getElementById('visibleCount');

  // Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navDrawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
      if (hamburgerBtn) hamburgerBtn.classList.remove('open');
      closeDrawer();
    }
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Global copy handler (delegation)
  list.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (!copyBtn) return;

    const encodedText = copyBtn.dataset.copyText || '';
    let textToCopy = decodeURIComponent(encodedText);
    
    // Final decode to ensure clean text
    textToCopy = decodeHtmlEntities(textToCopy);

    const textSpan = copyBtn.querySelector('.copy-text');
    const originalText = textSpan ? textSpan.textContent : 'Copy';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers / http
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (textSpan) textSpan.textContent = 'Copied ✓';
      copyBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        if (textSpan) textSpan.textContent = originalText;
        copyBtn.style.pointerEvents = 'auto';
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      if (textSpan) textSpan.textContent = 'Failed';
      setTimeout(() => {
        if (textSpan) textSpan.textContent = originalText;
      }, 1500);
    }
  });

  try {
    const res = await fetch(`data/data_u${unit}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const db = await res.json();
    let questions = db.questions || [];

    // Populate marks filter
    if (marksFilter) {
      const marksSet = [...new Set(questions.map(q => q.marks))].sort((a, b) => a - b);
      marksFilter.innerHTML = '<option value="all">All Marks</option>';
      marksSet.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = `${m} mark${m !== 1 ? 's' : ''}`;
        marksFilter.appendChild(opt);
      });
    }

    function render(data) {
      list.innerHTML = '';
      if (visibleCount) visibleCount.textContent = data.length;
      
      if (!data.length) {
        list.innerHTML = `<div class="no-results"><i class="fas fa-terminal" style="font-size:2rem;color:var(--purple);margin-bottom:1rem;display:block"></i>No questions match your filters.<br><span style="font-size:0.75rem;color:var(--dim)">// try different keywords</span></div>`;
        return;
      }
      
      const frag = document.createDocumentFragment();
      data.forEach(item => frag.appendChild(buildCard(item)));
      list.appendChild(frag);
    }

    function applyFilters() {
      const s = (searchInput.value || '').toLowerCase().trim();
      const m = marksFilter.value;
      const p = pyqFilter.value;
      const t = typeFilter.value;

      const filtered = questions.filter(q => {
        const decodedQ = decodeHtmlEntities(q.question || '').toLowerCase();
        const decodedA = decodeHtmlEntities(q.answer || '').toLowerCase();
        const decodedE = decodeHtmlEntities(q.explanation || '').toLowerCase();

        const matchS = !s || decodedQ.includes(s) || decodedA.includes(s) || decodedE.includes(s);
        const matchM = m === 'all' || String(q.marks) === m;
        const matchP = p === 'all' || (p === 'yes' && q.previousYear) || (p === 'no' && !q.previousYear);
        
        const qType = q.type || (q.options && q.options.length ? 'mcq' : 'theory');
        let matchT = t === 'all';
        if (!matchT) {
          if (t === 'mcq') matchT = (q.options && q.options.length > 0);
          else if (t === 'descriptive') matchT = qType === 'descriptive';
          else if (t === 'theory') matchT = (qType === 'theory' && !(q.options && q.options.length));
        }
        return matchS && matchM && matchP && matchT;
      });
      render(filtered);
    }

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyFilters, 150);
    });
    marksFilter.addEventListener('change', applyFilters);
    pyqFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);

    render(questions);

    // Jump to question
    const jumpInput = document.getElementById('jumpInput');
    const jumpBtn = document.getElementById('jumpBtn');

    function doJump() {
      const val = parseInt((jumpInput && jumpInput.value) || '0');
      if (!val) return;

      let target = document.getElementById(`qcard-${val}`);
      if (!target) {
        searchInput.value = '';
        marksFilter.value = 'all';
        pyqFilter.value = 'all';
        typeFilter.value = 'all';
        render(questions);
        target = document.getElementById(`qcard-${val}`);
      }
      if (!target) {
        const err = document.createElement('div');
        err.className = 'jump-error';
        err.textContent = `Q${val} not found`;
        document.querySelector('.jump-panel')?.appendChild(err);
        setTimeout(() => err.remove(), 2000);
        return;
      }

      const y = target.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
      target.classList.add('jump-highlight');
      setTimeout(() => target.classList.remove('jump-highlight'), 2000);
      setTimeout(() => {
        if (!target.classList.contains('expanded')) {
          target.querySelector('.q-header')?.click();
        }
      }, 600);
      if (jumpInput) jumpInput.value = '';
    }

    if (jumpBtn) jumpBtn.addEventListener('click', doJump);
    if (jumpInput) jumpInput.addEventListener('keydown', e => { if (e.key === 'Enter') doJump(); });

  } catch (e) {
    console.error(e);
    list.innerHTML = `<div class="no-results"><i class="fas fa-exclamation-triangle" style="color:var(--red);font-size:1.5rem;display:block;margin-bottom:0.8rem"></i>Failed to load questions.<br><span style="font-size:0.75rem;color:var(--dim)">// check console for details</span></div>`;
  }
}

document.addEventListener('DOMContentLoaded', initPage);