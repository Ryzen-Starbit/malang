document.addEventListener("DOMContentLoaded", async () => {

    // ✅ Utility: Wait until an element exists in DOM
    const waitForElement = (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    };

    const searchToggle = await waitForElement("#searchToggle");

    const res = await fetch("/src/components/search.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const searchOverlay = document.getElementById("searchOverlay");
    const searchClose = document.getElementById("searchClose");
    const input = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("searchResults");

    const response = await fetch("/resrc/data/search.json");
    const data = await response.json();

    const fuse = new Fuse(data, {
        keys: ["title", "content"],
        threshold: 0.3
    });

    searchToggle.addEventListener("click", () => {
        searchOverlay.style.display = "flex";
        input.focus();
        if (navigator.vibrate) navigator.vibrate(50);
    });

    searchClose.addEventListener("click", () => {
        searchOverlay.style.display = "none";
        input.value = "";
        resultsDiv.innerHTML = "";
    });

    function renderResults(results) {
        if (!results.length) {
            resultsDiv.innerHTML = `<div class="no-results">No results found.</div>`;
            return;
        }
        resultsDiv.innerHTML = results
            .map(r => `
                <a href="${r.item.url}">
                    <strong>${r.item.title}</strong><br>
                    <small>${r.item.content.substring(0, 80)}...</small>
                </a>
            `)
            .join("");
    }

    let debounceTimer;
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = input.value.trim();
            if (query.length > 0) {
                const results = fuse.search(query);
                renderResults(results);
            } else {
                resultsDiv.innerHTML = "";
            }
        }, 200);
    });

    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = "none";
        }
    });
});
