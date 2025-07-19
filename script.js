let allMcqs = [];
let currentPage = 1;
const mcqsPerPage = 10;

// ✅ Read subject and topic from URL
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get('subject');
const topic = urlParams.get('topic');

// ✅ Update page title if you have one
const titleElement = document.getElementById('page-title');
if (titleElement) {
  titleElement.textContent = `${subject} → ${topic}`;
}

// ✅ Fetching MCQs from backend
fetch('https://gk-mcqs-backend.onrender.com/mcqs')
  .then(res => res.json())
  .then(data => {
    allMcqs = data.filter(mcq => mcq.subject === subject && mcq.topic === topic);
    renderMCQs(currentPage);
  })
  .catch(err => {
    console.error('Failed to load MCQs:', err);
    document.getElementById('mcqContainer').innerHTML = '<p>Error loading MCQs. Please try again later.</p>';
  });

function renderMCQs(page) {
  const mcqContainer = document.getElementById('mcqContainer');
  mcqContainer.innerHTML = '';

  if (allMcqs.length === 0) {
    mcqContainer.innerHTML = '<p>No MCQs available in this category.</p>';
    renderPagination(0, 1);
    return;
  }

  const start = (page - 1) * mcqsPerPage;
  const paginatedMcqs = allMcqs.slice(start, start + mcqsPerPage);

  paginatedMcqs.forEach((mcq, index) => {
    const div = document.createElement('div');
    div.className = 'mcq';

    const questionClass = mcq.subject === 'Islamiyat' ? 'urdu-text' : '';
    div.innerHTML = `<h3 class="${questionClass}">${start + index + 1}. ${mcq.question}</h3>`;

    const ol = document.createElement('ol');

    mcq.options.forEach(opt => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.style.position = 'relative';

      li.addEventListener('click', () => {
        const existing = li.querySelector('.feedback');
        if (existing) return;

        const feedback = document.createElement('span');
        feedback.className = 'feedback';
        feedback.style.position = 'absolute';
        feedback.style.right = '15px';
        feedback.style.top = '50%';
        feedback.style.transform = 'translateY(-50%');
        feedback.style.fontWeight = 'bold';
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.5s ease';

        if (li.textContent.trim() === mcq.correctAnswer.trim()) {
          li.classList.add('correct');
          feedback.textContent = 'Correct!';
          feedback.style.color = '#28a745';
        } else {
          li.classList.add('wrong');
          feedback.textContent = 'Incorrect!';
          feedback.style.color = '#dc3545';
        }

        li.appendChild(feedback);
        li.style.pointerEvents = 'none';
        setTimeout(() => feedback.style.opacity = '1', 50);
      });

      ol.appendChild(li);
    });

    div.appendChild(ol);
    mcqContainer.appendChild(div);
  });

  renderPagination(allMcqs.length, page);
}

function renderPagination(totalMcqs, currentPage) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(totalMcqs / mcqsPerPage);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'pagination-btn';
    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', function() {
      renderMCQs(i);
    });

    paginationContainer.appendChild(btn);
  }
}
