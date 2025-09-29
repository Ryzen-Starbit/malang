let eventsData = [];
let currentIndex = 0;
const batchSize = 5;

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const viewMoreBtn = document.getElementById("viewMoreBtn");

  fetch('../../resrc/data/timeline.json')
    .then(res => res.json())
    .then(data => {
      eventsData = data;
      loader.style.display = 'none';
      viewMoreBtn.style.display = 'block';
      loadNextBatch();
      applyTheme(false); // re-apply saved theme to newly added .same elements
    })
    .catch(err => {
      console.error("Error loading events:", err);
      loader.textContent = "Failed to load events.";
    });

  viewMoreBtn.addEventListener("click", loadNextBatch);

  function loadNextBatch() {
    const fragment = document.createDocumentFragment();
    const slice = eventsData.slice(currentIndex, currentIndex + batchSize);

    slice.forEach(event => {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event";

      let html = `
        <details>
          <summary class="title">${event.title}
            <p class="date">${event.date}</p>
          </summary>
      `;

      if (Array.isArray(event.images)) {
        html += `<div class="image-row">`;
        event.images.forEach(img => {
          html += `<img src="${img}" class="event-image same" loading="lazy">`;
        });
        html += `</div>`;
      }

      html += `<p class="description">${event.description}</p></details>`;
      eventDiv.innerHTML = html;
      fragment.appendChild(eventDiv);
    });

    document.getElementById("last").before(fragment);
    currentIndex += batchSize;

    if (currentIndex >= eventsData.length) {
      viewMoreBtn.style.display = "none";
    }
  }
});
