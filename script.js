/* ═══════════════════════════════════════════
   FSD-2 Portal — script.js
   Features: Jump to Q.No, Descriptive Filter,
             10 Units, Mobile Drawer Nav
   ═══════════════════════════════════════════ */

const UNIT_META = {
  "1":   { code:"// unit_1.js — JSON",               title:"Unit 1 · JSON Fundamentals",         desc:"JSON syntax, arrays, objects, parse, stringify, access methods, outputs and programming scripts." },
  "2":   { code:"// unit_2.js — Node.js Core",        title:"Unit 2 · Node.js Core",              desc:"Modules, fs, path, events, EventEmitter, callbacks, event loop and file operations." },
  "3":   { code:"// unit_3.js — HTTP & Servers",      title:"Unit 3 · HTTP & Servers",            desc:"HTTP server, routing, URL parsing, request-response, query strings and JSON responses." },
  "4":   { code:"// unit_4.js — Express.js",          title:"Unit 4 · Express.js",                desc:"Express setup, routing, req/res, static files, query params and HTTP methods." },
  "5":   { code:"// unit_5.js — Middleware & Cookies",title:"Unit 5 · Middleware & Cookies",      desc:"Express middleware, cookies, sessions, body-parser, error handlers." },
  "6":   { code:"// unit_6.js — Template Engines",    title:"Unit 6 · Template Engines",          desc:"EJS, Pug, Handlebars — rendering dynamic views, partials, layouts." },
  "7":   { code:"// unit_7.js — MongoDB",             title:"Unit 7 · MongoDB",                   desc:"NoSQL concepts, CRUD, collections, documents, queries, indexes." },
  "8":   { code:"// unit_8.js — Mongoose",            title:"Unit 8 · Mongoose ODM",              desc:"Schema, Model, validation, virtuals, populate, middleware hooks." },
  "9":   { code:"// unit_9.js — REST APIs",           title:"Unit 9 · REST API Design",           desc:"REST principles, HTTP methods, status codes, CRUD API, Postman testing." },
  "10":  { code:"// unit_10.js — Auth & JWT",         title:"Unit 10 · Auth & JWT",               desc:"Authentication, bcrypt, JSON Web Tokens, protected routes, refresh tokens." },
  "all": { code:"// all_units.js — Full Revision",    title:"All Units · Full Revision",          desc:"All 235+ questions across all 10 units. Searchable, filterable, exam-ready." }
};

const LETTERS = ['A','B','C','D','E','F'];

/* ── helpers ── */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── VSCode-style syntax highlighter ── */
function syntaxHighlight(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let out = '';
  lines.forEach((line, i) => {
    const num = `<span class="line-num">${i+1}</span>`;
    let l = escapeHtml(line);
    l = l.replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="syn-str">$1</span>');
    l = l.replace(/\b(var|const|let|function|return|require|if|else|for|new|class|import|export|module|async|await)\b/g, '<span class="syn-key">$1</span>');
    l = l.replace(/\b(console|fs|path|http|url|events|EventEmitter|JSON|Math|process|module|express|app|router|mongoose|Schema|Model)\b/g, '<span class="syn-fn">$1</span>');
    l = l.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-val">$1</span>');
    l = l.replace(/\b(true|false|null|undefined)\b/g, '<span class="syn-bool">$1</span>');
    l = l.replace(/(\/\/.*$)/g, '<span class="syn-com">$1</span>');
    if (line.startsWith('Answer:') || line.startsWith('✅'))
      l = `<span class="syn-ok">${l}</span>`;
    if (line.startsWith('Explanation:') || line.startsWith('🧠'))
      l = `<span class="syn-com">${l}</span>`;
    out += `<div>${num}${l}</div>`;
  });
  return out;
}

/* ── Build Answer Panel ── */
function buildAnswerPanel(item) {
  const answerText = `Answer:\n${item.answer}`;
  const explText   = item.explanation ? `\nExplanation:\n${item.explanation}` : '';
  const fullText   = answerText + explText;

  const codeBlock = item.code
    ? `<div class="code-block-wrap">${escapeHtml(item.code)}</div>`
    : '';

  return `
    <div class="q-answer-panel" id="ans-${item.id}">
      <div class="vscode-panel">
        <div class="vscode-tabs">
          <div class="vscode-tab active">
            <span class="vscode-tab-dot"></span>
            answer.js
          </div>
          ${item.explanation ? `<div class="vscode-tab" style="color:var(--dim)">explanation</div>` : ''}
        </div>
        <div class="vscode-body">
          <div class="ans-correct-label"><i class="fas fa-check-circle"></i> Correct Answer</div>
          ${syntaxHighlight(fullText)}
          ${codeBlock}
        </div>
      </div>
    </div>
  `;
}

/* ── Build Options ── */
function buildOptions(item) {
  if (!item.options || !item.options.length) return '';
  let html = `<div class="q-options"><div class="options-grid" id="opts-${item.id}">`;
  item.options.forEach((opt, i) => {
    html += `
      <div class="option-item" data-idx="${i}" data-qid="${item.id}">
        <span class="opt-letter">${LETTERS[i]}</span>
        <span class="opt-text">${escapeHtml(opt)}</span>
      </div>`;
  });
  html += `</div></div>`;
  return html;
}

function getCorrectOptionIndex(item) {
  if (!item.options) return -1;
  const correctLower = item.answer.toLowerCase().trim();
  for (let i = 0; i < item.options.length; i++) {
    const optLower = item.options[i].toLowerCase().trim();
    if (optLower === correctLower ||
        optLower.includes(correctLower) ||
        correctLower.includes(optLower.substring(0, Math.min(optLower.length, 20))))
      return i;
  }
  return -1;
}

function attachOptionListeners(item, card) {
  const optsContainer = card.querySelector(`#opts-${item.id}`);
  if (!optsContainer) return;
  const correctIdx = getCorrectOptionIndex(item);
  let answered = false;

  optsContainer.querySelectorAll('.option-item').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      if (answered) return;
      answered = true;
      const chosen = parseInt(opt.dataset.idx);
      const answerPanel = card.querySelector(`#ans-${item.id}`);
      const revealBtn   = card.querySelector('.q-reveal-btn');

      optsContainer.querySelectorAll('.option-item').forEach((o, i) => {
        if (i === correctIdx) {
          o.classList.add('correct');
          o.querySelector('.opt-letter').textContent = '✓';
        } else if (i === chosen && chosen !== correctIdx) {
          o.classList.add('selected-wrong');
          o.querySelector('.opt-letter').textContent = '✗';
        } else {
          o.classList.add('wrong');
        }
      });

      if (answerPanel) {
        answerPanel.classList.add('show');
        if (revealBtn) revealBtn.style.display = 'none';
      }
    });
  });
}

/* ── Build Question Card ── */
function buildCard(item) {
  const hasMCQ   = item.options && item.options.length > 0;
  const qType    = item.type || (hasMCQ ? 'mcq' : 'theory');
  const isProg   = qType === 'programming';
  const isDesc   = qType === 'descriptive';
  const isTheory = qType === 'theory';

  let typeBadge = '';
  if (isProg)   typeBadge = `<span class="badge-q bq-code">{ } code</span>`;
  else if (isDesc) typeBadge = `<span class="badge-q bq-desc">📝 descriptive</span>`;
  else if (isTheory) typeBadge = `<span class="badge-q bq-theory">📘 theory</span>`;

  const card = document.createElement('div');
  card.className = 'q-card';
  card.dataset.qid = item.id;
  card.id = `qcard-${item.id}`;

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
      <div class="q-text">${escapeHtml(item.question)}</div>
    </div>
    ${buildOptions(item)}
    ${!hasMCQ ? `<button class="q-reveal-btn visible">
      <i class="fas fa-eye"></i> Reveal Answer
    </button>` : ''}
    ${buildAnswerPanel(item)}
  `;

  /* header click → expand/collapse */
  const header = card.querySelector('.q-header');
  header.addEventListener('click', () => {
    card.classList.toggle('expanded');
    const panel = card.querySelector(`#ans-${item.id}`);
    if (!hasMCQ && panel) panel.classList.toggle('show');
  });

  /* reveal button */
  const revealBtn = card.querySelector('.q-reveal-btn');
  if (revealBtn) {
    revealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = card.querySelector(`#ans-${item.id}`);
      if (panel) {
        panel.classList.add('show');
        card.classList.add('expanded');
        revealBtn.style.display = 'none';
      }
    });
  }

  if (hasMCQ) attachOptionListeners(item, card);
  return card;
}

/* ══════════════════════════════════
   MAIN PAGE INIT
   ══════════════════════════════════ */
async function initPage() {
  const list = document.getElementById('questionList');
  if (!list) return;

  const unit = getParam('unit') || '1';
  const meta = UNIT_META[unit] || UNIT_META['1'];

  /* pill nav active state */
  document.querySelectorAll('.unit-pill[data-unit]').forEach(a => {
    a.classList.toggle('active', a.dataset.unit === unit);
  });
  /* drawer active state */
  document.querySelectorAll('.drawer-link[data-unit]').forEach(a => {
    a.classList.toggle('active', a.dataset.unit === unit);
  });

  /* page head */
  const codeEl  = document.getElementById('unitCode');
  const titleEl = document.getElementById('unitTitle');
  const descEl  = document.getElementById('unitDesc');
  const statsUnitEl = document.getElementById('statsUnit');
  if (codeEl)  codeEl.textContent  = meta.code;
  if (titleEl) titleEl.textContent = meta.title;
  if (descEl)  descEl.textContent  = meta.desc;
  if (statsUnitEl) statsUnitEl.textContent = meta.title;

  const searchInput = document.getElementById('searchInput');
  const marksFilter = document.getElementById('marksFilter');
  const pyqFilter   = document.getElementById('pyqFilter');
  const typeFilter  = document.getElementById('typeFilter');
  const visibleCount = document.getElementById('visibleCount');

  /* ── Hamburger / Drawer ── */
  const hamburgerBtn  = document.getElementById('hamburgerBtn');
  const navDrawer     = document.getElementById('navDrawer');
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
  if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    navDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => {
    hamburgerBtn.classList.remove('open');
    closeDrawer();
  });

  /* ── Back to Top ── */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  if (backToTop) backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  try {
    const res = await fetch('data.json');
    const db  = await res.json();
    let questions = db.questions.filter(q =>
      unit === 'all' || String(q.unit) === String(unit)
    );

    /* ── Render ── */
    function render(data) {
      list.innerHTML = '';
      if (visibleCount) visibleCount.textContent = data.length;
      if (!data.length) {
        list.innerHTML = `
          <div class="no-results">
            <i class="fas fa-terminal" style="font-size:2rem;color:var(--purple);margin-bottom:1rem;display:block"></i>
            No questions match your filters.<br>
            <span style="font-size:0.75rem;color:var(--dim)">// try different keywords</span>
          </div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      data.forEach(item => frag.appendChild(buildCard(item)));
      list.appendChild(frag);
    }

    /* ── Apply Filters ── */
    function applyFilters() {
      const s = (searchInput.value || '').toLowerCase().trim();
      const m = marksFilter.value;
      const p = pyqFilter.value;
      const t = typeFilter.value;

      const filtered = questions.filter(q => {
        const matchS = !s ||
          q.question.toLowerCase().includes(s) ||
          q.answer.toLowerCase().includes(s) ||
          (q.explanation||'').toLowerCase().includes(s);
        const matchM = m === 'all' || String(q.marks) === m;
        const matchP = p === 'all' || (p === 'yes' && q.previousYear) || (p === 'no' && !q.previousYear);

        /* type matching — includes descriptive */
        const qType = q.type || (q.options && q.options.length ? 'mcq' : 'theory');
        let matchT = t === 'all';
        if (!matchT) {
          if (t === 'mcq')         matchT = (q.options && q.options.length > 0);
          else if (t === 'descriptive') matchT = qType === 'descriptive';
          else if (t === 'programming') matchT = qType === 'programming';
          else if (t === 'theory')  matchT = (qType === 'theory' && !(q.options && q.options.length));
        }
        return matchS && matchM && matchP && matchT;
      });
      render(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    marksFilter.addEventListener('change', applyFilters);
    pyqFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);

    render(questions);

    /* ════════════════════════════════════
       FEATURE 1 — JUMP TO Q.No
       ════════════════════════════════════ */
    const jumpInput = document.getElementById('jumpInput');
    const jumpBtn   = document.getElementById('jumpBtn');

    function doJump() {
      const val = parseInt((jumpInput && jumpInput.value) || '0');
      if (!val) return shakeJump();

      /* First: is card already rendered? */
      let target = document.getElementById(`qcard-${val}`);
      if (!target) {
        /* Question may have been filtered out — reset filters & re-render */
        searchInput.value = '';
        marksFilter.value = 'all';
        pyqFilter.value   = 'all';
        typeFilter.value  = 'all';
        render(questions);
        target = document.getElementById(`qcard-${val}`);
      }
      if (!target) { shakeJump(); showJumpError(val); return; }

      /* Scroll */
      const yOffset = -130;
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      /* Highlight */
      target.classList.add('jump-highlight');
      setTimeout(() => target.classList.remove('jump-highlight'), 2200);

      /* Auto-expand */
      setTimeout(() => {
        if (!target.classList.contains('expanded')) {
          target.querySelector('.q-header').click();
        }
      }, 500);

      if (jumpInput) jumpInput.value = '';
    }

    function shakeJump() {
      const panel = document.querySelector('.jump-panel');
      if (!panel) return;
      panel.classList.add('shake');
      setTimeout(() => panel.classList.remove('shake'), 500);
    }

    function showJumpError(val) {
      const existing = document.getElementById('jumpErrMsg');
      if (existing) existing.remove();
      const err = document.createElement('div');
      err.id = 'jumpErrMsg';
      err.className = 'jump-error';
      err.textContent = `Q${val} not found in this unit`;
      document.querySelector('.jump-panel').appendChild(err);
      setTimeout(() => err.remove(), 2500);
    }

    if (jumpBtn)   jumpBtn.addEventListener('click', doJump);
    if (jumpInput) jumpInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') doJump();
    });

  } catch(e) {
    console.error(e);
    list.innerHTML = `
      <div class="no-results">
        <i class="fas fa-exclamation-triangle" style="color:var(--red);font-size:1.5rem;display:block;margin-bottom:0.8rem"></i>
        Failed to load data.json<br>
        <span style="font-size:0.75rem;color:var(--dim)">// run with Live Server — fetch() needs HTTP</span>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', initPage);
