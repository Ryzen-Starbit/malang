const container = document.getElementById("members");
const loader = document.getElementById("loader");

if (container) {
    if (loader) loader.style.display = "flex";

    fetch("../../resrc/data/alumni.json")
        .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then((data) => {
            const imagePromises = []; // collect all image load promises here

            // helper for loading with fallback
            function loadImageWithFallback(img, primarySrc, fallbackSrc) {
                return new Promise((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        img.onerror = () => resolve(); // fallback loaded or failed
                        img.onload = () => resolve();
                        img.src = fallbackSrc;
                    };
                    img.src = primarySrc;
                });
            }

            data.forEach((genData) => {
                const wrapper = document.createElement("div");
                wrapper.className = "table-wrapper";

                const year = document.createElement("p");
                year.className = "vertical";
                year.textContent = genData.year;

                const gen = document.createElement("p");
                gen.className = "vertical";
                gen.textContent = genData.generation;

                const table = document.createElement("table");
                const imgRow = document.createElement("tr");
                const nameRow = document.createElement("tr");
                const roleRow = document.createElement("tr");

                genData.members.forEach((member) => {
                    const imgTd = document.createElement("td");
                    const img = document.createElement("img");

                    const imagePath = `../../resrc/images/members/${member.image}`;
                    const fallbackPath = "../../resrc/images/members/person.png";

                    // track this image promise
                    imagePromises.push(loadImageWithFallback(img, imagePath, fallbackPath));

                    img.alt = "";
                    //img.className = "same";
                    img.style.cursor = "pointer";

                    // modal click
                    img.addEventListener("click", () => {
                        document.querySelector("section").classList.add("modal-active");
                        document.getElementById("image-modal").style.display = "flex";
                        document.getElementById("modal-image").src = img.src;
                        document.getElementById("modal-title").textContent = `Name: ${member.name}`;
                        document.getElementById("modal-position").textContent = `Position: ${member.role}`;
                        document.getElementById("modal-batch").textContent = `Batch: ${genData.year.slice(-4)}`;
                        document.getElementById("modal-branch").textContent = `Branch: ${member.branch || "NA"}`;

                        const socials = document.getElementById("modal-socials");
                        socials.innerHTML = "";
                        if (member.instagram)
                            socials.innerHTML += `<a href="${member.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>`;
                        if (member.linkedin)
                            socials.innerHTML += `<a href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>`;
                        if (member.email)
                            socials.innerHTML += `<a href="mailto:${member.email}" target="_blank"><i class="far fa-envelope"></i></a>`;
                        if (member.github)
                            socials.innerHTML += `<a href="${member.github}" target="_blank"><i class="fab fa-github"></i></a>`;
                        if (member.website)
                            socials.innerHTML += `<a href="${member.website}" target="_blank"><i class="fas fa-globe"></i></a>`;
                    });

                    imgTd.appendChild(img);
                    imgRow.appendChild(imgTd);

                    const nameTd = document.createElement("td");
                    nameTd.textContent = member.name;
                    nameTd.style.lineHeight = "15px";
                    nameRow.appendChild(nameTd);

                    const roleTd = document.createElement("td");
                    roleTd.style.fontSize = "12px";
                    roleTd.textContent = member.role;
                    roleRow.appendChild(roleTd);
                });

                table.appendChild(imgRow);
                table.appendChild(nameRow);
                table.appendChild(roleRow);

                wrapper.appendChild(year);
                wrapper.appendChild(gen);
                wrapper.appendChild(table);

                container.appendChild(wrapper);
            });

            // hide loader only after ALL images are loaded (including fallbacks)
            Promise.all(imagePromises)
                .then(() => {
                    if (loader) loader.style.display = "none";
                    applyTheme(false); // re-apply saved theme to newly added .same elements
                })
                .catch((err) => {
                    if (loader) loader.textContent = "Failed to load alumni data.";
                    console.error("Alumni data load error:", err);
                });

            // Modal close
            document.querySelector(".modal-close")?.addEventListener("click", () => {
                document.querySelector("section").classList.remove("modal-active");
                document.getElementById("image-modal").style.display = "none";
            });

            window.addEventListener("click", (e) => {
                if (e.target.id === "image-modal") {
                    document.querySelector("section").classList.remove("modal-active");
                    document.getElementById("image-modal").style.display = "none";
                }
            });
        })
        .catch((err) => {
            if (loader) loader.textContent = "Failed to load alumni data.";
            console.error("Alumni data load error:", err);
        });
}