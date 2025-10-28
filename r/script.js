// Set your prefix (must start and end with a slash)
const PREFIX = '/r/';
console.log('Redirector script loaded. Prefix:', PREFIX);
// Fetch the redirects JSON from GitHub
fetch('https://raw.githubusercontent.com/multiverseweb/redirector/main/r/redirects.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load redirects.json');
    return response.json();
  })
  .then(redirects => {
    const pathname = window.location.pathname;

    // Minimal HTML with fade
    document.body.innerHTML = `
      <div class="container" id="fadeContainer">
        <img src="/resrc/images/icons/malang.webp" alt="Malang" id="malangLogo">
        <p id="manualLinkContainer">
          <a id="manualLink" href="#">Go</a>
        </p>
      </div>
    `;

    const container = document.getElementById('fadeContainer');

    if (pathname.startsWith(PREFIX)) {
      const slug = pathname.slice(PREFIX.length).replace(/\/+$/, '');
      const targetUrl = redirects[slug];

      if (targetUrl) {
        const manualLink = document.getElementById('manualLink');
        const manualLinkContainer = document.getElementById('manualLinkContainer');
        manualLink.href = targetUrl;

        // Show fallback link after 2s
        setTimeout(() => {
          manualLinkContainer.style.opacity = 1;
        }, 2000);

        // Fade and redirect
        setTimeout(() => {
          container.style.opacity = 0;
          setTimeout(() => {
            window.location.replace(targetUrl);
          }, 1000);
        }, 1500);
      } else {
        document.body.innerHTML = `
          <div class="container">
            <img src="/resrc/images/icons/malang.webp" alt="Malang">
            <h1>404 - Page Not Found</h1>
            <p>No redirect found for "<code>${slug}</code>".</p>
          </div>
        `;
      }
    } else {
      document.body.innerHTML = `
        <div class="container">
          <img src="/resrc/images/icons/malang.webp" alt="Malang">
          <h1>Invalid URL</h1>
          <p>This redirect only works under "<code>${PREFIX}</code>".</p>
        </div>
      `;
    }
  })
  .catch(error => {
    console.error('Redirect failed:', error);
    document.body.innerHTML = `
      <div class="container">
        <img src="/resrc/images/icons/malang.webp" alt="Malang">
        <h1>Something went wrong.</h1>
        <p>${error.message}</p>
      </div>`;
  });
