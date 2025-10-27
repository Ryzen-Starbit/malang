document.addEventListener("DOMContentLoaded", async () => {
    const body = document.body;

    // Load the search overlay HTML component
    const res = await fetch("/src/components/search.html");
    const html = await res.text();
    body.insertAdjacentHTML("beforeend", html);

    const searchToggle = document.getElementById("searchToggle");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchClose = document.getElementById("searchClose");
    const input = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("searchResults");

    // Load Fuse.js data
    const response = await fetch("/resrc/data/search.json");
    const data = await response.json();

    const fuse = new Fuse(data, {
        keys: ["title", "content"],
        threshold: 0.3
    });

    // Show search overlay
    searchToggle.addEventListener("click", () => {
        searchOverlay.style.display = "flex";
        input.focus();
        vibrate(50);
    });

    // Hide overlay
    searchClose.addEventListener("click", () => {
        searchOverlay.style.display = "none";
        input.value = "";
        resultsDiv.innerHTML = "";
    });

    // Render results
    function renderResults(results) {
        if (!results.length) {
            resultsDiv.innerHTML = `<div class="no-results">No results found.</div>`;
            return;
        }
        resultsDiv.innerHTML = results
            .map(
                r => `<a href="/index.html?page=${r.item.url}">
                <strong>${r.item.title}</strong><br>
                <small>${r.item.content.substring(0, 80)}...</small>
              </a>`
            )
            .join("");
    }

    // Debounced search input
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

    // Close overlay when clicking outside
    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = "none";
        }
    });
});
