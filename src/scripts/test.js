
var i = 0;
var stars = document.getElementById("landingCanvas");
//-----------------------------------------------------------number of stars
for (i = 0; i < 200; i++) {
    let star = document.createElement('div');
    star.classList.add("star");

    let size = Math.random() * 2 + 1;
    //--------------------------------------------------------------------------
    const _width = stars.scrollWidth - 2;
    star.style.top = Math.random() * (stars.scrollHeight + 20) + "px";
    star.style.left = Math.random() * _width + "px";
    star.style.width = size + "px";
    star.style.height = size + "px";
    //--------------------------------------------------------------------------

    let delayValue = Math.random() * 4;

    star.style.animationDelay = delayValue + "s";

    stars.appendChild(star);
}

function createFirework(x, y) {
    const colors = ["#ffff33", "gold", "#ffa500"];
    for (let i = 0; i < 40; i++) {
        const fw = document.createElement("div");
        fw.className = "firework";
        fw.style.left = x + "px";
        fw.style.top = y + "px";
        fw.style.background = colors[Math.floor(Math.random() * colors.length)];
        fw.style.setProperty("--x", `${(Math.random() - 0.5) * 400}px`);
        fw.style.setProperty("--y", `${(Math.random() - 0.5) * 400}px`);
        document.body.appendChild(fw);

        setTimeout(() => fw.remove(), 2000);
    }
}

// Run fireworks for 3 seconds only
const interval = setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight / 2;
    createFirework(x, y);
}, 500);

setTimeout(() => clearInterval(interval), 3000);

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight
    });
}

const loader = document.getElementById("loader");
document.fonts.load("1em " + getComputedStyle(kalakaar).fontFamily).then(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
});
