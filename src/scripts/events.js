document.addEventListener("DOMContentLoaded", () => {
  fetch('/resrc/data/events.json')
    .then(response => response.json())
    .then(events => {
      const container = document.querySelector(".events-list");
      const fragment = document.createDocumentFragment();

      if (!events || events.length === 0) {
        const msg = document.createElement("p");
        msg.className = "no-events";
        msg.textContent = "There are no live or upcoming events at the moment. Stay tuned for future updates!";
        msg.style.textAlign = "center";
        msg.style.fontStyle = "italic";
        msg.style.margin = "40px auto";
        msg.style.width = "calc(100vw - 20px)";
        msg.style.maxWidth = "1000px";
        container.appendChild(msg);
      } else {
        events.forEach(event => {
          const div = document.createElement("div");
          div.className = "event";

          // ✅ add image only if event.image exists and is not empty
          const imageHtml = (event.image && event.image.trim() !== "")
            ? `<img src="${event.image}" alt="${event.name}" loading="lazy" class="event-image same" />`
            : "";

          div.innerHTML = `
            <p class="event-name">${event.name}</p>
            <div class="event-info">
              <p class="event-date">${event.date}</p>
              <p class="event-location">${event.location}</p>
            </div>
            ${imageHtml}
            <p class="event-description">${event.description}</p>
            <div class="event-buttons">
              ${event.buttons.map(btn => {
                if (btn.alertMessage) {
                  return `
                    <button class="long-btn${btn.focus ? ' focus' : ''}" onclick="showAlert('${event.name}', '${btn.alertMessage}', [{ text: 'OK' }])">
                      ${btn.text}
                    </button>
                  `;
                } else if (btn.link) {
                  return `
                    <button class="long-btn${btn.focus ? ' focus' : ''}" onclick="window.open('${btn.link}','_blank')">
                      ${btn.text}
                    </button>
                  `;
                } else {
                  return '';
                }
              }).join('')}
            </div>
          `;

          fragment.appendChild(div);
        });

        container.appendChild(fragment);
      }

      applyTheme(false); // re-apply saved theme to newly added .same elements
      document.getElementById("loader").style.display = "none";
    })
    .catch(error => {
      console.error("Failed to load events.json:", error);
    });
});

calendar.addEventListener('load', () => {
  document.getElementById('loaderWave').style.display = 'none';
  calendar.style.display = 'block';
});
