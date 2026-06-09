const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;
const DATA_FILE = path.join(ROOT_DIR, 'data.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

async function loadQuestions() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const db = JSON.parse(raw);
  return Array.isArray(db.questions) ? db.questions : [];
}

function filterQuestions(questions, url) {
  const unit = url.searchParams.get('unit') || 'all';
  const type = url.searchParams.get('type') || 'all';
  const marks = url.searchParams.get('marks') || 'all';
  const pyq = url.searchParams.get('pyq') || 'all';
  const search = (url.searchParams.get('search') || '').trim().toLowerCase();

  return questions.filter(question => {
    const hasOptions = Array.isArray(question.options) && question.options.length > 0;
    const questionType = question.type || (hasOptions ? 'mcq' : 'theory');
    const text = [
      question.question,
      question.answer,
      question.explanation
    ].map(value => String(value || '').toLowerCase()).join(' ');

    const matchesUnit = unit === 'all' || String(question.unit) === unit;
    const matchesType = type === 'all' || (type === 'mcq' ? hasOptions : questionType === type);
    const matchesMarks = marks === 'all' || String(question.marks) === marks;
    const matchesPyq = pyq === 'all' || (pyq === 'yes' ? question.previousYear : !question.previousYear);
    const matchesSearch = !search || text.includes(search);

    return matchesUnit && matchesType && matchesMarks && matchesPyq && matchesSearch;
  });
}

async function serveStatic(req, res, url) {
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const decodedPath = decodeURIComponent(requestedPath);
  const filePath = path.normalize(path.join(ROOT_DIR, decodedPath));
  const relativePath = path.relative(ROOT_DIR, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=300'
    });
    res.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    sendJson(res, 500, { error: 'Failed to read file' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    if (url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true, service: 'fsd-2-quiz' });
      return;
    }

    if (url.pathname === '/api/questions') {
      const questions = await loadQuestions();
      const filteredQuestions = filterQuestions(questions, url);
      sendJson(res, 200, {
        count: filteredQuestions.length,
        questions: filteredQuestions
      });
      return;
    }

    await serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`FSD-2 Quiz running at http://localhost:${PORT}`);
});
