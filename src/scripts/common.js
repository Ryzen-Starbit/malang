// Function to include HTML files dynamically on priority
document.addEventListener('DOMContentLoaded', async () => {
    // Load all other includes without blocking
    document.querySelectorAll('[data-include]').forEach(async el => {
        if (el.getAttribute('data-include') !== "nav.html") {
            const file = el.getAttribute('data-include');
            const res = await fetch(file);
            el.innerHTML = await res.text();
        }
    document.getElementById('year').textContent = new Date().getFullYear();
    });
});


// function to invert theme except for elements with class "same" on button click with id "theme"
function applyTheme(toggle = false) {
    const html = document.documentElement;
    const themeButton = document.getElementById("theme");
    const themeIcon = themeButton?.querySelector("img");

    let currentTheme = localStorage.getItem("theme") || "dark";

    if (toggle) {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", currentTheme);
    }
    html.classList.toggle("light", currentTheme === "light");
    document.querySelectorAll(".same").forEach(el => {
        el.style.filter = currentTheme === "light" ? "invert(1)" : "invert(0)";
    });
    if (themeIcon) {
        themeIcon.src = currentTheme === "light"
            ? "/resrc/images/icons/night-mode.webp"
            : "/resrc/images/icons/sun.webp";
    }
}

function toggleRestricted() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    document.querySelectorAll(".restricted").forEach(el => {
        el.style.display = isLoggedIn ? "block" : "none";
    });
    document.querySelectorAll(".protected").forEach(el => {
        el.style.display = isLoggedIn ? "none" : "flex";
    });
    const accountLogin = document.getElementById("loginForm");
    if (accountLogin) {
        document.getElementById("loginBtn").style.display = isLoggedIn ? "none" : "inline-block";
        document.getElementById("logoutBtn").style.display = isLoggedIn ? "inline-block" : "none";
    }
}


//=======================================================================common button behavior
function handleButtonAction(buttonId, loaderText, successText, taskFunction, errorText = "Failed") {
    const button = document.getElementById(buttonId);
    if (!button || typeof taskFunction !== 'function') return;

    const originalText = button.innerHTML;
    button.disabled = true;
    button.style.borderColor = 'gold';
    button.style.color = 'gold';
    button.innerHTML = `<img src="/resrc/images/icons/loading.gif" style="height: 15px; margin-bottom: -2px; filter: brightness(0) invert(1)"> ${loaderText}...`;

    Promise.resolve()
        .then(taskFunction)
        .then(() => {
            button.style.borderColor = 'green';
            button.style.color = 'green';
            button.innerHTML = `${successText}! ✔`;
            setTimeout(() => resetButton(), 4000);
        })
        .catch(() => {
            vibrate(200);
            button.style.borderColor = 'red';
            button.style.color = 'red';
            button.innerHTML = `✖ ${errorText}`;
            setTimeout(() => resetButton(), 4000);
        });

    function resetButton() {
        button.innerHTML = originalText;
        button.style.borderColor = '';
        button.style.color = '';
        button.disabled = false;
    }
}
//================================================vibration
function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}
//=========================================================
function goBack() {
    window.history.back();
}
function subscribe() {
    handleButtonAction(
        "subscribe-btn",              // button ID
        "Subscribing",                // loader text
        "Subscribed",                 // success text
        async () => {
            const field = document.getElementById("subscriber-email");
            const email = field.value.trim();
            const failureDiv = document.getElementById("failure");
            const url = "https://script.google.com/macros/s/AKfycbypXNCrvYZL-flWLRoD7DcdcgUaf98FzzDQCUdkaNURzeBFQWNqjL8vEubY8FAKM-JT/exec"; // replace with your Apps Script URL

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (navigator.vibrate) navigator.vibrate(200);
                field.value = "";
                field.focus();
                showMessage(failureDiv, "Please enter a valid email address.");
                throw new Error("Invalid email"); // fail for handleButtonAction
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("mode", "subscribe");

            const response = await fetch(url, { method: "POST", body: formData });
            const text = await response.text();

            if (!text.toLowerCase().includes("success")) {
                showMessage(failureDiv, text, false);
                throw new Error("Failed subscribe");
            }

            showMessage(failureDiv, text, true);
        },
        "Failed"
    );
}

function unsubscribe() {
    handleButtonAction(
        "unsubscribe-btn",            // button ID
        "Unsubscribing",              // loader text
        "Unsubscribed",               // success text
        async () => {
            const field = document.getElementById("unsubscribe-email");
            const email = field.value.trim();
            const failureDiv = document.getElementById("failure");
            const url = "https://script.google.com/macros/s/AKfycbypXNCrvYZL-flWLRoD7DcdcgUaf98FzzDQCUdkaNURzeBFQWNqjL8vEubY8FAKM-JT/exec"; // replace with your Apps Script URL

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (navigator.vibrate) navigator.vibrate(200);
                field.value = "";
                field.focus();
                showMessage(failureDiv, "Please enter a valid email address.");
                throw new Error("Invalid email");
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("mode", "unsubscribe");

            const response = await fetch(url, { method: "POST", body: formData });
            const text = await response.text();

            if (!text.toLowerCase().includes("success")) {
                showMessage(failureDiv, text, false);
                throw new Error("Failed unsubscribe");
            }

            showMessage(failureDiv, text, true);
        },
        "Failed"
    );
}

// Helper for UI messages
function showMessage(div, message, success = false) {
    div.style.opacity = 1;
    div.style.color = success ? "green" : "red";
    div.textContent = message;
    setTimeout(() => { div.style.opacity = 0; }, 3000);
}

/**
 * Show a customizable alert
 * @param {string} heading - Alert heading
 * @param {string} message - Alert message
 * @param {Array<{text: string, onClick?: Function}>} buttons - Array of button objects
 * @param {string} [link] - Optional clickable link
 */
function showAlert(heading, message, buttons = [{ text: 'OK' }], link) {
    vibrate(50);

    // Remove existing alert
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.57)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
    });

    // Alert Box
    const box = document.createElement('div');
    Object.assign(box.style, {
        backgroundColor: '#000',
        borderRadius: '10px',
        border: '1px solid rgb(50,50,50)',
        textAlign: 'left',
        maxWidth: '300px',
        width: '80%',
        transform: 'translateY(-30px)'
    });

    // Heading
    const h = document.createElement('h3');
    h.textContent = heading;
    Object.assign(h.style, {
        margin: '0 0 10px',
        padding: '10px',
        borderBottom: '1px solid rgb(50,50,50)'
    });

    // Message
    const m = document.createElement('p');
    m.textContent = message;
    Object.assign(m.style, { padding: '0 10px' });

    box.appendChild(h);
    box.appendChild(m);

    // Optional link
    if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = link;
        a.target = "_blank";
        Object.assign(a.style, {
            display: 'block',
            padding: '0 10px 10px',
            color: '#1bbeff',
            textDecoration: 'underline',
            wordBreak: 'break-all'
        });
        box.appendChild(a);
    }

    // Buttons container
    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        padding: '10px'
    });

    buttons.forEach(btnObj => {
        const btn = document.createElement('button');
        btn.textContent = btnObj.text;
        Object.assign(btn.style, {
            padding: '8px 16px',
            backgroundColor: '#141414ff',
            borderRadius: '5px',
            border: '1px solid rgb(50,50,50)',
            color: 'white',
            cursor: 'pointer'
        });

        btn.onclick = () => {
            overlay.remove();
            if (btnObj.onClick) btnObj.onClick();
        };

        btnContainer.appendChild(btn);
    });

    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

// Intercept all external links opening in a new tab
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[target="_blank"]');
    if (!link) return; // not a new-tab link

    e.preventDefault(); // prevent default navigation

    // Show custom environment alert
    showAlert(
        "You're leaving Malang's environment",
        "You are about to open an external site. Do you want to proceed?",
        [
            {
                text: "Cancel",
                onClick: () => {} // just close alert
            },
            {
                text: "Proceed",
                onClick: () => {
                    window.open(link.href, "_blank");
                }
            }
        ],
        link.href // show the link as clickable inside alert
    );
});
