const username = "malangbvp"; // GitHub username
const repo = "malang";        // repository name

// Fetch last updated
fetch('../../variables/last-updated.txt')
  .then(response => response.text())
  .then(date => {
    document.getElementById('last-updated').textContent = "Last Updated: " + date;
  })
  .catch(error => {
    console.error('Error fetching last updated date:', error);
  });

// Fetch structure
fetch('../../documentation/structure/structure.txt')
  .then(response => response.text())
  .then(structure => {
    document.getElementById('structure').textContent = structure;
  })
  .catch(error => {
    console.error('Error fetching structure:', error);
  });

const readmeDiv = document.getElementById("readme-content");

// Fetch README
fetch(`/README.md`)
  .then(response => response.text())
  .then(data => {
    // Configure marked to support highlight.js
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });

    const htmlContent = marked.parse(data);
    readmeDiv.innerHTML = htmlContent;

    // Highlight after inserting
    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightElement(block);
    });
  })
  .catch(error => {
    readmeDiv.textContent = "Error loading README.";
    console.error(error);
  });

  (function () {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    const showAfter = 200; // pixels scrolled before showing

    // toggle visibility
    function onScroll() {
      if (window.scrollY > showAfter) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    // smooth scroll to top
    function scrollToTop(e) {
      e && e.preventDefault();
      // prefer native smooth behavior; if not supported, fallback
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    }

    // attach listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', scrollToTop);
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        scrollToTop();
      }
    });

    // initial check
    onScroll();
  })();
