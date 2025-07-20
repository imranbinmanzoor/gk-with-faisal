"use strict";

document.addEventListener('DOMContentLoaded', () => {

  // --- Accordion Logic for Subject Cards ---
  const subjectHeaders = document.querySelectorAll('.subject-card__header');
  subjectHeaders.forEach(header => {
    const card = header.closest('.subject-card');
    const topics = card.querySelector('.topics');
    if (!card || !topics) return;

    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', topics.id);

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      card.classList.toggle('is-open', !isExpanded);
      header.setAttribute('aria-expanded', !isExpanded);
    });
  });


  // --- Show Answer Logic for MCQ Cards ---
  const mcqCards = document.querySelectorAll('.mcq-card');
  mcqCards.forEach(card => {
    const showButton = card.querySelector('.show-answer-btn');
    const answerDiv = card.querySelector('.mcq-answer');
    if (!showButton || !answerDiv) return;

    showButton.addEventListener('click', () => {
      answerDiv.classList.add('visible');
      showButton.style.display = 'none'; // Hide the button after showing the answer
    });
  });


  // --- Dark/Light Mode Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

});

// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE
// NEW FILE


"use strict";

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu (Hamburger) Logic ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
      const isOpen = mainNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // --- Interactive MCQ Answer Checking ---
  const mcqCards = document.querySelectorAll('.mcq-card');
  mcqCards.forEach(card => {
    const options = card.querySelectorAll('.mcq-option input[type="radio"]');
    const checkButton = card.querySelector('.check-answer-btn');
    const resultDiv = card.querySelector('.mcq-result');
    const correctAnswer = card.dataset.correctAnswer;

    // Enable the "Check" button only when an option is selected
    options.forEach(option => {
      option.addEventListener('change', () => {
        checkButton.disabled = false;
      });
    });

    // Handle the answer check
    checkButton.addEventListener('click', () => {
      const selectedOption = card.querySelector('input[type="radio"]:checked');
      if (!selectedOption) return;

      const userAnswer = selectedOption.parentElement.dataset.option;
      const selectedLabel = selectedOption.parentElement;
      
      // Show result message and apply styles
      if (userAnswer === correctAnswer) {
        resultDiv.textContent = 'Correct! ✅';
        resultDiv.classList.add('correct');
        selectedLabel.classList.add('correct');
      } else {
        resultDiv.textContent = `Incorrect! The correct answer is ${correctAnswer}.`;
        resultDiv.classList.add('incorrect');
        selectedLabel.classList.add('incorrect');
        // Also highlight the correct answer
        card.querySelector(`[data-option="${correctAnswer}"]`).classList.add('correct');
      }
      
      // Disable all inputs in this card after answering
      card.classList.add('answered');
      options.forEach(opt => opt.disabled = true);
      checkButton.disabled = true;
    });
  });

  // --- (Existing logic for Accordion and Theme Toggle remains the same) ---
  // --- Accordion Logic for Subject Cards on Homepage ---
  const subjectHeaders = document.querySelectorAll('.subject-card__header');
  subjectHeaders.forEach(header => { /* ... same as before ... */ });

  // --- Dark/Light Mode Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if(themeToggle) { /* ... same as before ... */ }
});

// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
// ANOTHER FILE
"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // --- App State & Constants ---
    const state = {
        mcqsData: null,
        currentPage: 1,
    };
    const MCQS_PER_PAGE = 10;

    // --- UTILITY FUNCTIONS ---
    const getParams = () => new URLSearchParams(window.location.search);
    const fetchData = async () => {
        if (state.mcqsData) return state.mcqsData;
        try {
            const response = await fetch('mcqs.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            state.mcqsData = await response.json();
            return state.mcqsData;
        } catch (error) {
            console.error('Failed to fetch MCQs data:', error);
            return null;
        }
    };

    // --- DYNAMIC RENDERING FUNCTIONS ---
    const renderHomepageSubjects = async () => {
        const container = document.getElementById('subjects-grid-container');
        if (!container) return;
        const data = await fetchData();
        if (!data) { container.innerHTML = '<p class="empty-state">Could not load subjects.</p>'; return; }

        container.innerHTML = Object.entries(data).map(([subjectKey, subject]) => {
            const topicCount = Object.keys(subject.topics).length;
            return `
                <article class="subject-card">
                    <header class="subject-card__header"><h3 class="subject-card__title">${subject.name}</h3><div class="subject-card__meta"><span>${topicCount} Topics</span><svg class="expand-topics-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></header>
                    <div class="topics">${Object.entries(subject.topics).map(([topicKey, topic]) => `<a href="mcqs.html?subject=${subjectKey}&topic=${topicKey}" class="topic">${topic.name} <span class="topic-arrow">&rarr;</span></a>`).join('')}</div>
                </article>`;
        }).join('');
        initAccordion();
    };

    const renderSidebarNav = async () => {
        const container = document.getElementById('sidebar-nav-container');
        if (!container) return;
        const data = await fetchData();
        if (!data) { container.innerHTML = '<p class="empty-state">Navigation Error</p>'; return; }

        const params = getParams();
        const activeSubject = params.get('subject'), activeTopic = params.get('topic');
        let html = '<h3 class="sidebar-title">All Subjects</h3><nav class="sidebar-nav"><ul>';
        for (const [subjectKey, subject] of Object.entries(data)) {
            html += `<li><a href="mcqs.html?subject=${subjectKey}&topic=${Object.keys(subject.topics)[0]}" class="subject-link">${subject.name}</a><ul class="topic-list">${Object.entries(subject.topics).map(([topicKey, topic]) => `<li><a href="mcqs.html?subject=${subjectKey}&topic=${topicKey}" class="${(activeSubject === subjectKey && activeTopic === topicKey) ? 'active' : ''}">${topic.name}</a></li>`).join('')}</ul></li>`;
        }
        container.innerHTML = html + '</ul></nav>';
    };

    const renderMcqsPage = async () => {
        const mainContent = document.getElementById('main-mcq-content');
        if (!mainContent) return;
        const data = await fetchData();
        const params = getParams();
        const subjectKey = params.get('subject'), topicKey = params.get('topic');
        state.currentPage = parseInt(params.get('page') || '1', 10);

        if (!data || !subjectKey || !topicKey) {
            mainContent.innerHTML = '<div class="empty-state"><h2>Select a Topic to Begin</h2><p>Please choose a subject and topic from the navigation sidebar.</p></div>';
            document.getElementById('mcq-page-title').style.display = 'none';
            document.getElementById('breadcrumb-container').style.display = 'none';
            return;
        }

        const subject = data[subjectKey], topic = subject?.topics[topicKey];
        if (!topic) { mainContent.innerHTML = '<div class="empty-state"><h2>Topic Not Found</h2></div>'; return; }
        
        document.title = `${topic.name} | ${subject.name} | GK with Faisal`;
        document.getElementById('mcq-page-title').textContent = topic.name;
        document.getElementById('breadcrumb-container').innerHTML = `<ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="mcqs.html?subject=${subjectKey}&topic=${Object.keys(subject.topics)[0]}">${subject.name}</a></li><li class="active">${topic.name}</li></ol>`;

        const totalMcqs = topic.mcqs.length;
        const start = (state.currentPage - 1) * MCQS_PER_PAGE, end = start + MCQS_PER_PAGE;
        const mcqsForPage = topic.mcqs.slice(start, end);
        
        const mcqContainer = document.getElementById('mcq-list-container');
        mcqContainer.innerHTML = (mcqsForPage.length === 0) ? '<div class="empty-state"><p>No MCQs found for this topic yet.</p></div>' : mcqsForPage.map((mcq, index) => `
            <div class="mcq-card" data-correct-answer="${mcq.answer}"><p class="mcq-question"><strong>${start + index + 1}.</strong> ${mcq.question}</p><div class="mcq-options">${mcq.options.map((option, i) => `<label class="mcq-option" data-option="${i}"><input type="radio" name="mcq${start + index}"><span>${option}</span></label>`).join('')}</div><div class="mcq-footer"><button class="btn btn--secondary check-answer-btn" disabled>Check Answer</button><div class="mcq-result"></div></div></div>`).join('');
        
        renderPagination(Math.ceil(totalMcqs / MCQS_PER_PAGE), subjectKey, topicKey);
        initMcqInteractivity();
    };

    const renderPagination = (totalPages, subjectKey, topicKey) => {
        const container = document.getElementById('pagination-container');
        if (totalPages <= 1) { container.innerHTML = ''; return; }
        const { currentPage } = state;
        const createLink = (p, text, cls = '') => `<li class="page-item ${cls}"><a class="page-link" href="?subject=${subjectKey}&topic=${topicKey}&page=${p}">${text}</a></li>`;
        
        let links = [];
        if (currentPage > 1) links.push(createLink(currentPage - 1, '‹'));
        else links.push(createLink(1, '‹', 'disabled'));

        if (currentPage > 2) links.push(createLink(1, '1'));
        if (currentPage > 3) links.push(`<li class="page-item ellipsis disabled"><span class="page-link">...</span></li>`);
        if (currentPage > 1) links.push(createLink(currentPage - 1, currentPage - 1));
        
        links.push(createLink(currentPage, currentPage, 'active'));
        
        if (currentPage < totalPages) links.push(createLink(currentPage + 1, currentPage + 1));
        if (currentPage < totalPages - 2) links.push(`<li class="page-item ellipsis disabled"><span class="page-link">...</span></li>`);
        if (currentPage < totalPages - 1) links.push(createLink(totalPages, totalPages));

        if (currentPage < totalPages) links.push(createLink(currentPage + 1, '›'));
        else links.push(createLink(totalPages, '›', 'disabled'));

        container.innerHTML = `<ul class="pagination">${links.join('')}</ul>`;
    };

    // --- EVENT LISTENERS & INITIALIZATION ---
    const initAccordion = () => document.querySelectorAll('.subject-card__header').forEach(h => h.addEventListener('click', () => h.closest('.subject-card').classList.toggle('is-open')));
    const initMcqInteractivity = () => {
        document.querySelectorAll('.mcq-card').forEach(card => {
            const checkButton = card.querySelector('.check-answer-btn');
            card.querySelector('.mcq-options').addEventListener('change', () => { checkButton.disabled = false; });
            checkButton.addEventListener('click', () => {
                const selected = card.querySelector('input[type="radio"]:checked');
                if (!selected) return;
                const userAnswer = selected.parentElement.dataset.option;
                const correctAnswer = card.dataset.correctAnswer;
                const resultDiv = card.querySelector('.mcq-result');
                if (userAnswer === correctAnswer) {
                    resultDiv.innerHTML = 'Correct! ✅'; resultDiv.style.color = 'var(--clr-success)';
                    selected.parentElement.classList.add('correct');
                } else {
                    resultDiv.innerHTML = 'Incorrect! ❌'; resultDiv.style.color = 'var(--clr-danger)';
                    selected.parentElement.classList.add('incorrect');
                    card.querySelector(`[data-option="${correctAnswer}"]`).classList.add('correct');
                }
                card.classList.add('answered');
                card.querySelectorAll('input[type="radio"]').forEach(rb => rb.disabled = true);
                checkButton.disabled = true;
            });
        });
    };
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', storedTheme);
        themeToggle.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    };
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle'), mainNav = document.getElementById('main-nav');
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
    };

    // --- PAGE INITIALIZATION ROUTER ---
    const initPage = () => {
        initThemeToggle();
        initMobileMenu();
        const path = window.location.pathname.split('/').pop();
        if (path === 'mcqs.html' || (path.endsWith('/') && getParams().has('subject'))) {
            renderSidebarNav();
            renderMcqsPage();
        } else if (path === 'index.html' || path === '' || path === '/') {
            renderHomepageSubjects();
        }
    };

    initPage();
});