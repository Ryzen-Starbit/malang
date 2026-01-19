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
            const imagePromises = [];

            function loadImageWithFallback(img, primarySrc, fallbackSrc) {
                return new Promise((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        img.onerror = () => resolve();
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

                    imagePromises.push(loadImageWithFallback(img, imagePath, fallbackPath));

                    img.alt = "";
                    img.style.cursor = "pointer";

                    img.addEventListener("click", () => {
                        openModal({
                            imgSrc: img.src,
                            name: `Name: ${member.name}`,
                            subtitle: `Position: ${member.role}`,
                            extraInfo: {
                                batch: `Batch: ${genData.year.slice(-4)}`,
                                branch: `Branch: ${member.branch || "NA"}`
                            },
                            socials: {
                                instagram: member.instagram,
                                linkedin: member.linkedin,
                                email: member.email,
                                github: member.github,
                                website: member.website
                            }
                        });
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

            Promise.all(imagePromises)
                .then(() => {
                    if (loader) loader.style.display = "none";
                })
                .catch((err) => {
                    if (loader) loader.textContent = "Failed to load alumni data.";
                    console.error("Alumni data load error:", err);
                });
        })
        .catch((err) => {
            if (loader) loader.textContent = "Failed to load alumni data.";
            console.error("Alumni data load error:", err);
        });
}