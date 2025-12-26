const readmeDiv = document.getElementById("readme-content");
document.getElementById("loader").style.display = "flex";

// Track async tasks
Promise.all([
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

      document.querySelectorAll("pre").forEach(pre => {
        const btn = document.createElement("button")
        btn.textContent = "Copy"
        btn.style.position = "absolute"
        btn.style.top = "6px"
        btn.style.right = "6px"
        btn.style.padding = "2px 5px"

        pre.style.position = "relative"
        pre.appendChild(btn)

        btn.onclick = () => {
          const code = pre.querySelector("code").textContent  // copy ONLY code
          navigator.clipboard.writeText(code)
          btn.textContent = "Copied!"
          setTimeout(() => (btn.textContent = "Copy"), 1200)
        }
      })
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

  const showAfter = 200;

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

  onScroll();
})();

function toggleList() {
  const t = document.getElementById("docList"), i = document.getElementById("toggleListIcon");
  if (!t || !i) return;
  const s = t.style.visibility === "visible";
  Object.assign(t.style, {
    visibility: s ? "hidden" : "visible",
    opacity: s ? "0" : "1",
    filter: s ? "blur(5px)" : "blur(0)"
  });
  document.body.style.overflow = s ? "" : "hidden";
  i.src = s ? "/resrc/images/icons/admin.webp" : "/resrc/images/icons/close.png";
  vibrate();
}

const url = "https://api.github.com/repos/malangbvp/malang/commits/main";

fetch(url)
  .then(r => r.json())
  .then(d => {
    lastCommit.innerText = d.commit.message.split('\n')[0];
    lastUpdated.innerText = new Date(d.commit.committer.date).toLocaleString();
  });
