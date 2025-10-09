// Set your prefix here (must start and end with a slash)
const PREFIX = '/r/';

fetch('redirects.json')
  .then(response => response.json())
  .then(redirects => {
    const pathname = window.location.pathname;

    // Inject minimal HTML and fade styling
    document.body.innerHTML = `
      <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: black;
  color: white;
  text-align: center;
  font-family: sans-serif;
  overflow: hidden;
}

/* Container centering and fade transition */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  opacity: 1;
  transition: opacity 1s ease-in-out;
}

img {
  height: 100px;
  margin-top: -20vh;
  padding: 20px;
  user-select: none;
  pointer-events: none;
  transition: transform 0.8s ease-in-out, opacity 1s ease-in-out;
}

#manualLinkContainer {
  opacity: 0;
  margin-top: 15px;
  transition: opacity 0.3s ease-in-out;
}

a {
  padding: 10px 20px;
  border-radius: 20px;
  background-color: rgba(127, 127, 127, 0.24); /* #7f7f7f3c */
  border: 1px solid #404040;
  text-decoration: none;
  color: #e9e9e9;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

/* Link hover effect */
a:hover {
  background-color: #e9e9e9;
  color: black;
  transform: scale(1.05);
}

/* Optional: fade-in effect on load for container */
.container.fade-in {
  opacity: 1;
}

.container.fade-out {
  opacity: 0;
}
      </style>
      <div class="container" id="fadeContainer">
        <img src="/resrc/images/icons/malang.webp" alt="Malang" id="malangLogo">
        <p id="manualLinkContainer">
          <a id="manualLink" href="#">Go</a>
        </p>
      </div>
    `;

    const container = document.getElementById('fadeContainer');

    if (pathname.startsWith(PREFIX)) {
      const slug = window.location.hash.slice(2); // remove #/
      const targetUrl = redirects[slug];

      if (targetUrl) {
        const manualLink = document.getElementById('manualLink');
        const manualLinkContainer = document.getElementById('manualLinkContainer');
        manualLink.href = targetUrl;

        // Show manual link as fallback after 2s
        setTimeout(() => {
          manualLinkContainer.style.opacity = 1;
        }, 3000);

        // Start fade-out transition before redirect
        setTimeout(() => {
          container.style.opacity = 0; // fade out
          setTimeout(() => {
            // Replace page after fade-out completes
            window.location.replace(targetUrl);
          }, 1000); // duration matches CSS transition (1s)
        }, 1500); // how long logo stays visible before fading
      } else {
        document.body.innerHTML = `
          <div class="container">
            <img src="/resrc/images/icons/malang.webp" alt="Malang">
            <h1 style="color:white;font-family:sans-serif;">404 - Page Not Found</h1>
            <p style="color:gray;">No redirect found for "<code>${slug}</code>".</p>
          </div>
        `;
      }
    } else {
      document.body.innerHTML = `
        <div class="container">
          <img src="/resrc/images/icons/malang.webp" alt="Malang">
          <h1 style="color:white;font-family:sans-serif;">Invalid URL</h1>
          <p style="color:gray;">This redirect only works under "<code>${PREFIX}</code>".</p>
        </div>
      `;
    }
  })
  .catch(error => {
    console.error('Redirect failed:', error);
    document.body.innerHTML = `
      <div class="container" style="color:white;font-family:sans-serif;">
        <img src="/resrc/images/icons/malang.webp" alt="Malang">
        <h1>Something went wrong.</h1>
      </div>`;
  });
