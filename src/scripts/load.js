console.log("+-----------------+");
console.log("| Tejas' Codes :D |");
console.log("+-----------------+");

const content = document.getElementById("content");

// move toggleMenu outside
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

const observer = new MutationObserver(() => {
    const nav = document.querySelector("#nav");
    if (nav) {
        observer.disconnect(); // stop watching
        initNavScripts();      // run your logic
    }
});

observer.observe(document.body, { childList: true, subtree: true });

function initNavScripts() {
    const burgerButton = document.getElementById("burger");

    burgerButton.addEventListener("click", toggleMenu);

    document.getElementById("theme").addEventListener("click", () => {
        vibrate();
        applyTheme(true);
    });

    document.getElementById("pwa").addEventListener("click", function () {
        showAlert(
            "PWA Installation",
            "Install our app for faster access, offline support and a smoother experience.",
            [
                { text: "Cancel" },
                { text: "Install", onClick: () => showAlert("PWA Installation", "This feature will be available soon.", [{ text: "OK" }]) }
            ]
        );
    });

    document.getElementById("copy").addEventListener("click", function () {
        vibrate();
        navigator.clipboard.writeText(`${window.location.origin}`).then(() => {
            const themeIcon = this.querySelector("img");
            setTimeout(() => {
                themeIcon.src = "/resrc/images/icons/link.webp";
            }, 1200);
            themeIcon.src = themeIcon.src.includes("link.webp") ? "/resrc/images/icons/tick.webp" : "/resrc/images/icons/link.webp";
        }).catch(err => {
            console.error("Failed to copy: ", err);
            alert("Failed to copy URL.");
        });
    });

    burgerButton.classList.remove('loading');
}

async function loadPage(url) {
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
        content.srcdoc = errorHtml;
    }

    if (nav && nav.classList.contains("active")) toggleMenu();
}

// 👇 Forward query params into iframe, default = home.html
(async function forwardParamsToIframe() {
    const params = new URLSearchParams(window.location.search);
    let url = "/src/pages/gallery.html"; // default page

    if (params.has("mode") || params.has("type") || params.has("artist")) {
        url = "/src/pages/gallery.html";
    }

    if ([...params].length > 0) {
        url += "?" + params.toString();
    }
    await loadPage(url);
})();
