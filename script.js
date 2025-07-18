let allMcqs = [];
let currentPage = 1;
const mcqsPerPage = 10;
let currentCategory = 'General Knowledge';

fetch('https://gk-mcqs-backend.onrender.com/mcqs')
  .then(res => res.json())
  .then(data => {
    allMcqs = data;
    renderMCQs(currentCategory, currentPage);
  });

function renderMCQs(category, page) {
  const mcqContainer = document.getElementById('mcqContainer');
  mcqContainer.innerHTML = '';

  const filteredMcqs = allMcqs.filter(mcq => mcq.category === category);

  if (filteredMcqs.length === 0) {
    mcqContainer.innerHTML = '<p>No MCQs available in this category.</p>';
    renderPagination(0, 1);
    return;
  }

  const start = (page - 1) * mcqsPerPage;
  const end = start + mcqsPerPage;
  const paginatedMcqs = filteredMcqs.slice(start, end);

  paginatedMcqs.forEach((mcq, index) => {
    const div = document.createElement('div');
    div.className = 'mcq';

    const questionClass = mcq.category === 'Islamiyat' ? 'urdu-text' : '';
    div.innerHTML = `<h3 class="${questionClass}">${start + index + 1}. ${mcq.question}</h3>`;

    const ol = document.createElement('ol');

    mcq.options.forEach(opt => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.style.position = 'relative';

      li.addEventListener('click', () => {
        const existing = li.querySelector('.feedback');
        if (existing) return; // Prevent multiple clicks

        const feedback = document.createElement('span');
        feedback.className = 'feedback';
        feedback.style.position = 'absolute';
        feedback.style.right = '15px';
        feedback.style.top = '50%';
        feedback.style.transform = 'translateY(-50%)';
        feedback.style.fontWeight = 'bold';
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.5s ease';

        // ✅ Trim both option and answer to avoid whitespace errors
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
        li.style.pointerEvents = 'none'; // ✅ Prevent re-clicking
        setTimeout(() => feedback.style.opacity = '1', 50);
      });

      ol.appendChild(li);
    });

    div.appendChild(ol);
    mcqContainer.appendChild(div);
  });

  renderPagination(filteredMcqs.length, page);
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
      renderMCQs(currentCategory, i);
    });

    paginationContainer.appendChild(btn);
  }
}

const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    currentCategory = this.getAttribute('data-category');
    currentPage = 1;
    renderMCQs(currentCategory, currentPage);
  });
});

// ✅ Activate first tab on load
document.querySelector('.tab[data-category="General Knowledge"]').classList.add('active');
