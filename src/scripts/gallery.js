(() => {
    const t = document.getElementById("gallery"),
        e = document.getElementById("viewMoreBtn"),
        n = document.getElementById("loader"),
        s = document.getElementById("none"),
        a = document.getElementById("filtersContainer"),
        o = document.getElementById("copyFiltersBtn"),
        r = document.getElementById("copyFiltersIcon"),
        l = document.getElementById("heading");
    let i = "artworks",
        c = {},
        d = [],
        p = 0,
        y = new Set,
        g = "all",
        u = "all",
        m = g,
        f = u;

    function h() {
        document.querySelectorAll(".filter-btn.type").forEach((t => {
            t.classList.toggle("pending", t.dataset.filter === m)
        })), document.querySelectorAll(".filter-btn.artist").forEach((t => {
            t.classList.toggle("pending", t.dataset.filter === f)
        }))
    }

    function w() {
        const t = new URLSearchParams(window.location.search);
        return {
            mode: t.get("mode") || void 0,
            type: t.get("type") || void 0,
            artist: t.get("artist") || void 0
        }
    }

    function v({
        mode: t,
        type: e,
        artist: n
    }, s = !0) {
        const a = new URLSearchParams;
        a.set("page", "gallery"), t && "artworks" !== t && a.set("mode", t), e && "all" !== e && a.set("type", e), n && "all" !== n && a.set("artist", n);
        const o = `${location.pathname}${a.toString()?"?"+a.toString():""}${location.hash||""}`;
        s ? history.replaceState({}, "", o) : history.pushState({}, "", o)
    }
    async function E() {
        try {
            const t = new URLSearchParams;
            t.set("page", "gallery"), i && "artworks" !== i && t.set("mode", i), g && "all" !== g && t.set("type", g), u && "all" !== u && t.set("artist", u);
            const e = `${window.location.origin}/index.html${t.toString()?"?"+t.toString():""}`;
            await navigator.clipboard.writeText(e), r.src = "/resrc/images/icons/tick.webp", setTimeout((() => r.src = "/resrc/images/icons/link.webp"), 1500)
        } catch (t) {
            window.prompt("Copy this link:", parentUrl)
        }
    }

    function k() {
        document.querySelectorAll(".filter-btn.type").forEach((t => {
            t.classList.toggle("selected", t.dataset.filter === g)
        })), document.querySelectorAll(".filter-btn.artist").forEach((t => {
            t.classList.toggle("selected", t.dataset.filter === u)
        }))
    }

    function b(t) {
        const e = t.target.closest(".filter-btn");
        if (e) {
            if (e.classList.contains("type")) m = e.dataset.filter || "all";
            else {
                if (!e.classList.contains("artist")) return;
                f = e.dataset.filter || "all"
            }
            h()
        }
    }

    function L() {
        if (!d || 0 === d.length) return e.style.display = "none", void(s.style.display = "flex");
        const a = [];
        for (; a.length < 20 && p < d.length;) {
            const t = d[p];
            p++;
            const e = "all" === g || t.typeToken === g,
                n = "all" === u || t.artistToken === u;
            e && n && !y.has(t.imageId) && (a.push(t), y.add(t.imageId))
        }
        if (0 === a.length) return void(p >= d.length && (0 === t.children.length ? (s.style.display = "flex", e.style.display = "none") : e.style.display = "none"));
        const o = document.createDocumentFragment(),
            r = [];
        for (const t of a) {
            const e = document.createElement("div");
            e.className = "gallery-item";
            const n = document.createElement("img");
            n.src = t.src, n.alt = t.alt, n.className = `${t.typeToken} ${t.artistToken}`, e.appendChild(n), o.appendChild(e), r.push(new Promise((t => {
                if (n.complete) return t();
                n.onload = n.onerror = () => t()
            })))
        }
        t.appendChild(o), Promise.all(r).then((() => {
            n.style.display = "none", applyTheme?.()
        })), p >= d.length ? e.style.display = "none" : e.style.display = "block";
        const l = t.querySelectorAll(".gallery-item").length;
        s.style.display = 0 === l ? "flex" : "none"
    }
    async function A(o) {
        s.style.display = "none", n.style.display = "flex", t.innerHTML = "", y = new Set, p = 0, e.style.display = "none", i = o, await async function(t) {
                const e = "artworks" === t ? "../../resrc/data/artworks.json" : "../../resrc/data/photographs.json";
                try {
                    const t = await fetch(e),
                        n = await t.json();
                    c = n || {}
                } catch (t) {
                    c = {}
                }
            }(o),
            function(t) {
                const e = "artworks" === t ? 68 : 49;
                d = Array.from({
                    length: e
                }, ((e, n) => {
                    const s = String(n),
                        a = "artworks" === t ? `/resrc/images/artworks/${s}.webp` : `/resrc/images/photographs/${s}.webp`,
                        o = c[s] || {},
                        r = (o.type || "unknown").replace(/\s+/g, "-"),
                        l = (o.artist || "unknown").replace(/\s+/g, "-");
                    return {
                        imageId: s,
                        src: a,
                        alt: o.title || "Untitled",
                        typeToken: r,
                        artistToken: l,
                        meta: o
                    }
                })), p = 0, y = new Set
            }(o),
            function() {
                const t = new Set,
                    e = new Set;
                d.forEach((n => {
                    n.meta && n.meta.type && t.add(n.meta.type), n.meta && n.meta.artist && e.add(n.meta.artist)
                }));
                const n = document.getElementById("filters-type");
                n.innerHTML = "<p>Type</p>", n.insertAdjacentHTML("beforeend", '<button class="filter-btn type" data-filter="all">All</button>'), Array.from(t).sort().forEach((t => {
                    const e = t.replace(/\s+/g, "-");
                    n.insertAdjacentHTML("beforeend", `<button class="filter-btn type" data-filter="${e}">${t}</button>`)
                }));
                const s = document.getElementById("filters-artist");
                s.innerHTML = "artworks" === i ? "<p>Artist</p>" : "<p>Shot By</p>", s.insertAdjacentHTML("beforeend", '<button class="filter-btn artist" data-filter="all">All</button>'), Array.from(e).sort().forEach((t => {
                    const e = t.replace(/\s+/g, "-");
                    s.insertAdjacentHTML("beforeend", `<button class="filter-btn artist" data-filter="${e}">${t}</button>`)
                })), k(), h(), a.removeEventListener("click", b), a.addEventListener("click", b)
            }();
        const r = w();
        r.type && (g = r.type), r.artist && (u = r.artist), k(), L(), setTimeout((() => {
            n.style.display = "none"
        }), 3e3)
    }

    function S() {
        const t = w(),
            e = i.charAt(0).toUpperCase() + i.slice(1),
            n = t.artist,
            s = i || "work";
        if (n && "all" !== n) {
            const t = n.replace(/-/g, " ");
            l.textContent = `${t}'s ${s.charAt(0).toUpperCase()+s.slice(1)}`
        } else l.textContent = e
    }

    function b(t) {
        const e = t.target.closest(".filter-btn");
        if (e) {
            if (e.classList.contains("type")) g = e.dataset.filter || "all";
            else {
                if (!e.classList.contains("artist")) return;
                u = e.dataset.filter || "all"
            }
            k()
        }
    }
    document.getElementById("apply")?.addEventListener("click", (() => {
        v({
            mode: i,
            type: g,
            artist: u
        }, !0), S(), n.style.display = "flex", A(i), toggleFilters()
    })), async function() {
        ! function() {
            const n = document.getElementById("photographs"),
                s = document.getElementById("artworks");
            n.addEventListener("click", (() => {
                i = "photographs", g = "all", u = "all", v({
                    mode: i,
                    type: g,
                    artist: u
                }, !0), A(i), S()
            })), s.addEventListener("click", (() => {
                i = "artworks", g = "all", u = "all", v({
                    mode: i,
                    type: g,
                    artist: u
                }, !0), A(i), S()
            })), e.addEventListener("click", (() => {
                L()
            })), o && o.addEventListener("click", E), t.addEventListener("click", (t => {
                const e = t.target.closest("img");
                if (!e) return;
                const n = e.src.split("/").pop().split(".")[0],
                    s = c[n] || {};
                openModal({
                    imgSrc: e.src,
                    title: s.title || "",
                    subtitle: `~ ${s.artist||"NA"}`
                })
            }))
        }();
        const n = w(),
            s = "photographs" === n.mode ? "photographs" : "artworks";
        g = n.type || "all", u = n.artist || "all", v({
            mode: s,
            type: g,
            artist: u
        }, !0), await A(s), S(), window.addEventListener("popstate", (() => {
            const t = w();
            g = t.type || "all", u = t.artist || "all";
            A("photographs" === t.mode ? "photographs" : "artworks"), S()
        }))
    }()
})();
const secureAction = t => {
    t.preventDefault(), t.stopPropagation(), showAlert("⚠️ Warning", "All artworks and photographs displayed on this page are the exclusive property of Malang and are subject to copyright protection. Unauthorized copying, downloading or use of these images may result in legal proceedings.", [{
        text: "OK"
    }]), navigator.vibrate(150);
    try {
        navigator.clipboard?.writeText?.("")
    } catch {}
};

function toggleFilters() {
    const t = document.getElementById("filtersContainer");
    if (!t) return;
    "hidden" === getComputedStyle(t).visibility ? (t.style.visibility = "visible", t.style.opacity = "1", t.style.filter = "blur(0)", document.body.style.overflow = "hidden", document.getElementById("toggleFiltersIcon").src = "/resrc/images/icons/close.png") : (t.style.visibility = "hidden", t.style.opacity = "0", t.style.filter = "blur(5px)", document.body.style.overflow = "", document.getElementById("toggleFiltersIcon").src = "/resrc/images/icons/filters.png"), vibrate()
}
document.addEventListener("keydown", (function(t) {
    const e = (t.key || "").toLowerCase();
    ((t.ctrlKey || t.metaKey) && ("c" === e || "s" === e || "u" === e || "j" === e || "i" === e) || "f12" === e || "printscreen" === e || "print" === e || "snapshot" === e || t.altKey && "printscreen" === e || t.shiftKey && "printscreen" === e || "Meta" === t.key && t.shiftKey && ("3" === e || "4" === e)) && secureAction(t)
})), document.addEventListener("contextmenu", (function(t) {
    secureAction(t)
})), document.addEventListener("selectstart", (function(t) {
    t.preventDefault()
})), document.querySelectorAll("img").forEach((t => {
    t.setAttribute("draggable", "false"), t.addEventListener("dragstart", secureAction)
}));
let lock = !1;
const warn = () => {
    lock || (showAlert("⚠️ Warning", "All artworks and photographs displayed on this page are the exclusive property of Malang and are subject to copyright protection. Unauthorized copying, downloading or use of these images may result in legal proceedings.", [{
        text: "OK"
    }]), lock = !0, setTimeout((() => lock = !1), 2500))
};
addEventListener("wheel", (t => {
    t.ctrlKey && (t.preventDefault(), warn())
}), {
    passive: !1
}), addEventListener("keydown", (t => {
    (t.ctrlKey || t.metaKey) && /[\+\-\=\_]/.test(t.key) && (t.preventDefault(), warn())
}));
let lastTouchDistance = 0;
addEventListener("touchmove", (t => {
    2 === t.touches.length && (t.preventDefault(), warn())
}), {
    passive: !1
});
let lastTouchEnd = 0;
addEventListener("touchend", (t => {
    const e = Date.now();
    e - lastTouchEnd <= 300 && (t.preventDefault(), warn()), lastTouchEnd = e
}), {
    passive: !1
});