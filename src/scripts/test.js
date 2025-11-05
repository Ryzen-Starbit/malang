document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        // Simulate loading time for demonstration purposes
        setTimeout(() => {
            loader.style.display = "none";
        }, 1000); // Adjust the timeout duration as needed
    }
});

const blob = document.getElementById("blob");


function randomRadius() {
    return `${40 + Math.random() * 40}% ${40 + Math.random() * 40}% ${40 + Math.random() * 40}% ${40 + Math.random() * 40}% /
          ${40 + Math.random() * 40}% ${40 + Math.random() * 40}% ${40 + Math.random() * 40}% ${40 + Math.random() * 40}%`;
}

function morphBlob() {
    blob.style.borderRadius = randomRadius();
}

// change smoothly every 5 seconds
setInterval(morphBlob, 5000);