let eventsData = [];
let currentIndex = 0;
const batchSize = 7;

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

      const details = document.createElement("details");

      const summary = document.createElement("summary");
      summary.className = "title";
      summary.innerHTML = `${event.title}<p class="date">${event.date}</p>`;
      details.appendChild(summary);

      if (Array.isArray(event.images) && event.images.length > 0) {
        const imageRow = document.createElement("div");
        imageRow.className = "image-row";

        event.images.forEach(imgSrc => {
          const img = document.createElement("img");
          img.src = imgSrc;
          img.className = "event-image";

          img.addEventListener("click", () => {
            openModal({ imgSrc });
          });

          imageRow.appendChild(img);
        });

        details.appendChild(imageRow);
      }

      const desc = document.createElement("p");
      desc.className = "description";
      desc.textContent = event.description;
      details.appendChild(desc);

      eventDiv.appendChild(details);
      fragment.appendChild(eventDiv);
    });

    document.getElementById("last").before(fragment);
    currentIndex += batchSize;

    if (currentIndex >= eventsData.length) {
      viewMoreBtn.style.display = "none";
    }
  }
});
