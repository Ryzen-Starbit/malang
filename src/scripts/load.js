console.log("+-----------------+");
console.log("| Tejas' Codes :D |");
console.log("+-----------------+");

const content = document.getElementById("content");

// ---------------- CORE FUNCTIONS FIRST ----------------

// menu toggle
function toggleMenu() {
    vibrate();
    const nav = document.querySelector("#nav");
    const burgerButton = document.getElementById("burger");
    const burger = document.querySelector(".burger");

    const isActive = nav.classList.toggle("active");
    burgerButton.classList.toggle("active");
    burger.style.justifyContent = isActive ? "center" : "space-around";
    document.body.style.overflow = isActive ? "hidden" : "scroll";
}

// observer for nav
const observer = new MutationObserver(() => {
    const nav = document.querySelector("#nav");
    if (nav) {
        observer.disconnect();
        initNavScripts();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

function initNavScripts() {
    const burgerButton = document.getElementById("burger");
    burgerButton.addEventListener("click", toggleMenu);

    //document.getElementById("theme").addEventListener("click", () => {
    //    vibrate();
    //    applyTheme(true);
    //});
    document.getElementById("copy").addEventListener("click", function () {
        vibrate();
        let currentPage = content.src || "";
        const baseOrigin = window.location.origin;
        let pagePath = currentPage.replace(baseOrigin + "/src/pages/", "");
        const shareUrl = `${baseOrigin}/?page=${pagePath}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            const themeIcon = this.querySelector("img");
            themeIcon.src = themeIcon.src.includes("link.webp") ? "/resrc/images/icons/tick.webp" : "/resrc/images/icons/link.webp";
            setTimeout(() => {
                themeIcon.src = "/resrc/images/icons/link.webp";
            }, 1200);
        }).catch(err => {
            console.error("Failed to copy: ", err);
            showAlert("Failed", "Failed to copy URL.", [{ text: "OK" }]);
        });
    });

    // Register Service Worker
    //if ("serviceWorker" in navigator) {
    //    navigator.serviceWorker.register("/service-worker.js").catch(() => { });
    //}

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            regs.forEach(r => r.unregister());
        });
    }

    let deferredPrompt;
    const pwaBtn = document.getElementById("pwa");

    // Detect install prompt availability
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        pwaBtn.style.display = "block"; // show button only when available
    });

    // Handle PWA install button click
    if (pwaBtn) {
        pwaBtn.addEventListener("click", async () => {
            const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

            if (isInstalled) {
                showAlert("PWA Installed", "You already have the app installed.", [{ text: "OK" }]);
                return;
            }

            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                deferredPrompt = null;

                if (choice.outcome === "accepted") {
                    showAlert("PWA Installed", "The app has been successfully installed!", [{ text: "OK" }]);
                } else {
                    showAlert("Install Cancelled", "Installation was dismissed.", [{ text: "OK" }]);
                }
            } else {
                showAlert(
                    "Install Unavailable",
                    "App installation is not available or already installed.",
                    [{ text: "OK" }]
                );
            }
        });
    }

    // Handle when app is installed
    window.addEventListener("appinstalled", () => {
        showAlert("PWA Installed", "The app has been successfully installed!", [{ text: "OK" }]);
        deferredPrompt = null;
    });

    burgerButton.classList.remove('loading');
}

async function loadPage(url) {
    try {
        const response = await fetch(url);
        if (response.ok) content.src = url;
        else {
            const errorHtml = await fetch("/404.html").then(r => r.text());
            content.srcdoc = errorHtml;
        }
    } catch {
        const errorHtml = await fetch("/404.html").then(r => r.text());
        content.srcdoc = errorHtml;
    }

    const nav = document.querySelector("#nav");
    if (nav && nav.classList.contains("active")) toggleMenu();
    document.getElementById("searchOverlay").style.display = "none";
}

async function forwardParamsToIframe() {
    const params = new URLSearchParams(window.location.search);
    let page = params.get("page") || "home.html";
    let url = "";

    if (page.endsWith(".html")) url = `/src/pages/${page}`;
    else url = `/src/pages/${page}.html`;

    params.delete("page");
    const otherParams = params.toString();
    if (otherParams) url += "?" + otherParams;

    try {
        const response = await fetch(url);
        if (response.ok) {
            content.src = url;
        } else {
            const errorHtml = await fetch("/404.html").then(r => r.text());
            content.srcdoc = errorHtml;
        }
    } catch {
        const errorHtml = await fetch("/404.html").then(r => r.text());
        window.dispatchEvent(new Event("loadjs:done"));
        content.srcdoc = errorHtml;
    }

    const nav = document.querySelector("#nav");
    if (nav && nav.classList.contains("active")) toggleMenu();
}

// ---------------- REDIRECT HANDLER (RUNS LAST) ----------------
(async function handleRedirects() {
    // Get the visible URL path
    const rawPath = decodeURIComponent(window.location.href.split(window.location.origin)[1] || "/");
    const pathname = rawPath.replace(/^\/+/, "");
    // Handle shortlinks only
    if (pathname && pathname !== "index.html") {

        try {
            const res = await fetch("https://raw.githubusercontent.com/MalangBvp/redirector/main/r/redirects.json");
            if (!res.ok) throw new Error("Failed to fetch redirects.json");

            const redirects = await res.json();
            const target = redirects[pathname];

            if (target) {
                window.location.replace(target);
                return;
            } else {
                window.dispatchEvent(new Event("loadjs:done"));
            }
        } catch (err) {
            showAlert("Error", "Redirection failed. Please try again later.", [{ text: "OK" }]);
        }
    }

    // Fallback to normal site loading
    forwardParamsToIframe();
})();