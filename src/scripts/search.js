document.addEventListener("DOMContentLoaded", async () => {

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
        threshold: 0.3,
        includeMatches: true
    });

    function highlightText(text, indices) {
        if (!indices || !indices.length) return text;
        let result = "";
        let lastIndex = 0;
        indices.forEach(([start, end]) => {
            result += text.slice(lastIndex, start);
            result += `<mark>${text.slice(start, end + 1)}</mark>`;
            lastIndex = end + 1;
        });
        result += text.slice(lastIndex);
        return result;
    }

    function renderResults(results) {
        if (!results.length) {
            resultsDiv.innerHTML = `<div class="no-results">No results found.</div>`;
            return;
        }

        resultsDiv.innerHTML = results
            .map(r => {
                const item = r.item;
                const titleMatch = r.matches?.find(m => m.key === "title");
                const contentMatch = r.matches?.find(m => m.key === "content");

                const highlightedTitle = highlightText(item.title, titleMatch?.indices);
                const highlightedContent = highlightText(item.content.substring(0, 120), contentMatch?.indices);

                return `
                    <a href="#" onclick="loadPage('${item.url}'); return false;">
                        <strong>${highlightedTitle}</strong><br>
                        <small>${highlightedContent}...</small>
                    </a>
                `;
            })
            .join("");
    }

    searchToggle.addEventListener("click", () => {
        searchOverlay.style.display = "flex";
        input.focus();
        if (typeof vibrate === "function") vibrate(50);
    });

    searchClose.addEventListener("click", () => {
        searchOverlay.style.display = "none";
        input.value = "";
        resultsDiv.innerHTML = "";
    });

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