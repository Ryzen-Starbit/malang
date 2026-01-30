(() => {
    const form = document.getElementById("coreForm");
    const passwordInput = document.getElementById("password");
    const error = document.getElementById("error");

    if (!form || !passwordInput) return;

    const authMap = {
        treasury: ["dHJlYXN1cnk=", "treasury.html"],
        redirector: ["bWVtYmVy", "redirector.html"],
    };

    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");

    if (!authMap[page]) {
        showAlert("Error", "Invalid or missing page parameter.", [{ text: "OK", onClick: () => { } }]);
        return;
    }

    const [encoded, redirectUrl] = authMap[page];

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = passwordInput.value.trim();
        const b64 = btoa(input);

        if (b64 === encoded) {
            vibrate(50);
            window.location.href = redirectUrl;
        } else {
            passwordInput.value = "";
            passwordInput.focus();
            passwordInput.style.border = "1px solid rgb(250, 53, 53)";
            error.style.opacity = 1;
            setTimeout(() => {
                passwordInput.style.border = "";
                error.style.opacity = 0;
            }, 3000);
            vibrate(200);
        }
    });
})();


document.addEventListener('DOMContentLoaded', () => {
    loader=document.getElementById("loader");
    if(loader){
        loader.style.display="none";
    }
});

const canvas = document.getElementById('gradientCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let pointer = { x: canvas.width / 2, y: canvas.height / 2 };
    let hue = 0;
    let opacity = 0;
    let targetOpacity = 0;
    let lastMoveTime = Date.now();
    let trail = [];

    const maxTrailLength = 20;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function updatePointer(e) {
        lastMoveTime = Date.now();
        targetOpacity = 1;

        if (e.touches && e.touches.length > 0) {
            pointer.x = e.touches[0].clientX;
            pointer.y = e.touches[0].clientY;
        } else {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        }

        trail.push({ x: pointer.x, y: pointer.y, time: Date.now() });

        if (trail.length > maxTrailLength) trail.shift();
    }

    function animate() {
        const now = Date.now();
        if (now - lastMoveTime > 400) targetOpacity = 0;
        opacity += (targetOpacity - opacity) * 0.1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (opacity > 0.01) {
            hue = (hue + 2) % 360;

            trail.forEach((point, i) => {
                const age = (now - point.time) / 400;
                const alpha = Math.max(0, opacity * (1 - age));
                const size = 100 * (1 - i / maxTrailLength);

                const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size);
                gradient.addColorStop(0, `hsla(${(hue + i * 10) % 360}, 100%, 60%, ${alpha * 0.6})`);
                gradient.addColorStop(0.4, `hsla(${(hue + 60 + i * 5) % 360}, 100%, 60%, ${alpha * 0.3})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', updatePointer);
    window.addEventListener('touchmove', updatePointer);
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    toggleRestricted();
});
