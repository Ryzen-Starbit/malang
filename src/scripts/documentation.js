const readmeDiv = document.getElementById("readme-content");
document.getElementById("loader").style.display = "flex";

// Track async tasks
Promise.all([
  // last-updated
  fetch('../../variables/last-updated.txt')
    .then(res => res.text())
    .then(date => {
      document.getElementById('last-updated').textContent = "Last Updated: " + date;
    }),

  // structure
  fetch('../../documentation/structure/structure.txt')
    .then(res => res.text())
    .then(structure => {
      document.getElementById('structure').textContent = structure;
    }),

  // README
  fetch('/README.md')
    .then(res => res.text())
    .then(data => {
      marked.setOptions({
        highlight: function (code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        }
      });

      const htmlContent = marked.parse(data);
      readmeDiv.innerHTML = htmlContent;

      document.querySelectorAll("pre code").forEach(block => {
        hljs.highlightElement(block);
      });
    })
])
  .then(() => {
    // Hide loader once everything is done
    document.getElementById("loader").style.display = "none";
  })
  .catch(err => {
    console.error(err);
    document.getElementById("loader").style.display = "none"; // hide even if error
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
